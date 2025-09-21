// post.entity.ts
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  post_id: string; // Теперь UUID будет генерироваться автоматически

  @Column('text')
  content: string;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' }) // Добавь name
  userId: number;
  

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @Column('jsonb', { default: [] })
  likedByUserIds: number[];
}