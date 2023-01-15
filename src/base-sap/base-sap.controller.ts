import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, UploadDto } from 'src/utils/file-upload.dto';
import { BaseSapService } from './base-sap.service';
import { CreateBaseSapDto } from './dto/create-base-sap.dto';
import { DeleteBaseSapDto } from './dto/delete-base-sap.dto';

@Controller('upload-sap')
@UseGuards(AuthGuard('jwt'))
export class BaseSapController {
  constructor(private readonly baseSapService: BaseSapService) {}

  @Post('/file')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updalodCsv(
    @UploadedFile() file: UploadDto,
    @Body() data: UploadDto,
    @Req() req: any,
  ) {
    return this.baseSapService.fileBaseWms(file, data, req);
  }

  @Get()
  async listSAP(@Body() body: CreateBaseSapDto, @Req() req: any) {
    return await this.baseSapService.listBaseSap(body, req);
  }

  @Delete()
  async destroy(@Body() body: DeleteBaseSapDto, @Req() req: any) {
    return await this.baseSapService.destroyBaseSap(body, req);
  }
}
