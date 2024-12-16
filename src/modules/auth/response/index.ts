import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class UserResponse {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  email: string;
}

export class UserAuthResponse {
  @ApiProperty()
  user: UserResponse;

  @ApiProperty()
  @IsString()
  token: string;
}
