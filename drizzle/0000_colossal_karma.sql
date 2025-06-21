CREATE TABLE "voice_clones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"voice_name" varchar(100) NOT NULL,
	"original_file_url" text NOT NULL,
	"eleven_labs_voice_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
