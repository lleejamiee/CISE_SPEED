// Enum representing the possible statuses of an article
export enum ArticleStatus {
  PENDING_MODERATION = "pending_moderation",
  PENDING_ANALYSIS = "pending_analysis",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Enum representing the possible results of evidence
export enum Evidence {
  STRONG_SUPPORT = 'strong_support',
  WEAK_SUPPORT = 'weak_support',
  STRONG_AGAINST = 'strong_against',
  WEAK_AGAINST = 'weak_against',
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
  seMethod?: string; // reference to SeMethod Object Id
  claim?: string;
  evidence?: Evidence;
};

// Default structure of article object with initial values
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
  seMethod: "",
  claim: "",
  evidence: undefined,
};
