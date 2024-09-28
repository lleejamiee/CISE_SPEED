// Represents the structure of an article object
export type Article = {
    _id?: string;
    title?: string;
    authors?: string;
    journal?: string;
    volume?: number;
    pages?: string;
    pubYear?: number;
    doi?: string;
    status: "pending" | "approved" | "rejected"; // values for ArticleStatus enum
    submittedAt?: Date;
};

// Default structure of article object with initial values
// This can be used as a template or fallback when creating/handling articles
export const DefaultEmptyArticle: Article = {
    _id: undefined,
    title: "",
    authors: "",
    journal: "",
    volume: 0,
    pages: "",
    pubYear: 0,
    doi: "",
    status: "pending", // Default status
    submittedAt: undefined,
};
