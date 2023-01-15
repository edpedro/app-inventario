import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadDto } from 'src/utils/file-upload.dto';
import { CreateBaseSapDto } from './dto/create-base-sap.dto';
import * as XLSX from 'xlsx';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteBaseSapDto } from './dto/delete-base-sap.dto';
import { DeleteBaseWmDto } from 'src/base-wms/dto/delete-base-wm.dto copy';

@Injectable()
export class BaseSapService {
  constructor(private readonly prisma: PrismaService) {}

  async fileBaseWms(file: UploadDto, dataSap: UploadDto, req: any) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataJson = XLSX.utils.sheet_to_json(sheet);
    const data: CreateBaseSapDto[] = dataJson.map((row) => {
      return {
        centro: row['Centro'],
        deposito: row['Depósito'],
        material: String(row['Material']),
        textBreve: row['Texto breve material'],
        UtilLivre: row['Utilização livre'],
        ValUtilLivre: row['Val.utiliz.livre'],
        username: dataSap.username,
        date: dataSap.date,
        user_id: req.user.id,
      };
    });

    const baseSapExists = await this.prisma.baseSap.findFirst({
      where: {
        username: dataSap.username,
      },
    });

    if (baseSapExists) {
      throw new HttpException('Username já cadastrado', HttpStatus.BAD_REQUEST);
    }

    const createSap = await this.prisma.baseSap.createMany({
      data,
    });

    return createSap;
  }

  async listBaseSap(data: DeleteBaseSapDto, req: any) {
    const baseSapExists = await this.prisma.baseSap.findMany({
      where: {
        username: data.username,
        date: data.date,
        user_id: req.user.id,
      },
    });

    if (baseSapExists.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return baseSapExists;
  }

  async destroyBaseSap(data: DeleteBaseWmDto, req: any) {
    const baseSapExists = await this.prisma.baseSap.findMany({
      where: {
        username: data.username,
        date: data.date,
        user_id: req.user.id,
      },
    });

    if (baseSapExists.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.baseSap.deleteMany({
      where: {
        username: data.username,
        date: data.date,
        user_id: req.user.id,
      },
    });
  }
}
