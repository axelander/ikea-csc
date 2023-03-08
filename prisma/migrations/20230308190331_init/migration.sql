-- CreateTable
CREATE TABLE "SupportAgent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SupportCase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL DEFAULT 'RETURN',
    "supportAgentId" INTEGER NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SupportCase_supportAgentId_fkey" FOREIGN KEY ("supportAgentId") REFERENCES "SupportAgent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportCase_supportAgentId_key" ON "SupportCase"("supportAgentId");
