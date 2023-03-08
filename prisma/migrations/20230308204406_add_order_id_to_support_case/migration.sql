/*
  Warnings:

  - Added the required column `orderId` to the `SupportCase` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SupportCase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'RETURN',
    "supportAgentId" INTEGER NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SupportCase_supportAgentId_fkey" FOREIGN KEY ("supportAgentId") REFERENCES "SupportAgent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SupportCase" ("id", "reason", "resolved", "supportAgentId") SELECT "id", "reason", "resolved", "supportAgentId" FROM "SupportCase";
DROP TABLE "SupportCase";
ALTER TABLE "new_SupportCase" RENAME TO "SupportCase";
CREATE UNIQUE INDEX "SupportCase_supportAgentId_key" ON "SupportCase"("supportAgentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
