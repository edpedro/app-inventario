import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Get,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, UploadDto } from 'src/utils/file-upload.dto';
import { BaseCiclicoService } from './base-ciclico.service';
import { CreateBaseCiclicoDto } from './dto/create-base-ciclico.dto';
import { DeleteBaseCiclicoDto } from './dto/delete-base-ciclico.dto';

@Controller('upload-ciclico')
@UseGuards(AuthGuard('jwt'))
export class BaseCiclicoController {
  constructor(private readonly baseCiclicoService: BaseCiclicoService) {}

  @Post('/file')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updalodCsv(
    @UploadedFile() file: UploadDto,
    @Body() data: CreateBaseCiclicoDto,
    @Req() req: any,
  ) {
    return this.baseCiclicoService.fileBaseCiclico(file, data, req);
  }

  @Get()
  async listCiclico(@Body() body: DeleteBaseCiclicoDto, @Req() req: any) {
    return await this.baseCiclicoService.listBaseCiclico(body, req);
  }

  @Delete()
  async destroy(@Body() body: DeleteBaseCiclicoDto, @Req() req: any) {
    return await this.baseCiclicoService.destroyBaseCiclico(body, req);
  }
}
