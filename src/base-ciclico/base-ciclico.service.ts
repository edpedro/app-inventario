import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadDto } from 'src/utils/file-upload.dto';
import { CreateBaseCiclicoDto } from './dto/create-base-ciclico.dto';
import * as XLSX from 'xlsx';
import { CreateBaseWmDto } from 'src/base-wms/dto/create-base-wm.dto';
import { CreateBaseSapDto } from 'src/base-sap/dto/create-base-sap.dto';
import { DeleteBaseCiclicoDto } from './dto/delete-base-ciclico.dto';

@Injectable()
export class BaseCiclicoService {
  constructor(private readonly prisma: PrismaService) {}

  async fileBaseCiclico(
    file: UploadDto,
    dataCiclico: CreateBaseCiclicoDto,
    req: any,
  ) {
    const baseCiclicoExists = await this.prisma.baseCiclico.findFirst({
      where: {
        usernameCiclico: dataCiclico.usernameCiclico,
      },
    });

    if (baseCiclicoExists) {
      throw new HttpException('Username já cadastrado', HttpStatus.BAD_REQUEST);
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataJson = XLSX.utils.sheet_to_json(sheet);
    const convertArray = Object.keys(dataJson).map(
      (key) => `${dataJson[key].Item}`,
    );

    const baseWmsExists = await this.prisma.baseWms.findMany({
      where: {
        item: { in: convertArray },
        username: dataCiclico.usernameWms,
        date: dataCiclico.dateWms,
        user_id: req.user_id,
      },
    });

    if (baseWmsExists.length <= 0) {
      throw new HttpException(
        'Nenhuma informaçao encontrada WMS',
        HttpStatus.BAD_REQUEST,
      );
    }

    const baseSapExists = await this.prisma.baseSap.findMany({
      where: {
        material: { in: convertArray },
        username: dataCiclico.usernameSap,
        date: dataCiclico.dateSap,
        user_id: req.user_id,
      },
    });

    if (baseSapExists.length <= 0) {
      throw new HttpException(
        'Nenhuma informaçao encontrada SAP',
        HttpStatus.BAD_REQUEST,
      );
    }

    const somaSaldoDuplicadoWms: CreateBaseWmDto[] = Object.values(
      baseWmsExists.reduce((acc, wms) => {
        acc[wms.item] = acc[wms.item]
          ? {
              ...wms,
              saldo: Number(wms.saldo) + Number(acc[wms.item].saldo),
            }
          : wms;
        return acc;
      }, {}),
    );

    //soma valores duplicados
    const somaSaldoDuplicadoSap: CreateBaseSapDto[] = Object.values(
      baseSapExists.reduce((acc, sap) => {
        acc[sap.material] = acc[sap.material]
          ? {
              ...sap,
              UtilLivre:
                Number(sap.UtilLivre) + Number(acc[sap.material].UtilLivre),
            }
          : sap;
        return acc;
      }, {}),
    );

    const data = [];

    somaSaldoDuplicadoWms.map(function (wms) {
      somaSaldoDuplicadoSap.map(function (sap) {
        if (wms.item === sap.material) {
          data.push({
            deposito: sap.deposito,
            centro: sap.centro,
            item: sap.material,
            descricao: sap.textBreve,
            saldoSap: sap.UtilLivre,
            saldoWms: wms.saldo,
            ValUtilLivre: sap.ValUtilLivre,
            dateCiclico: dataCiclico.dateCiclico,
            usernameCiclico: dataCiclico.usernameCiclico,
            usernameSap: dataCiclico.usernameSap,
            dateSap: dataCiclico.dateSap,
            usernameWms: dataCiclico.usernameWms,
            dateWms: dataCiclico.dateWms,
            user_id: req.user.id,
          });
        }
      });
    });

    const createCiclico = await this.prisma.baseCiclico.createMany({
      data,
    });

    return createCiclico;
  }

  async listBaseCiclico(data: DeleteBaseCiclicoDto, req: any) {
    const baseCiclicoExists = await this.prisma.baseCiclico.findMany({
      where: {
        usernameCiclico: data.username,
        dateCiclico: data.date,
        user_id: req.user.id,
      },
    });

    if (baseCiclicoExists.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return baseCiclicoExists;
  }

  async destroyBaseCiclico(data: DeleteBaseCiclicoDto, req: any) {
    const baseCiclicoExists = await this.prisma.baseCiclico.findMany({
      where: {
        usernameCiclico: data.username,
        dateCiclico: data.date,
        user_id: req.user.id,
      },
    });

    if (baseCiclicoExists.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.ficha.deleteMany({
      where: {
        username: data.username,
        date: data.date,
        user_id: req.user.id,
      },
    });

    return await this.prisma.baseCiclico.deleteMany({
      where: {
        usernameCiclico: data.username,
        dateCiclico: data.date,
        user_id: req.user.id,
      },
    });
  }
}
