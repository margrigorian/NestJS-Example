import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto';
import { UserLoginDTO } from './dto';
import { AppError } from 'src/common/constants/errors';
import { TokenService } from '../token/token.service';
import { UserAuthResponse } from './response';

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
    const user = await this.userService.publicUser(dto.email);
    const token = await this.tokenService.generateJwtToken(user);
    return { user, token };
  }
}
