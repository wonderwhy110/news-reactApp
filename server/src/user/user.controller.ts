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
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateAvatar(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Временно уберем валидаторы для тестирования
          // new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType: 'image/(jpeg|png|jpg|gif|webp)' }),
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
      const avatarPath = `avatars/${avatar.filename}`;
      const result = await this.userService.updateAvatar(id, avatarPath);

      console.log('=== AVATAR UPLOAD SUCCESS ===');
      return result;
    } catch (error) {
      console.log('=== AVATAR UPLOAD ERROR ===');
      console.error(error);
      throw error;
    }
  }
}
