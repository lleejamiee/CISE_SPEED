import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/users/user.module';
import { ArticleModule } from './api/articles/article.module';
import { SeMethodModule } from './api/semethod/semethod.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    ArticleModule,
    SeMethodModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
