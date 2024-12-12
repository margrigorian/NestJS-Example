import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// AuthGuard можно использовать напрямую, но это неграмматно
// Используем его через созданный нами класс
