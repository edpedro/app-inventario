import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { FichaService } from './ficha.service';
import { FichaController } from './ficha.controller';

@Module({
  controllers: [FichaController],
  providers: [PrismaService, FichaService],
})
export class FichaModule {}
