import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard) // Guard для создания поста
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(req.user.userId, createPostDto);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll(); // Публичный роут
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: number) {
    return this.postsService.findAllByUser(userId);
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) // Guard для обновления поста
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(id, req.user.userId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Guard для удаления поста
  async remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(id, req.user.userId);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard) // Guard для лайков
  async likePost(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId; // исправлено с req.user.id на req.user.userId
    return this.postsService.likePost(id, userId);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard) // Guard для удаления лайка
  async unlikePost(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.postsService.unlikePost(id, userId);
  }

  @Get('search')
  async searchPosts(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    if (!query || query.trim() === '') {
      return {
        posts: [],
        total: 0,
        page,
        totalPages: 0,
        message: 'Query parameter is required'
      };
    }

    return this.postsService.searchPosts(query, page, limit);
  }
}
