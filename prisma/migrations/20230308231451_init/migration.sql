-- CreateTable
CREATE TABLE "SupportAgent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SupportCase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'RETURN',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "supportAgentId" INTEGER,
    CONSTRAINT "SupportCase_supportAgentId_fkey" FOREIGN KEY ("supportAgentId") REFERENCES "SupportAgent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
