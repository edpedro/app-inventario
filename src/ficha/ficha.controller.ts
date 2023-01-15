import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { FichaService } from './ficha.service';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, UploadDto } from 'src/utils/file-upload.dto';

@Controller('ficha')
@UseGuards(AuthGuard('jwt'))
export class FichaController {
  constructor(private readonly fichaService: FichaService) {}

  @Get()
  async listCiclico(
    @Body() body: CreateFichaDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    await this.fichaService.generateFicha(body, req, res);
  }

  @Put('/file')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updalodCsv(
    @UploadedFile() file: UploadDto,
    @Body() data: UploadDto,
    @Req() req: any,
  ) {
    return this.fichaService.uploadFicha(file, data, req);
  }
}
