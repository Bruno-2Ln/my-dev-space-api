-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('FUNCTIONAL', 'TECHNICAL', 'ARCHITECTURE', 'SOFT_SKILL');

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "type" "SkillType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_label_key" ON "Skill"("label");
