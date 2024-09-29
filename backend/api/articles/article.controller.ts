import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleStatus } from './article.schema';
import { ArticleDTO } from './article.dto';

/**
 * Controller to handle article-related API requests.
 * Defines endpoints for CRUD operations on articles.
 */
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // Retrieve articles by status
  @Get('status')
  async findByStatus(@Query('status') status: ArticleStatus) {
    return this.articleService.findByStatus(status);
  }

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

  // Retrieve article by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  // Update article by ID
  @Put(':id')
  async updateArticle(@Param('id') id: string, @Body() updateData: Partial<ArticleDTO>) {
    return this.articleService.update(id, updateData);
  }

  // Delete article by ID
  @Delete(':id')
  async deleteArticle(@Param('id') id: string) {
    return this.articleService.delete(id);
  }

}
