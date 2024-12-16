import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssetDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  assetId: string;
}
