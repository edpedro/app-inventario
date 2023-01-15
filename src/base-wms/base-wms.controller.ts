import { multerOptions, UploadDto } from './../utils/file-upload.dto';
import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Get,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseWmsService } from './base-wms.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { DeleteBaseWmDto } from './dto/delete-base-wm.dto copy';

@Controller('upload-wms')
@UseGuards(AuthGuard('jwt'))
export class BaseWmsController {
  constructor(private readonly baseWmsService: BaseWmsService) {}

  @Post('/file')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updalodCsv(
    @UploadedFile() file: UploadDto,
    @Body() data: UploadDto,
    @Req() req: any,
  ) {
    return this.baseWmsService.uploadWms(file, data, req);
  }

  @Delete()
  async destroy(@Body() body: DeleteBaseWmDto, @Req() req: any) {
    return await this.baseWmsService.destroyBaseWms(body, req);
  }

  @Get()
  async listWMS(@Body() body: DeleteBaseWmDto, @Req() req: any) {
    return await this.baseWmsService.listBaseWms(body, req);
  }
}
