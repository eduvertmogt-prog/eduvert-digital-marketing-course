CREATE TABLE "admin_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"credential_version" integer DEFAULT 1 NOT NULL,
	"owner" boolean DEFAULT false NOT NULL,
	"needs_password_change" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_accounts_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "admin_login_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"attempts" integer NOT NULL,
	"resets_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"credential_version" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_account_id_admin_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."admin_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_login_limits_expiry_idx" ON "admin_login_limits" USING btree ("resets_at");--> statement-breakpoint
CREATE INDEX "admin_sessions_account_idx" ON "admin_sessions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "admin_sessions_expiry_idx" ON "admin_sessions" USING btree ("expires_at");