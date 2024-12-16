import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto';
import { UserLoginDTO } from './dto';
import { UserAuthResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Где-то в конфигурациях Swagger проставляет тэги
  // Поэтому в API документации присутствует дублирование. Как исправить?
  @ApiTags('API')
  @ApiResponse({ status: 201, type: CreateUserDTO })
  @Post('register')
  register(@Body() dto: CreateUserDTO): Promise<CreateUserDTO> {
    return this.authService.registerUser(dto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: UserAuthResponse })
  @Post('login')
  @HttpCode(200) // настройка код-статуса, иначе по-умолчанию будет направлен 201
  login(@Body() dto: UserLoginDTO): Promise<UserAuthResponse> {
    return this.authService.loginUser(dto);
  }

  // пример проверки налачия авторизации через Guard
  // если при запросе не указан токен, ответом будет ошибка со статусом 401 Unauthorized
  // в противном случае, ответ true со статусом 201
  // @UseGuards(JwtAuthGuard)
  // @Post('test')
  // test() {
  //   return true;
  // }
}
