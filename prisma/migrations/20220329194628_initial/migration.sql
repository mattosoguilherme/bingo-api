/*
  Warnings:

  - You are about to drop the `numberForCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "numberForCard" DROP CONSTRAINT "numberForCard_cardId_fkey";

-- DropTable
DROP TABLE "numberForCard";

-- CreateTable
CREATE TABLE "checked" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "check" BOOLEAN NOT NULL,
    "cardId" INTEGER,

    CONSTRAINT "checked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checked" ADD CONSTRAINT "checked_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
