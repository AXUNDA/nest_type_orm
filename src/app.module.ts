import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      database: 'nest_full',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Dondizzy12?',
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    AuthModule,
  ],
})
export class AppModule {}
