import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import { SeMethod } from '../semethod/semethod.schema';

export type ArticleDocument = HydratedDocument<Article>;

// Enum representing the possible statuses of an article
export enum ArticleStatus {
  PENDING_MODERATION = 'pending_moderation',
  PENDING_ANALYSIS = 'pending_analysis',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Enum representing the possible results of evidence
export enum Evidence {
  STRONG_SUPPORT = 'strong_support',
  WEAK_SUPPORT = 'weak_support',
  STRONG_AGAINST = 'strong_against',
  WEAK_AGAINST = 'weak_against',
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

  @Prop ({ type: MongooseSchema.Types.ObjectId, ref: 'SeMethod', required: false})
  seMethod: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: false })
  claim: string;

  @Prop({ enum: Evidence, required: false})
  evidence: Evidence;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
