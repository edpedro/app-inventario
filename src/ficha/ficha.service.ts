import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseCicloarrayDto } from './dto/array-ficha.dto';
import { CreateFichaDto } from './dto/create-ficha.dto';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import { join } from 'path';
import { sumAmounts } from 'src/utils/sumAmounts';
import { UploadDto } from 'src/utils/file-upload.dto';
import { CreateBaseWmDto } from 'src/base-wms/dto/create-base-wm.dto';

@Injectable()
export class FichaService {
  constructor(private readonly prisma: PrismaService) {}

  async generateFicha(
    dataFicha: CreateFichaDto,
    req: any,
    @Res() res: Response,
  ) {
    const fichaExists = await this.prisma.ficha.findMany({
      where: {
        username: dataFicha.username,
        date: dataFicha.date,
        user_id: req.user.id,
      },
      orderBy: [{ endereco: 'asc' }],
      select: {
        item: true,
        descricao: true,
        endereco: true,
        tipoEstoque: true,
        catItem: true,
        saldo: true,
      },
    });

    if (fichaExists.length <= 0) {
      const baseCiclicoExists: BaseCicloarrayDto[] =
        await this.prisma.baseCiclico.findMany({
          where: {
            usernameCiclico: dataFicha.username,
            dateCiclico: dataFicha.date,
            user_id: req.user.id,
          },
        });

      if (baseCiclicoExists.length <= 0) {
        throw new HttpException(
          'Dados não encontrados',
          HttpStatus.BAD_REQUEST,
        );
      }

      const convertObjectArray = Object.keys(baseCiclicoExists).map(
        (key) => baseCiclicoExists[key].item,
      );

      const nameWms = baseCiclicoExists.map((key) => key.usernameWms);

      const baseWms = await this.prisma.baseWms.findMany({
        where: {
          item: { in: convertObjectArray },
          username: nameWms[0],
          user_id: req.user.id,
        },
        orderBy: [{ endereco: 'asc' }],
        select: {
          item: true,
          descricao: true,
          endereco: true,
          tipoEstoque: true,
          catItem: true,
          saldo: true,
        },
      });

      if (baseWms.length <= 0) {
        throw new HttpException(
          'Dados não encontrados',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = sumAmounts(baseWms, dataFicha, req);

      await this.prisma.ficha.createMany({
        data,
      });

      data.forEach((row) => (row['Saldo'] = ''));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, 'ficha.xlsx');

      const file = join(__dirname, '..', '..', 'ficha.xlsx');
      res.download(file, `ficha_${dataFicha.username}.xlsx`);
    } else {
      const ws = XLSX.utils.json_to_sheet(fichaExists);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, 'ficha.xlsx');

      const file = join(__dirname, '..', '..', 'ficha.xlsx');
      res.download(file, `ficha_${dataFicha.username}.xlsx`);
    }
  }

  async uploadFicha(file: UploadDto, dataWms: UploadDto, req: any) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataJson = XLSX.utils.sheet_to_json(sheet);
    const dataExcel: CreateBaseWmDto[] = dataJson.map((row) => {
      return {
        item: String(row['item']),
        descricao: row['descricao'],
        endereco: row['endereco'],
        tipoEstoque: row['tipoEstoque'],
        catItem: row['catItem'],
        saldo: row['saldo'],
        username: dataWms.username,
        date: dataWms.date,
        user_id: req.user.id,
      };
    });

    const baseFichaExists = await this.prisma.ficha.findMany({
      where: {
        username: dataWms.username,
        date: dataWms.date,
        user_id: req.user.id,
      },
    });

    if (baseFichaExists.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    const baseCiclicoaExists = await this.prisma.baseCiclico.findMany({
      where: {
        usernameCiclico: dataWms.username,
        dateCiclico: dataWms.date,
        user_id: req.user.id,
      },
    });

    if (baseCiclicoaExists.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    const baseCiclicoNew = dataExcel.reduce((total, obj) => {
      const found = total.find((o) => o.item === obj.item);
      if (found) {
        found.saldo += obj.saldo;
      } else {
        total.push(obj);
      }
      return total;
    }, []);

    for (const dataUpdate of dataExcel) {
      const options = {
        data: {
          saldo: dataUpdate.saldo,
        },
        where: {
          item: dataUpdate.item,
          endereco: dataUpdate.endereco,
          username: dataWms.username,
          date: dataWms.date,
          user_id: req.user.id,
        },
      };
      await this.prisma.ficha.updateMany(options);
    }

    for (const dataUpdate of baseCiclicoNew) {
      const options = {
        data: {
          saldoFisico: dataUpdate.saldo,
        },
        where: {
          item: dataUpdate.item,
          usernameCiclico: dataWms.username,
          dateCiclico: dataWms.date,
          user_id: req.user.id,
        },
      };
      await this.prisma.baseCiclico.updateMany(options);
    }

    return { msg: 'dados atualizados' };
  }
}
