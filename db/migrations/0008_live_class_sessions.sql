CREATE TABLE "live_class_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"mode" text NOT NULL,
	"cancelled_at" timestamp with time zone,
	CONSTRAINT "live_class_sessions_mode_check" CHECK ("live_class_sessions"."mode" in ('classroom', 'online'))
);
--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "live_class_session_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "live_class_sessions_active_start_mode_idx" ON "live_class_sessions" USING btree ("starts_at","mode") WHERE "live_class_sessions"."cancelled_at" is null;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_live_class_session_id_live_class_sessions_id_fk" FOREIGN KEY ("live_class_session_id") REFERENCES "public"."live_class_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "enquiries_person_live_class_idx" ON "enquiries" USING btree ("person_id","live_class_session_id");