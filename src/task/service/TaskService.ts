import { InternalServerError } from 'routing-controllers';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../user/User';
import { Task } from '../model/Task';
import { CreateTaskDto } from '../dto/CreateTaskDto';
import { UpdateTaskDto } from '../dto/UpdateTaskDto';
import { TaskSortOrder, TaskSortBy } from '../dto/GetTasksQueryParams';

@Service()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepository: Repository<Task>) {}

  async createTask(data: CreateTaskDto, user: User): Promise<Task> {
    try {
      const task = this.taskRepository.create({ ...data, userId: user.id });

      await this.taskRepository.save(task);

      return task;
    } catch (error) {
      throw new InternalServerError('Failed to create task');
    }
  }

  async updateTaskStatus(data: UpdateTaskDto, id: string, user: User): Promise<Task> {
    try {
      const task = await this.taskRepository.findOneOrFail({ id, userId: user.id });

      const updatedTask = this.taskRepository.merge(task, data);

      await this.taskRepository.save(updatedTask);

      return updatedTask;
    } catch (error) {
      throw new InternalServerError('Failed to update task');
    }
  }

  async deleteTask(id: string, user: User): Promise<void> {
    try {
      await this.taskRepository.delete({ id, userId: user.id });
    } catch (error) {
      throw new InternalServerError('Failed to delete task');
    }
  }

  async getTasks(
    limit: number,
    offset: number,
    user: User,
    sortBy?: TaskSortBy,
    sortOrder?: TaskSortOrder
  ): Promise<{ tasks: Task[]; totalCount: number }> {
    try {
      const whereOptions = { userId: user.id };
      const orderOptions: { [key: string]: string } = {};

      if (sortBy) {
        orderOptions[sortBy] = sortOrder ?? 'DESC';
      }

      const [tasks, totalCount] = await this.taskRepository.findAndCount({
        where: whereOptions,
        take: limit ?? 10,
        skip: offset ?? 0,
        order: orderOptions,
      });

      return { tasks, totalCount };
    } catch (error) {
      throw new InternalServerError('Failed to fetch tasks');
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ id, userId: user.id });

      return task;
    } catch (error) {
      throw new InternalServerError('Failed to fetch task');
    }
  }
}
