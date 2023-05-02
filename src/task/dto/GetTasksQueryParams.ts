import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum TaskSortBy {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export enum TaskSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetTasksQueryParams {
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsEnum(TaskSortBy)
  sortBy?: TaskSortBy;

  @IsOptional()
  @IsEnum(TaskSortOrder)
  sortOrder?: TaskSortOrder;
}
