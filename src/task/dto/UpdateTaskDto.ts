import { IsEnum } from 'class-validator';
import { TaskStatus } from '../model/Task';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
