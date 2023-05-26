-- CreateTable
CREATE TABLE "AssessmentLog" (
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
    CONSTRAINT "AssessmentLog_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
