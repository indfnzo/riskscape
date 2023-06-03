/*
  Warnings:

  - Added the required column `formCompletionDuration` to the `AssessmentLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssessmentLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "buildingId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "inspectionDate" DATETIME NOT NULL,
    "inspectorName" TEXT NOT NULL,
    "inspectorAffiliation" TEXT NOT NULL,
    "inspectorDesignation" TEXT NOT NULL,
    "inspectionScope" TEXT NOT NULL,
    "inspectionData" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "formCompletionDuration" INTEGER NOT NULL,
    CONSTRAINT "AssessmentLog_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentLog" ("buildingId", "contactEmail", "contactName", "contactPhone", "id", "inspectionData", "inspectionDate", "inspectionScope", "inspectorAffiliation", "inspectorDesignation", "inspectorName", "type") SELECT "buildingId", "contactEmail", "contactName", "contactPhone", "id", "inspectionData", "inspectionDate", "inspectionScope", "inspectorAffiliation", "inspectorDesignation", "inspectorName", "type" FROM "AssessmentLog";
DROP TABLE "AssessmentLog";
ALTER TABLE "new_AssessmentLog" RENAME TO "AssessmentLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
