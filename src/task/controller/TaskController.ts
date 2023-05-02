import {
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
  QueryParams,
  UseBefore,
} from 'routing-controllers';
import { User } from '../../user/User';
import { Task } from '../model/Task';
import { TaskService } from '../service/TaskService';
import { CreateTaskDto } from '../dto/CreateTaskDto';
import { UpdateTaskDto } from '../dto/UpdateTaskDto';
import { GetTasksQueryParams } from '../dto/GetTasksQueryParams';

@JsonController('/v1/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  async getTasks(
    @CurrentUser() user: User,
    @QueryParams() params?: GetTasksQueryParams
  ): Promise<{ tasks: Task[]; totalCount: number }> {
    console.log(user);
    return this.taskService.getTasks(params.limit, params.offset, user, params.sortBy, params.sortOrder);
  }

  @Get('/:id')
  @OnUndefined(404)
  async getTaskById(@Param('id') id: string, @CurrentUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post('/')
  @HttpCode(201)
  async createTask(@Body() data: CreateTaskDto, @CurrentUser() user: User): Promise<Task> {
    return this.taskService.createTask(data, user);
  }

  @Put('/:id')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() data: UpdateTaskDto,
    @CurrentUser() user: User
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(data, id, user);
  }

  @Delete('/:id')
  @OnUndefined(204)
  async deleteTask(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.taskService.deleteTask(id, user);
  }
}
