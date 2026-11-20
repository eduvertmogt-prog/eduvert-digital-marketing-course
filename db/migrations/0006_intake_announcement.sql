CREATE TABLE "intake_announcement" (
	"id" integer PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"closes_on" date NOT NULL,
	"seats_remaining" integer NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "intake_announcement_single_row" CHECK ("intake_announcement"."id" = 1),
	CONSTRAINT "intake_announcement_seats_check" CHECK ("intake_announcement"."seats_remaining" between 0 and 1000)
);
--> statement-breakpoint
INSERT INTO "intake_announcement" ("id", "closes_on", "seats_remaining")
VALUES (1, '2026-12-05', 5);
