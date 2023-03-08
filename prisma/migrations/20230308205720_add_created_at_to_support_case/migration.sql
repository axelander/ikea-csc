-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SupportCase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'RETURN',
    "supportAgentId" INTEGER NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SupportCase_supportAgentId_fkey" FOREIGN KEY ("supportAgentId") REFERENCES "SupportAgent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SupportCase" ("id", "orderId", "reason", "resolved", "supportAgentId") SELECT "id", "orderId", "reason", "resolved", "supportAgentId" FROM "SupportCase";
DROP TABLE "SupportCase";
ALTER TABLE "new_SupportCase" RENAME TO "SupportCase";
CREATE UNIQUE INDEX "SupportCase_supportAgentId_key" ON "SupportCase"("supportAgentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
