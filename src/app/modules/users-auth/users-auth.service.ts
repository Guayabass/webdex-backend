import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/typeorm';
import { CreateUserDto } from 'src/app/modules/users-auth/CreateUser.dto';
import { SerializedUser, UserAuth } from 'src/core/serialize/index';
import { comparePasswords, encodePassword } from 'src/core/bcrypt/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersAuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private usersAuth: UserAuth[] = [];

  getUsersAuth(): SerializedUser[] {
    return this.usersAuth.map((user) => new SerializedUser(user)); //for it to call the class that is serialized instead of the interface (plainToInstance method)
  }

  getUserByUsername(username: string): UserAuth {
    return this.usersAuth.find((user) => user.username === username);
  }

  getUserById(id: number): UserAuth {
    return this.usersAuth.find((user) => user.id === id);
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    const password = encodePassword(createUserDto.password);
    console.log(password);
    const newUser = this.userRepository.create({ ...createUserDto, password });
    /**const favoritesIds = createUserDto.favoritesIds;
    const favorites = await this.favRepository.findBy({ id: In([favoritesIds]) });
    newUser.favorites = favorites; COPY DOWN THERE IN UPDATEUSER*/
    return this.userRepository.save(newUser);
  }

  // async updateUser( id: number, updateUserDto: UpdateUserDto){
  //   const userFound = await this.userRepository.findOne({
  //       where: {
  //         id: id,
  //       },
  //     });

  //     if (!userFound) {
  //       return new HttpException('User not found', HttpStatus.NOT_FOUND);
  //     }
  //     const updatedUser = Object.assign(userFound, updateUserDto);

  //     return this.userRepository.save(updatedUser);
  // }

  findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async loginUser(username: string, password: string) {
    const userDB = await this.findUserByUsername(username);

    if (userDB) {
      const matched = comparePasswords(password, userDB.password);
      if (matched) {
        console.log('Validation Succesful');
        return userDB;
      } else {
        console.log('Wrong Password');
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
    console.log('Validation failed');
    return new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
