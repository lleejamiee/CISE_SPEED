export enum ArticleStatus {
  PENDING_MODERATION = "pending_moderation",
  PENDING_ANALYSIS = "pending_analysis",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Represents the structure of an article object
export type Article = {
  _id: string;
  title: string;
  authors?: string;
  journal?: string;
  volume?: number;
  pages?: string;
  pubYear?: number;
  doi: string;
  ratings?: number[];
  status: ArticleStatus;
  submittedAt?: Date;
};

// Default structure of article object with initial values
// This can be used as a template or fallback when creating/handling articles
export const DefaultEmptyArticle: Article = {
  _id: "",
  title: "",
  authors: "",
  journal: "",
  volume: 0,
  pages: "",
  pubYear: 0,
  doi: "",
  ratings: [],
  status: ArticleStatus.PENDING_MODERATION, // Default status
  submittedAt: undefined,
};
