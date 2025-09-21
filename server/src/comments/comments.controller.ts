import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


// src/comments/comments.controller.ts



@Controller('posts/:postId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.create(req.user.userId, postId, createCommentDto);
  }

  @Get()
  async findAllByPost(@Param('postId') postId: string) {
    return this.commentsService.findAllByPost(postId);
  }

  @Get(':commentId')
  async findOne(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.findOne(commentId);
  }

  @Put(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.update(commentId, req.user.userId, updateCommentDto);
  }

  @Delete(':commentId')
  async remove(
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    return this.commentsService.remove(commentId, req.user.userId);
  }
}