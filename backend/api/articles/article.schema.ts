import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

export enum ArticleStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string; // Ensure this is consistent with the DTO

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
  status: ArticleStatus;

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date; // Date of submission
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
