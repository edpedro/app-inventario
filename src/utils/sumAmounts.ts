import { CreateFichaDto } from 'src/ficha/dto/create-ficha.dto';
import { Response } from 'express';

type BaseWMS = {
  item: string;
  descricao: string;
  endereco: string;
  tipoEstoque: string;
  catItem: string;
  saldo: number;
};

export function sumAmounts(array: BaseWMS[], data: CreateFichaDto, req: any) {
  return array.reduce((acc, curr) => {
    const existingItem = acc.find(
      (item) => item.item === curr.item && item.endereco === curr.endereco,
    );
    if (!existingItem) {
      acc.push({
        item: curr.item,
        descricao: curr.descricao,
        endereco: curr.endereco,
        tipoEstoque: curr.tipoEstoque,
        catItem: curr.catItem,
        username: data.username,
        date: data.date,
        user_id: req.user.id,
      });
    }
    return acc;
  }, []);
}
