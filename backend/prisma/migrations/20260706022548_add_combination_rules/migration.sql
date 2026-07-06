-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "CombinationRule" (
    "id" SERIAL NOT NULL,
    "ingredientAId" INTEGER NOT NULL,
    "ingredientBId" INTEGER NOT NULL,
    "severity" "Severity" NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CombinationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CombinationRule_ingredientAId_ingredientBId_key" ON "CombinationRule"("ingredientAId", "ingredientBId");

-- AddForeignKey
ALTER TABLE "CombinationRule" ADD CONSTRAINT "CombinationRule_ingredientAId_fkey" FOREIGN KEY ("ingredientAId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinationRule" ADD CONSTRAINT "CombinationRule_ingredientBId_fkey" FOREIGN KEY ("ingredientBId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
