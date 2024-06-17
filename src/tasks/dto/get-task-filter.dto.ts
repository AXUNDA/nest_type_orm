import { TaskStatus } from '../task.model';
import { IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';

export class GetTaskFilerDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  // @IsNotEmpty()
  status: TaskStatus;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  search: string;
}
