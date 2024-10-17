import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleStatus } from './article.schema';
import { ArticleDTO } from './article.dto';

/**
 * Service to manage article data and business logic.
 * Provides methods for CRUD operations.
 */
@Injectable()
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
  async update(id: string, updateData: Partial<ArticleDTO>): Promise<Article> {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

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

  // Retrieve articles by their statuses, sorted by submission date
  async findByStatusOrdered(
    status: ArticleStatus,
    sortOrder: 'asc' | 'desc',
  ): Promise<Article[]> {
    const sortDirection = sortOrder === 'asc' ? 1 : -1; // 1 for asc, -1 for desc
    return this.articleModel
      .find({ status })
      .sort({ submittedAt: sortDirection })
      .exec();
  }

  // Check for duplicate articles based on title or DOI
  async checkForDuplicates(title: string, doi: string): Promise<Article[]> {
    const normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, '');
    const regexPattern = normalizedTitle.split('').join('\\s*');
    const query: any = {
      status: {
        $in: [
          ArticleStatus.PENDING_ANALYSIS,
          ArticleStatus.APPROVED,
          ArticleStatus.REJECTED,
        ],
      },
    };

    query.title = { $regex: new RegExp(regexPattern, 'i') };

    // Add DOI check if it's not an empty string
    if (doi && doi.trim() !== '') {
      query.doi = doi;
    }

    const duplicates = await this.articleModel.find(query).exec();

    return duplicates;
  }

  // Adds the rating to the list of ratings and updates the average
  async addRating(articleId: string, rating: number) {
    const article = await this.articleModel.findById(articleId);
    if (rating >= 0 && rating <= 5) {
      article.ratings.push(rating);
      await article.save();
    }
  }
}
