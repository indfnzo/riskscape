-- CreateTable
CREATE TABLE "AssessmentLogImage" (
    "assessmentLogId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    CONSTRAINT "AssessmentLogImage_assessmentLogId_fkey" FOREIGN KEY ("assessmentLogId") REFERENCES "AssessmentLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssessmentLogImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "data" BLOB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentLogImage_assessmentLogId_imageId_key" ON "AssessmentLogImage"("assessmentLogId", "imageId");
