import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // Create a new article
  @Post()
  async createArticle(@Body() createArticleDto: any) {
    return this.articleService.create(createArticleDto);
  }

  // Retrieve all articles
  @Get()
  async findAll() {
    return this.articleService.findAll();
  }

  // Retrieve an article by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  // Update an article's status
  @Put(':id')
  async updateArticle(@Param('id') id: string, @Body() updateArticleDto: any) {
    return this.articleService.update(id, updateArticleDto);
  }

  // Delete an article by ID
  @Delete(':id')
  async deleteArticle(@Param('id') id: string) {
    return this.articleService.delete(id);
  }

  // Retrieve only pending articles
  @Get('/status/pending')
  async findPending() {
    return this.articleService.findPending();
  }
}
