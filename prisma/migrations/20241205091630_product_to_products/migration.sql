-- DropForeignKey
ALTER TABLE "FilterTag" DROP CONSTRAINT "FilterTag_productId_fkey";

-- CreateTable
CREATE TABLE "_ProductFilterTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductFilterTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductFilterTags_B_index" ON "_ProductFilterTags"("B");

-- AddForeignKey
ALTER TABLE "_ProductFilterTags" ADD CONSTRAINT "_ProductFilterTags_A_fkey" FOREIGN KEY ("A") REFERENCES "FilterTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFilterTags" ADD CONSTRAINT "_ProductFilterTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
