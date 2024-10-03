import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

// Enum representing the possible statuses of an article
export enum ArticleStatus {
  PENDING_MODERATION = 'pending_moderation',
  PENDING_ANALYSIS = 'pending_analysis',
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

  @Prop({ required: false })
  volume: number;

  @Prop({ required: false })
  pages: string;

  @Prop({ required: true })
  pubYear: number;

  @Prop({ required: false })
  doi: string;

  @Prop({ enum: ArticleStatus, default: ArticleStatus.PENDING_MODERATION })
  status: ArticleStatus;

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
