-- CreateTable
CREATE TABLE "Receiver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "balance" DECIMAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receiver_id" TEXT NOT NULL,
    "gross_value" DECIMAL NOT NULL,
    "fee" DECIMAL NOT NULL,
    "net_value" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "Operation_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "Receiver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
