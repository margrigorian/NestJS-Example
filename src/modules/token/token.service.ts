import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user.model';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwtToken(user: User): Promise<string> {
    try {
      const payload = { user };
      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('secret_jwt'),
        expiresIn: this.configService.get<number>('expire_jwt'),
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
