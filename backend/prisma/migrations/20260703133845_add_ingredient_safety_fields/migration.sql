-- CreateEnum
CREATE TYPE "IngredientStatus" AS ENUM ('SAFE', 'BANNED', 'SCHEDULE_H', 'EU_BANNED');

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "reason" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "status" "IngredientStatus" NOT NULL DEFAULT 'SAFE';
