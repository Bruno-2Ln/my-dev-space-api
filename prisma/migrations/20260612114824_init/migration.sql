-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "gameName" TEXT NOT NULL DEFAULT 'snake',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);
