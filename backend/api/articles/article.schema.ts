import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

// Enum representing the possible statuses of an article
export enum ArticleStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * Mongoose schema for the Article entry
 */
@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: true })
  journal: string;

  @Prop({ required: true })
  volume: number;

  @Prop({ required: true })
  pages: string;

  @Prop({ required: true })
  pubYear: number;

  @Prop({ required: true })
  doi: string;

  @Prop({ enum: ArticleStatus, default: ArticleStatus.PENDING })
  status: ArticleStatus; // Current status of the article

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date; // Date of submission
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
