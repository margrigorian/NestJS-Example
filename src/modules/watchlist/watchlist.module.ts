import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { WatchList } from './models/watchlist.model';

@Module({
  imports: [SequelizeModule.forFeature([WatchList])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
