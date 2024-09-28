import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleStatus } from './article.schema';

@Injectable()
/**
 * Service to manage article data and business logic.
 * Provides methods for CRUD operations.
 */
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  // Create a new article
  async create(articleData: any): Promise<Article> {
    const createdArticle = new this.articleModel(articleData);
    return createdArticle.save();
  }

  // Retrieve all articles
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  // Retrieve a single article by ID
  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  // Update an existing article
  async update(id: string, updateData: any): Promise<Article> {
    // Validate the status before updating
    if (updateData.status && !Object.values(ArticleStatus).includes(updateData.status)) {
      throw new BadRequestException('Invalid status value');
    }
    
    const updatedArticle = await this.articleModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    ).exec();
    
    if (!updatedArticle) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return updatedArticle;
  }

  // Delete an article by ID
  async delete(id: string): Promise<Article> {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    if (!deletedArticle) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return deletedArticle;
  }

  // Retrieve articles by their statuses
  async findByStatus(status: ArticleStatus): Promise<Article[]> {
    return this.articleModel.find({ status }).exec();
  }  
}
