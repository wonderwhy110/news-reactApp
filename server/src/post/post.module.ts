// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserModule } from '../user/user.module'; // Импортируем UserModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UserModule, // Импортируем UserModule для доступа к UserService
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}