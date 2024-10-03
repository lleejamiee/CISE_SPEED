import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
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

  // Check for duplicate articles based on title or DOI
  @Get('duplicates')
  async checkForDuplicates(
    @Query('title') title: string,
    @Query('doi') doi: string,
  ) {
    const duplicates = await this.articleService.checkForDuplicates(title, doi);
    return duplicates;
  }

  // Retrieve articles by status
  @Get('status')
  async findByStatus(@Query('status') status: ArticleStatus) {
    return this.articleService.findByStatus(status);
  }

  // Retrieve articles by status, sorted by submission date
  @Get('status/ordered')
  async findByStatusOrdered(
    @Query('status') status: ArticleStatus,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc', // Default to ascending order
  ) {
    return this.articleService.findByStatusOrdered(status, sortOrder);
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
  async updateArticle(
    @Param('id') id: string,
    @Body() updateData: Partial<ArticleDTO>,
  ) {
    return this.articleService.update(id, updateData);
  }

  // Delete article by ID
  @Delete(':id')
  async deleteArticle(@Param('id') id: string) {
    return this.articleService.delete(id);
  }
}
