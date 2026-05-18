/*
  Warnings:

  - You are about to drop the column `selectedValue` on the `FormSubmission` table. All the data in the column will be lost.
  - Added the required column `accidentTime` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interventionType` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "selectedValue",
ADD COLUMN     "accidentTime" TEXT NOT NULL,
ADD COLUMN     "interventionType" TEXT NOT NULL;
