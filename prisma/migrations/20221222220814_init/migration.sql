-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baseWms" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipoEstoque" TEXT NOT NULL,
    "catItem" TEXT NOT NULL,
    "saldo" BIGINT NOT NULL,
    "date" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "baseWms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "baseWms" ADD CONSTRAINT "baseWms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
