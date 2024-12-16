import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WatchList } from './models/watchlist.model';
import { AssetDTO } from './dto';
import { User } from '../user/models/user.model';
import { AppError } from 'src/common/constants/errors';
import { CreateAssetResponse } from './response';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(WatchList)
    private readonly watchlistRepository: typeof WatchList,
  ) {}

  async createAsset(user: User, dto: AssetDTO): Promise<CreateAssetResponse> {
    try {
      // в соответствии с моделью WatchList
      const watchlist = {
        // хотя в самой watchlist модели столбец user указан по типу модели User
        // но для БД предполагается одно значение в колонке
        // видимо, user:user.id и user:User интерпретируется как-то тождественно
        user: user.id,
        name: dto.name,
        assetId: dto.assetId,
      };

      await this.watchlistRepository.create(watchlist);
      return watchlist;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteAsset(assetId: string, userId: number): Promise<boolean> {
    try {
      const isDeletedAsset = await this.watchlistRepository.destroy({
        // в таблице watchlist есть колонка под именем user, в нем записан userId
        where: { id: assetId, user: userId },
      });

      // попытка обработать ошибку, если удаление не случилось
      if (isDeletedAsset === 0) {
        // возможно ли более конкретное определение ошибки - 404 или 403?
        throw new BadRequestException('Action cannot be performed');
      } else {
        return true;
      }
    } catch (e) {
      // if (error instanceof NotFoundError) {
      //   // Обработка ошибки, если запись не найдена
      //   throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
      // } else {
      //   // Ошибка аутентификации
      //   throw new HttpException('Authentication error', HttpStatus.FORBIDDEN);
      // }

      if (e instanceof BadRequestException) {
        throw new BadRequestException(AppError.ASSET_DELETION);
      } else {
        throw new InternalServerErrorException(e);
      }
    }
  }
}
