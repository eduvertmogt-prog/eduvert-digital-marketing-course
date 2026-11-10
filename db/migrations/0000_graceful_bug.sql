CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'contacted', 'qualified', 'enrolled', 'closed', 'spam');--> statement-breakpoint
CREATE TYPE "public"."enquiry_type" AS ENUM('free_demo', 'counsellor_callback', 'course_enquiry', 'contact_message', 'career_support');--> statement-breakpoint
CREATE TYPE "public"."follow_up_channel" AS ENUM('phone', 'whatsapp', 'email', 'in_person', 'other');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"type" "enquiry_type" NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"subject" text,
	"message" text,
	"origin_page" text,
	"origin_form" text,
	"assigned_to" text,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiry_course_interests" (
	"enquiry_id" uuid NOT NULL,
	"course_slug" text NOT NULL,
	"course_label" text NOT NULL,
	CONSTRAINT "enquiry_course_interests_pkey" PRIMARY KEY("enquiry_id","course_slug")
);
--> statement-breakpoint
CREATE TABLE "follow_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"channel" "follow_up_channel" NOT NULL,
	"note" text NOT NULL,
	"author" text,
	"next_action_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"email" text,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"consent_at" timestamp with time zone,
	"consent_source" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "persons_contact_present" CHECK ("persons"."phone" IS NOT NULL OR "persons"."email" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiry_course_interests" ADD CONSTRAINT "enquiry_course_interests_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "enquiries_person_id_idx" ON "enquiries" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "enquiries_type_idx" ON "enquiries" USING btree ("type");--> statement-breakpoint
CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "follow_ups_enquiry_id_idx" ON "follow_ups" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "follow_ups_next_action_at_idx" ON "follow_ups" USING btree ("next_action_at");--> statement-breakpoint
CREATE UNIQUE INDEX "persons_email_unique" ON "persons" USING btree (lower("email"));