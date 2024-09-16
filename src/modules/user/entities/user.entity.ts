import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { Role } from '../../../common/enums/role.enum';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap(() => String)
  @Column({ name: 'username', type: 'varchar', unique: true })
  username: string;

  @AutoMap(() => String)
  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @AutoMap(() => String)
  @Column({
    name: 'role',
    default: Role.User,
    type: 'enum',
    enum: Role,
  })
  role: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
