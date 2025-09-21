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
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }
  async updateAvatar(id: number, avatarPath: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Удаляем старый аватар если он существует
    if (user.avatar) {
      const oldAvatarPath = join(process.cwd(), 'uploads', user.avatar);
      if (existsSync(oldAvatarPath)) {
        try {
          unlinkSync(oldAvatarPath);
        } catch (error) {
          console.error('Ошибка при удалении старого аватара:', error);
        }
      }
    }

    // Обновляем путь к аватару
    user.avatar = avatarPath;
    return await this.userRepository.save(user);
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
