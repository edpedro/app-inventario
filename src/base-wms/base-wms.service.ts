import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBaseWmDto } from './dto/create-base-wm.dto';
import { UploadDto } from './../utils/file-upload.dto';
import * as XLSX from 'xlsx';
import { DeleteBaseWmDto } from './dto/delete-base-wm.dto copy';

@Injectable()
export class BaseWmsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadWms(file: UploadDto, dataWms: UploadDto, req: any) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataJson = XLSX.utils.sheet_to_json(sheet);
    const data: CreateBaseWmDto[] = dataJson.map((row) => {
      return {
        item: String(row['Item']),
        descricao: row['Descricao'],
        endereco: row['Endereco'],
        tipoEstoque: row['Tip.Estoque'],
        catItem: row['Cat.Item'],
        saldo: row['Dispon.Exped.'],
        username: dataWms.username,
        date: dataWms.date,
        user_id: req.user.id,
      };
    });

    const baseWmsExists = await this.prisma.baseWms.findFirst({
      where: {
        username: dataWms.username,
      },
    });

    if (baseWmsExists) {
      throw new HttpException('Username já cadastrado', HttpStatus.BAD_REQUEST);
    }

    const createWms = await this.prisma.baseWms.createMany({
      data,
    });

    return createWms;
  }

  async destroyBaseWms(data: DeleteBaseWmDto, req: any) {
    const baseWmsExists = await this.prisma.baseWms.findMany({
      where: {
        username: data.username,
        date: data.date,
        user_id: req.user.id,
      },
    });

    if (baseWmsExists.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.baseWms.deleteMany({
      where: {
        username: data.username,
        date: data.date,
        user_id: req.user.id,
      },
    });
  }

  async listBaseWms(data: DeleteBaseWmDto, req: any) {
    const baseWmsExists = await this.prisma.baseWms.findMany({
      where: {
        username: data.username,
        date: data.date,
        user_id: req.user.id,
      },
    });

    if (baseWmsExists.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return baseWmsExists;
  }
}
