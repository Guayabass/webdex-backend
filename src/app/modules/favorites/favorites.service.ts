/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/typeorm';
import { Favorite } from 'src/app/modules/favorites/Favorite';
import { CreateFavoriteDto } from 'src/app/modules/favorites/CreateFavorite.dto';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async addFavorite(favDTO: CreateFavoriteDto): Promise<Favorite> {
    const id = favDTO.user;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const newFavorite = new Favorite();
    newFavorite.user = user;
    newFavorite.pokemonID = favDTO.pokemonID;
    newFavorite.pokemonName = favDTO.pokemonName;
    return this.favoriteRepository.save(newFavorite);
  }

  async deleteFavorite(id: number) {
    const result = await this.favoriteRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  findAll(id: number): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: id,
        },
      },
    });
  }

  getUsersFavorites(id: number, pokemonid: number): Promise<Favorite[]>{
    return this.favoriteRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: id,
        },
        pokemonID: pokemonid,
      },
    });
  }
}
