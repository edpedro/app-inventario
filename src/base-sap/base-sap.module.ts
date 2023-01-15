import { Module } from '@nestjs/common';
import { BaseSapService } from './base-sap.service';
import { BaseSapController } from './base-sap.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BaseSapController],
  providers: [PrismaService, BaseSapService],
})
export class BaseSapModule {}
