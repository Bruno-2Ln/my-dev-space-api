-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Techno" ADD VALUE 'SCSS';
ALTER TYPE "Techno" ADD VALUE 'PRISMA';
ALTER TYPE "Techno" ADD VALUE 'MONGOOSE';
ALTER TYPE "Techno" ADD VALUE 'POSTGRES';
ALTER TYPE "Techno" ADD VALUE 'FIGMA';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "galleryVisibility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiredSkills" TEXT[];
