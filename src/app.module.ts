import { Module } from '@nestjs/common';
import { BaseWmsModule } from './base-wms/base-wms.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BaseSapModule } from './base-sap/base-sap.module';
import { PrismaService } from './prisma/prisma.service';
import { BaseCiclicoModule } from './base-ciclico/base-ciclico.module';
import { FichaModule } from './ficha/ficha.module';

@Module({
  imports: [BaseWmsModule, UsersModule, AuthModule, BaseSapModule, BaseCiclicoModule, FichaModule],
  providers: [PrismaService],
})
export class AppModule {}
