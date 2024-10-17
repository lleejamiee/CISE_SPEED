import { ArticleStatus, Evidence } from './article.schema';

/**
 * Data Transfer Object (DTO) for transferring article data.
 */
export class ArticleDTO {
  title: string;
  authors: string;
  journal: string;
  pubYear: string;
  volume: string;
  pages: string;
  doi: string;
  status: ArticleStatus; // defaults to ArticleStatus.PENDING_MODERATION
  submittedAt: Date; 
  seMethod: string; // reference to SeMethod Object Id
  claim: string;
  evidence: Evidence;
}
