import { Comment } from '../../comments/entities/comment.entity';
import { Post } from '../../post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
  @Column()
  password: string;

  @Column({ default: '' })
  name: string;

  // Меняем тип на text для хранения Base64
  @Column('text', { nullable: true })
  avatar: string; // Теперь храним data:image/png;base64,iVBORw0KGgo...

  @Column({ default: '' })
  bio: string;

  @Column('simple-array', { default: '' })
  following: string[];

  @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  comments: Comment[];

  @Column({ default: 0 })
  likes: number;
}
