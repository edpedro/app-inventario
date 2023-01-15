import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { BaseCiclicoService } from './base-ciclico.service';
import { BaseCiclicoController } from './base-ciclico.controller';

@Module({
  controllers: [BaseCiclicoController],
  providers: [PrismaService, BaseCiclicoService],
})
export class BaseCiclicoModule {}
