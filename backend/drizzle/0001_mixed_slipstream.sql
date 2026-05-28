DROP INDEX "notebook_id_idx";--> statement-breakpoint
CREATE INDEX "notebook_id_idx" ON "resource" USING btree ("notebook_id");