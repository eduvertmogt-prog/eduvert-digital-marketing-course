CREATE TABLE "student_fees" (
	"person_id" uuid NOT NULL,
	"course_slug" text NOT NULL,
	"agreed_paise" integer NOT NULL,
	"set_by" text NOT NULL,
	"set_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_fees_person_id_course_slug_pk" PRIMARY KEY("person_id","course_slug"),
	CONSTRAINT "student_fees_amount_check" CHECK ("student_fees"."agreed_paise" between 0 and 100000000)
);
--> statement-breakpoint
CREATE TABLE "student_payments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"person_id" uuid NOT NULL,
	"course_slug" text NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"amount_paise" integer NOT NULL,
	"paid_on" date NOT NULL,
	"reference" text,
	"recorded_by" text NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"voided_at" timestamp with time zone,
	"voided_by" text,
	"void_reason" text,
	CONSTRAINT "student_payments_kind_check" CHECK ("student_payments"."kind" in ('deposit', 'instalment')),
	CONSTRAINT "student_payments_amount_check" CHECK ("student_payments"."amount_paise" between 1 and 100000000)
);
--> statement-breakpoint
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_payments" ADD CONSTRAINT "student_payments_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_payments" ADD CONSTRAINT "student_payments_fee_fk" FOREIGN KEY ("person_id","course_slug") REFERENCES "public"."student_fees"("person_id","course_slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "student_payments_fee_idx" ON "student_payments" USING btree ("person_id","course_slug","paid_on");
--> statement-breakpoint
CREATE FUNCTION manage_student_fee(
  enquiry uuid, course text, operation text, actor text, amount integer, expected_fee integer,
  payment uuid, payment_kind text, paid_date date, payment_note text
) RETURNS boolean LANGUAGE plpgsql VOLATILE SET search_path = public, pg_temp AS $$
DECLARE
  lead enquiries%ROWTYPE;
  fee student_fees%ROWTYPE;
  entry student_payments%ROWTYPE;
  received bigint;
  activity_note text;
BEGIN
  SELECT * INTO lead FROM enquiries WHERE id = enquiry FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'Enquiry not found.';
  END IF;
  -- One ledger per learner and course, including when staff use different enquiries.
  PERFORM 1 FROM persons WHERE id = lead.person_id FOR NO KEY UPDATE;
  SELECT * INTO fee FROM student_fees WHERE person_id = lead.person_id AND course_slug = course;

  IF operation = 'void' THEN
    SELECT * INTO entry FROM student_payments WHERE id = payment AND person_id = lead.person_id AND course_slug = course;
    IF NOT FOUND THEN
      RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'Payment not found on this ledger.';
    END IF;
    IF entry.voided_at IS NOT NULL THEN RETURN true; END IF;
    UPDATE student_payments SET voided_at = clock_timestamp(), voided_by = actor, void_reason = payment_note WHERE id = payment;
    activity_note := 'Voided a ' || entry.kind || ' payment for ' || course || '. Reason: ' || payment_note;
  ELSE
    IF lead.status <> 'enrolled' THEN
      RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'Mark this enquiry enrolled before setting a fee or recording a payment.';
    END IF;
    IF fee.person_id IS NULL
      AND EXISTS (SELECT 1 FROM enquiry_course_interests WHERE enquiry_id = enquiry)
      AND NOT EXISTS (SELECT 1 FROM enquiry_course_interests WHERE enquiry_id = enquiry AND course_slug = course)
      AND NOT EXISTS (SELECT 1 FROM batch_placements WHERE enquiry_id = enquiry AND course_slug = course AND state = 'seated') THEN
      RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'Choose a course listed on the enquiry or assigned batch.';
    END IF;
    SELECT coalesce(sum(amount_paise), 0) INTO received FROM student_payments
      WHERE person_id = lead.person_id AND course_slug = course AND voided_at IS NULL;

    IF operation = 'fee' THEN
      IF fee.agreed_paise = amount THEN RETURN true; END IF;
      IF fee.agreed_paise IS DISTINCT FROM expected_fee THEN
        RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'The agreed fee changed. Review the latest total and try again.';
      END IF;
      IF amount < received THEN
        RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'The agreed fee cannot be below the amount already received.';
      END IF;
      INSERT INTO student_fees (person_id, course_slug, agreed_paise, set_by, set_at)
        VALUES (lead.person_id, course, amount, actor, clock_timestamp())
        ON CONFLICT (person_id, course_slug) DO UPDATE
        SET agreed_paise = excluded.agreed_paise, set_by = excluded.set_by, set_at = excluded.set_at;
      activity_note := 'Set agreed fee for ' || course || ' to ₹' || (amount / 100.0)::numeric(12,2)::text ||
        CASE WHEN fee.agreed_paise IS NULL THEN '.' ELSE ' from ₹' || (fee.agreed_paise / 100.0)::numeric(12,2)::text || '.' END;
    ELSIF operation = 'record' THEN
      SELECT * INTO entry FROM student_payments WHERE id = payment;
      IF FOUND THEN
        IF entry.person_id = lead.person_id AND entry.course_slug = course
          AND entry.kind = payment_kind AND entry.amount_paise = amount AND entry.paid_on = paid_date
          AND entry.reference IS NOT DISTINCT FROM payment_note THEN RETURN true; END IF;
        RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'This payment request was already used. Refresh the ledger.';
      END IF;
      IF fee.agreed_paise IS NULL OR received + amount > fee.agreed_paise THEN
        RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'Set the agreed fee first and keep the payment within the outstanding balance.';
      END IF;
      IF paid_date > (now() AT TIME ZONE 'Asia/Kolkata')::date THEN
        RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'Payment date cannot be in the future.';
      END IF;
      INSERT INTO student_payments (id, person_id, course_slug, enquiry_id, kind, amount_paise, paid_on, reference, recorded_by)
        VALUES (payment, lead.person_id, course, enquiry, payment_kind, amount, paid_date, payment_note, actor);
      activity_note := 'Recorded ' || payment_kind || ' of ₹' || (amount / 100.0)::numeric(12,2)::text || ' for ' || course || '.';
    ELSE
      RAISE EXCEPTION USING ERRCODE = 'EF001', MESSAGE = 'Unknown fee action.';
    END IF;
  END IF;

  INSERT INTO follow_ups (enquiry_id, channel, note, author, next_action_at, created_at)
    VALUES (enquiry, 'other', activity_note, actor,
      (SELECT next_action_at FROM follow_ups WHERE enquiry_id = enquiry ORDER BY created_at DESC, id DESC LIMIT 1),
      clock_timestamp());
  RETURN true;
END;
$$;
