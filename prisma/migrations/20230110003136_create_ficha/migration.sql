-- CreateTable
CREATE TABLE "ficha" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipoEstoque" TEXT NOT NULL,
    "catItem" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ficha_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ficha" ADD CONSTRAINT "ficha_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
