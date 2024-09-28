import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './article.schema';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

/**
 * ArticleModule encapsulates the functionality related to articles.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService], 
})
export class ArticleModule {}
