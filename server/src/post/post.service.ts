// src/post/post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserService } from '../user/user.service'; // Импортируем UserService

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private readonly userService: UserService, // Используем UserService вместо прямого доступа к репозиторию
  ) {}

  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.userService.findById(userId); // Используем UserService

    const post = this.postsRepository.create({
      ...createPostDto,
      userId,
      user,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      relations: ['user', 'comments', 'comments.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUser(userId: number): Promise<Post[]> {
    await this.userService.findById(userId); // Проверяем существование пользователя

    return await this.postsRepository.find({
      where: { userId },
      relations: ['user', 'comments', 'comments.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(post_id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { post_id },
      relations: ['user', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    post_id: string,
    userId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { post_id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new NotFoundException('You can only update your own posts');
    }

    if (updatePostDto.content !== undefined) {
      post.content = updatePostDto.content;
    }

    return await this.postsRepository.save(post);
  }

  async remove(post_id: string, userId: number): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { post_id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new NotFoundException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);
  }
  // post.service.ts
  async likePost(postId: string, userId: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { post_id: postId },
    });

    if (!post) throw new NotFoundException('Post not found');

    // ИСПРАВЛЕНИЕ: проверяем и инициализируем массив
    if (!post.likedByUserIds || post.likedByUserIds === null) {
      post.likedByUserIds = [];
    }

    // Проверяем, не лайкнул ли уже
    if (post.likedByUserIds.includes(userId)) {
      throw new Error('Post already liked');
    }

    post.likedByUserIds = [...post.likedByUserIds, userId];
    post.likes = post.likedByUserIds.length;

    return await this.postsRepository.save(post);
  }

  async unlikePost(postId: string, userId: number): Promise<Post> {
    const post = await this.findOne(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Убираем ID пользователя из массива
    post.likedByUserIds = post.likedByUserIds.filter((id) => id !== userId);
    post.likes = Math.max(0, post.likes - 1);
    return await this.postsRepository.save(post);
  }
    async searchPosts(query: string, page: number = 1, limit: number = 20): Promise<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user') // Загружаем пользователя
      .where('post.content ILIKE :query', { query: `%${query}%` })
      .orWhere('user.name ILIKE :query', { query: `%${query}%` })
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }


  
}
