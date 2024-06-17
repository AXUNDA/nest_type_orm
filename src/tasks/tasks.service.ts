import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.model';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilerDto } from './dto/get-task-filter.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private TaskRepository: Repository<Task>,
  ) {}

  async getAllTasks(dto: GetTaskFilerDto, user: User) {
    const query = this.TaskRepository.createQueryBuilder('task');
    query.where({ user });
    if (dto.status) {
      query.andWhere('task.status = :status', { status: dto.status });
    }
    if (dto.search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) or LOWER(task.description) LIKE LOWER(:search)) ',
        { search: `%${dto.search}%` },
      );
    }
    return await query.getMany();
  }
  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description } = createTaskDto;
    const task = this.TaskRepository.create({
      title,
      description,
      user,
    });

    return await this.TaskRepository.save(task);
  }
  async getTaskById(id: string, user: User) {
    try {
      const query = this.TaskRepository.createQueryBuilder('task');
      query.where({ user });
      query.andWhere({ id });

      // const task = await this.TaskRepository.findOne({
      //   where: {
      //     id,
      //     user,
      //   },
      // });
      // if (!task) throw new NotFoundException(`task with id ${id} does not exist`);
      return await query.getOneOrFail();
    } catch (error: any) {
      throw new NotFoundException();
    }
  }
  //   getTaskById(id: string): Task {
  //     const task = this.tasks.find((task) => task.id === id);
  //     if (!task) throw new NotFoundException(`task with id ${id} does not exist`);
  //     return task;
  //   }
  async deleteTask(id: string, user: User) {
    const deleted = await this.TaskRepository.delete({
      id,
      user,
    });
    if (deleted.affected < 1) {
      throw new NotFoundException(`no task with id ${id}`);
    } else {
      return 'OK';
    }
  }
  async updateTask(id: string, status: TaskStatus, user: User) {
    console.log({ id, status });
    return await this.TaskRepository.update({ id, user }, { status });
    // return await this.getTaskById(id, user);
  }
  // async getTaskWithFilter(dto: GetTaskFilerDto) {
  //   let tasks = await this.getAllTasks();
  //   if (dto.status) {
  //     tasks = tasks.filter((task) => task.status === dto.status);
  //   }
  //   if (dto.search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.toLowerCase().includes(dto.search.toLowerCase()) ||
  //         task.description.toLowerCase().includes(dto.search.toLowerCase()),
  //     );
  //   }
  //   return tasks;
  // }
}
