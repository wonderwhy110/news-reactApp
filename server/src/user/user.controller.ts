import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Express } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // Защитите endpoint авторизацией
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Get(':id') // значит полный путь /user/:id
  async findOne(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  // user.controller.ts
 
  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Можно оставить валидаторы если нужно
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    console.log('=== AVATAR UPLOAD STARTED ===');
    console.log('User ID:', id);
    console.log('File received:', avatar.originalname);
    console.log('File size:', avatar.size);
    console.log('File mimetype:', avatar.mimetype);

    try {
      // Проверяем размер файла (максимум 2MB)
      if (avatar.size > 2 * 1024 * 1024) {
        throw new BadRequestException('File size too large. Maximum size is 2MB.');
      }

      // Проверяем тип файла
      if (!avatar.mimetype.startsWith('image/')) {
        throw new BadRequestException('Only image files are allowed.');
      }

      // Конвертируем файл в Base64
      const base64String = avatar.buffer.toString('base64');
      const avatarBase64 = `data:${avatar.mimetype};base64,${base64String}`;

      // Сохраняем Base64 в базу данных
      const result = await this.userService.updateAvatar(id, avatarBase64);

      console.log('=== AVATAR UPLOAD SUCCESS ===');
      console.log('Base64 length:', avatarBase64.length);
      
      return {
        success: true,
        message: 'Avatar uploaded successfully',
        avatar: result.avatar // Возвращаем обновленного пользователя
      };
    } catch (error) {
      console.log('=== AVATAR UPLOAD ERROR ===');
      console.error(error);
      throw error;
    }
  }

  // Новый метод для получения аватарки
  @Get(':id/avatar')
  async getAvatar(@Param('id') id: number) {
    const user = await this.userService.findById(id);
    if (!user || !user.avatar) {
      throw new NotFoundException('Avatar not found');
    }
    
    return { avatar: user.avatar };
  }
}
