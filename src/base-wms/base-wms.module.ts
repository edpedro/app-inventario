import { Module } from '@nestjs/common';
import { BaseWmsService } from './base-wms.service';
import { BaseWmsController } from './base-wms.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BaseWmsController],
  providers: [PrismaService, BaseWmsService],
})
export class BaseWmsModule {}
