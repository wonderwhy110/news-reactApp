// src/comments/comments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

async create(
  userId: number,
  postId: string,
  createCommentDto: CreateCommentDto,
): Promise<Comment> {
  const post = await this.postService.findOne(postId);
  const user = await this.userService.findById(userId);

  // Создаем комментарий без userId и postId
  const comment = this.commentsRepository.create(createCommentDto);
  
  // Устанавливаем отношения явно
  comment.user = user;
  comment.post = post;

  return await this.commentsRepository.save(comment);
}

  async findAllByPost(postId: string): Promise<Comment[]> {
    // Проверяем существование поста
    await this.postService.findOne(postId);

    return await this.commentsRepository.find({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    
    return comment;
  }

  async remove(id: string, userId: number): Promise<void> {
    const comment = await this.findOne(id);
    
    if (comment.userId !== userId) {
      throw new NotFoundException('You can only delete your own comments');
    }
    
    await this.commentsRepository.remove(comment);
  }

  async update(
    id: string,
    userId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    
    if (comment.userId !== userId) {
      throw new NotFoundException('You can only update your own comments');
    }

    if (updateCommentDto.content !== undefined) {
      comment.content = updateCommentDto.content;
    }

    return await this.commentsRepository.save(comment);
  }

  async countByPost(postId: string): Promise<number> {
    return await this.commentsRepository.count({
      where: { postId },
    });
  }
}