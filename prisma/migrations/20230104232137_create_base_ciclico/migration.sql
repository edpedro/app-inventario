-- CreateTable
CREATE TABLE "baseCiclico" (
    "id" SERIAL NOT NULL,
    "deposito" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "saldoSap" DOUBLE PRECISION NOT NULL,
    "saldoWms" DOUBLE PRECISION NOT NULL,
    "saldoFisico" DOUBLE PRECISION NOT NULL,
    "ValUtilLivre" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "baseCiclico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "baseCiclico" ADD CONSTRAINT "baseCiclico_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
