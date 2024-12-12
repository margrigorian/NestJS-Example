import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto';
import { UserLoginDTO } from './dto';
import { AppError } from 'src/common/constants/errors';
import { UserAuthResponse } from './response';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const isExistingUser = await this.userService.findUserByEmail(dto.email);
    // если пользователь с таким email уже существует, пробрасываем ошибку
    if (isExistingUser) throw new BadRequestException(AppError.USER_EXISTS);
    // в противном случае регистрация пройдет успешно
    return this.userService.createUser(dto);
  }

  async loginUser(dto: UserLoginDTO): Promise<UserAuthResponse> {
    const isExistingUser = await this.userService.findUserByEmail(dto.email);
    // если пользователь с таким email не существует, пробрасываем ошибку
    if (!isExistingUser)
      throw new BadRequestException(AppError.USER_DOES_NOT_EXIST);
    const validatedPassword = await bcrypt.compare(
      dto.password,
      isExistingUser.password,
    );
    // если пароль неверен, также пробрасываем ошибку
    // для большей безопасности в обоих случаях стоит использовать единое - INVALID_DATA
    if (!validatedPassword)
      throw new BadRequestException(AppError.INVALID_DATA);

    const userData = {
      name: isExistingUser.firstName,
      email: isExistingUser.email,
    };
    const token = await this.tokenService.generateJwtToken(userData);
    // проще ли не делать запрос к БД, а вручную удалять ключ password?
    const user = await this.userService.publicUser(dto.email);
    return { ...user, token };
  }
}
