import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum TaskStatus {
  Completed = 'completed',
  InProgress = 'in progress',
  Backlog = 'backlog',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  text: string;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.Backlog,
  })
  status: TaskStatus;

  @UpdateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
