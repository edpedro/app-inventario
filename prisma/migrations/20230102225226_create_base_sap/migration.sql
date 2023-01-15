-- CreateTable
CREATE TABLE "baseSap" (
    "id" SERIAL NOT NULL,
    "centro" TEXT NOT NULL,
    "deposito" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "textBreve" TEXT NOT NULL,
    "UtilLivre" DOUBLE PRECISION NOT NULL,
    "ValUtilLivre" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "baseSap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "baseSap" ADD CONSTRAINT "baseSap_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
