import { Module } from '@nestjs/common';
import { UsersAuthService } from '../app/modules/users-auth/users-auth.service';
import { UsersAuthController } from '../app/modules/users-auth/users-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared/typeorm';
import { Favorite } from 'src/app/modules/favorites/Favorite';
import { FavoritesService } from '../app/modules/favorites/favorites.service';
import { FavoritesController } from '../app/modules/favorites/favorites.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Favorite])],
  controllers: [UsersAuthController, FavoritesController],
  providers: [
    {
      provide: 'USER_AUTH_SERVICE',
      useClass: UsersAuthService,
    },
    FavoritesService,
  ],
})
export class UsersAuthModule {}
