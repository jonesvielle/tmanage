import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from '../../../common/enums/task_status';
import { Priority } from '../../../common/enums/priority.enum';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'task' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap(() => String)
  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @AutoMap(() => String)
  @Column({ name: 'description', type: 'text' })
  description: string;

  @AutoMap(() => String)
  @Column({
    name: 'status',
    default: TaskStatus.PENDING,
    type: 'enum',
    enum: TaskStatus,
  })
  status: string;

  @AutoMap(() => String)
  @Column({
    name: 'priority',
    default: Priority.LOW,
    type: 'enum',
    enum: Priority,
  })
  priority: string;

  @AutoMap(() => Date)
  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @AutoMap(() => Date)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
