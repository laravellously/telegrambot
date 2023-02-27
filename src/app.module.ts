import { AdminModule } from '@adminjs/nestjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import AdminJS from 'adminjs';
import adminConfig from 'config/admin.config';
import { TelegrafModule } from 'nestjs-telegraf';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import * as appService from './app.service';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

const DEFAULT_ADMIN = {
  email: 'admin@bot.io',
  password: 'adminPassword',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [adminConfig],
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      botName: process.env.BOT_NAME,
    }),
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [User],
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secret',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret',
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [appService.AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
