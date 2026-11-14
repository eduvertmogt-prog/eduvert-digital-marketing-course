CREATE TABLE "batch_placements" (
	"batch_id" uuid NOT NULL,
	"course_slug" text NOT NULL,
	"person_id" uuid NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"state" text NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "batch_placements_person_course" UNIQUE("person_id","course_slug"),
	CONSTRAINT "batch_placements_state_check" CHECK ("batch_placements"."state" in ('seated', 'waitlisted'))
);
--> statement-breakpoint
CREATE TABLE "course_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_slug" text NOT NULL,
	"name" text NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date,
	"capacity" integer NOT NULL,
	"accepting" boolean DEFAULT true NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "course_batches_id_course" UNIQUE("id","course_slug"),
	CONSTRAINT "course_batches_capacity_check" CHECK ("course_batches"."capacity" between 1 and 1000),
	CONSTRAINT "course_batches_dates_check" CHECK ("course_batches"."ends_on" >= "course_batches"."starts_on")
);
--> statement-breakpoint
ALTER TABLE "batch_placements" ADD CONSTRAINT "batch_placements_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_placements" ADD CONSTRAINT "batch_placements_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_placements" ADD CONSTRAINT "batch_placements_batch_course_fk" FOREIGN KEY ("batch_id","course_slug") REFERENCES "public"."course_batches"("id","course_slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "batch_placements_batch_idx" ON "batch_placements" USING btree ("batch_id","state","added_at","enquiry_id");--> statement-breakpoint
CREATE INDEX "batch_placements_enquiry_idx" ON "batch_placements" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "course_batches_starts_on_idx" ON "course_batches" USING btree ("starts_on");
--> statement-breakpoint
CREATE FUNCTION update_course_batch(
  target uuid, expected_revision integer, batch_name text, start_date date, end_date date,
  seat_capacity integer, is_accepting boolean
) RETURNS boolean LANGUAGE plpgsql VOLATILE SET search_path = public, pg_temp AS $$
DECLARE current_batch course_batches%ROWTYPE;
BEGIN
  SELECT * INTO current_batch FROM course_batches WHERE id = target FOR UPDATE;
  IF NOT FOUND OR current_batch.revision <> expected_revision THEN
    RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'This batch changed. Refresh it before editing.';
  END IF;
  IF seat_capacity < (SELECT count(*) FROM batch_placements WHERE batch_id = target AND state = 'seated') THEN
    RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'Capacity cannot be below the number of assigned seats.';
  END IF;
  UPDATE course_batches SET name = batch_name, starts_on = start_date, ends_on = end_date,
    capacity = seat_capacity, accepting = is_accepting, revision = revision + 1 WHERE id = target;
  RETURN true;
END;
$$;

--> statement-breakpoint
CREATE FUNCTION change_batch_placement(target_batch uuid, target_enquiry uuid, operation text, staff_email text)
RETURNS boolean LANGUAGE plpgsql VOLATILE SET search_path = public, pg_temp AS $$
DECLARE
  lead enquiries%ROWTYPE;
  batch course_batches%ROWTYPE;
  placement batch_placements%ROWTYPE;
  first_waiting uuid;
  activity_note text;
BEGIN
  SELECT * INTO lead FROM enquiries WHERE id = target_enquiry FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'Enquiry not found.';
  END IF;
  -- Serialize placements for the same person even when staff act on different enquiries.
  PERFORM 1 FROM persons WHERE id = lead.person_id FOR NO KEY UPDATE;
  SELECT * INTO batch FROM course_batches WHERE id = target_batch FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'Batch not found.';
  END IF;
  SELECT * INTO placement FROM batch_placements WHERE person_id = lead.person_id AND course_slug = batch.course_slug;

  IF operation = 'remove' THEN
    IF placement.batch_id IS DISTINCT FROM target_batch OR placement.enquiry_id IS DISTINCT FROM target_enquiry THEN
      RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'This placement changed. Refresh and try again.';
    END IF;
    DELETE FROM batch_placements WHERE person_id = lead.person_id AND course_slug = batch.course_slug;
    activity_note := CASE WHEN placement.state = 'seated' THEN 'Released seat in ' ELSE 'Removed from waitlist for ' END;
  ELSE
    IF operation NOT IN ('seat', 'waitlist', 'promote') THEN
      RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'Invalid placement action.';
    END IF;
    IF placement.batch_id = target_batch AND placement.enquiry_id = target_enquiry
      AND ((operation = 'waitlist' AND placement.state = 'waitlisted') OR
        (operation IN ('seat', 'promote') AND placement.state = 'seated')) THEN
      RETURN true;
    END IF;
    IF NOT batch.accepting THEN
      RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'Reopen this batch before adding learners or promoting the waitlist.';
    END IF;
    IF batch.ends_on < (now() AT TIME ZONE 'Asia/Kolkata')::date THEN
      RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'This batch has ended.';
    END IF;
    IF lead.status IN ('closed', 'spam') OR (operation <> 'waitlist' AND lead.status <> 'enrolled') THEN
      RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'Only enrolled enquiries can be given a seat. Closed or spam enquiries cannot join the waitlist.';
    END IF;
    IF EXISTS (SELECT 1 FROM enquiry_course_interests WHERE enquiry_id = target_enquiry)
      AND NOT EXISTS (SELECT 1 FROM enquiry_course_interests WHERE enquiry_id = target_enquiry AND course_slug = batch.course_slug) THEN
      RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'This batch does not match a course on the enquiry.';
    END IF;
    IF placement.batch_id IS NOT NULL AND operation <> 'promote' THEN
      RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'This learner already has a seat or waitlist place for this course.';
    END IF;
    IF operation <> 'waitlist' THEN
      IF (SELECT count(*) FROM batch_placements WHERE batch_id = target_batch AND state = 'seated') >= batch.capacity THEN
        RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'This batch is full. Add the learner to its waitlist.';
      END IF;
      SELECT enquiry_id INTO first_waiting FROM batch_placements
        WHERE batch_id = target_batch AND state = 'waitlisted' ORDER BY added_at, enquiry_id LIMIT 1;
      IF operation = 'seat' AND first_waiting IS NOT NULL THEN
        RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'This batch has a waitlist. Promote the first learner before assigning a new seat.';
      END IF;
      IF operation = 'promote' AND (first_waiting IS DISTINCT FROM target_enquiry
        OR placement.batch_id IS DISTINCT FROM target_batch OR placement.state IS DISTINCT FROM 'waitlisted') THEN
        RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'Only the first learner on this waitlist can be promoted.';
      END IF;
    END IF;

    IF operation = 'promote' THEN
      UPDATE batch_placements SET state = 'seated' WHERE person_id = lead.person_id AND course_slug = batch.course_slug;
      activity_note := 'Promoted from the waitlist into ';
    ELSE
      INSERT INTO batch_placements (batch_id, course_slug, person_id, enquiry_id, state, added_at)
        VALUES (target_batch, batch.course_slug, lead.person_id, target_enquiry,
          CASE WHEN operation = 'seat' THEN 'seated' ELSE 'waitlisted' END, clock_timestamp());
      activity_note := CASE WHEN operation = 'seat' THEN 'Assigned a seat in ' ELSE 'Added to waitlist for ' END;
    END IF;
  END IF;

  INSERT INTO follow_ups (enquiry_id, channel, note, author, next_action_at, created_at)
    VALUES (target_enquiry, 'other', activity_note || batch.name || '.', staff_email,
      (SELECT next_action_at FROM follow_ups WHERE enquiry_id = target_enquiry ORDER BY created_at DESC, id DESC LIMIT 1),
      clock_timestamp());
  RETURN true;
END;
$$;

--> statement-breakpoint
CREATE FUNCTION check_batch_placement_on_status_change()
RETURNS trigger LANGUAGE plpgsql VOLATILE SET search_path = public, pg_temp AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND EXISTS (
    SELECT 1 FROM batch_placements WHERE enquiry_id = NEW.id
      AND (NEW.status IN ('closed', 'spam') OR (state = 'seated' AND NEW.status <> 'enrolled'))
  ) THEN
    RAISE EXCEPTION USING ERRCODE = 'EB001', MESSAGE = 'Release the seat or remove the waitlist place before changing to this status.';
  END IF;
  RETURN NEW;
END;
$$;

--> statement-breakpoint
CREATE TRIGGER check_batch_placement_on_status_change BEFORE UPDATE OF status ON enquiries
FOR EACH ROW EXECUTE FUNCTION check_batch_placement_on_status_change();
