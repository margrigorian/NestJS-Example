import { IsString } from 'class-validator';

// ДЛЯ ВАЛИДАЦИИ ВХОДЯЩИХ ДАННЫХ
export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  userName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
