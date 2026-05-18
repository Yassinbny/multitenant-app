/*
  Warnings:

  - You are about to drop the column `interventionType` on the `FormSubmission` table. All the data in the column will be lost.
  - Added the required column `damageDescription` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licensePlate` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "interventionType",
ADD COLUMN     "damageDescription" TEXT NOT NULL,
ADD COLUMN     "licensePlate" TEXT NOT NULL;
