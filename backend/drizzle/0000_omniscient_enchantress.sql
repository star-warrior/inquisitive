CREATE TYPE "public"."difficulty" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
CREATE TYPE "public"."length" AS ENUM('short', 'medium', 'long');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('article', 'video');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('todo', 'in_progress', 'completed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."topic_level" AS ENUM('beginner', 'intermediate', 'hard');--> statement-breakpoint
CREATE TABLE "notebook" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deviceId" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"topic" varchar(255) NOT NULL,
	"level" "topic_level" NOT NULL,
	"length" "length" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notebook_id" uuid NOT NULL,
	"title" text NOT NULL,
	"url" varchar(255) NOT NULL,
	"thumbnail" text,
	"source_type" "source_type" NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"status" "status" NOT NULL,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_notebook_id_notebook_id_fk" FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notebook_id_idx" ON "resource" USING btree ("notebook_id");