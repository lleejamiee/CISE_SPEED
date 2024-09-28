import { ArticleStatus } from './article.schema';

export class ArticleDTO {
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume: string;
  pages: string;
  doi: string;
  status?: ArticleStatus; // will default to ArticleStatus.PENDING
}
