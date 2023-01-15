import { CreateBaseWmDto } from 'src/base-wms/dto/create-base-wm.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFichaDto extends PartialType(CreateBaseWmDto) {
  readonly saldo: number;
}
