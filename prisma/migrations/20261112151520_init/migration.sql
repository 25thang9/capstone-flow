-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('NEW', 'CONTACTED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" SERIAL NOT NULL,
    "lecturer_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT,
    "requirements" TEXT,
    "technologies" TEXT,
    "max_students" INTEGER NOT NULL DEFAULT 1,
    "status" "TopicStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "student_name" VARCHAR(150) NOT NULL,
    "student_code" VARCHAR(30),
    "student_email" VARCHAR(255) NOT NULL,
    "student_phone" VARCHAR(20) NOT NULL,
    "student_class" VARCHAR(100),
    "message" TEXT,
    "read_at" TIMESTAMP(3),
    "message_read_at" TIMESTAMP(3),
    "status" "RegistrationStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "topics_lecturer_id_idx" ON "topics"("lecturer_id");

-- CreateIndex
CREATE INDEX "topics_status_idx" ON "topics"("status");

-- CreateIndex
CREATE INDEX "registrations_topic_id_idx" ON "registrations"("topic_id");

-- CreateIndex
CREATE INDEX "registrations_read_at_idx" ON "registrations"("read_at");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_topic_id_student_email_key" ON "registrations"("topic_id", "student_email");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
