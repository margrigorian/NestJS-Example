import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto';
import { AppError } from 'src/common/errors';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const existUser = await this.findUserByEmail(dto.email);
    // если пользователь с таким email уже существует, пробрасываем ошибку
    if (existUser) throw new BadRequestException(AppError.USER_EXISTS);
    dto.password = await this.hashPassword(dto.password);
    // в противном случае будет пройдена регистрация
    await this.userRepository.create({
      firstName: dto.firstName,
      userName: dto.userName,
      email: dto.email,
      password: dto.password,
    });
    return dto;
  }
}
