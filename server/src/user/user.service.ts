import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This email already exists!');

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
      name: 'user' + Date.now(),
    });
    const token = this.jwtService.sign({ email: createUserDto.email });
    return { user, token };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }
  async updateAvatar(id: number, avatarBase64: string) {
  console.log('Updating avatar for user:', id);
  
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    console.error('User not found:', id);
    throw new NotFoundException(`User with id ${id} not found`);
  }

  console.log('Found user:', user.email);
  console.log('Old avatar length:', user.avatar?.length);
  
  // Обновляем аватар
  user.avatar = avatarBase64;
  const savedUser = await this.userRepository.save(user);
  
  console.log('Avatar saved, new length:', savedUser.avatar?.length);
  
  return savedUser;
}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // Дополнительный метод для получения пути к аватару
  async getAvatarPath(id: number): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['avatar'],
    });
    return user?.avatar || null;
  }
}
