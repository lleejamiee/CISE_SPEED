import React from "react";
import { Article } from "@/type/Article";

interface ModerationReviewCardProps {
  article: Article;
}

/**
 * Displays and allows editing of a selected article.
 *
 * @param article The article to be reviewed and edited.
 * @returns Moderation review component.
 */
const ModerationReviewCard: React.FC<ModerationReviewCardProps> = ({
  article,
}) => {
  return (
    <div>
      <h2>{article.title}</h2>
      <p>
        <strong>Authors: </strong>
        {article.authors}
      </p>
      <p>
        <strong>Journal: </strong>
        {article.journal}
      </p>
      <p>
        <strong>Publication Year: </strong>
        {article.pubYear}
      </p>
      <p>
        <strong>DOI: </strong>
        {article.doi || "Not provided"}
      </p>

      {/* Placeholder for future editing options (select, combobox, buttons) */}
      <button className="mt-4 p-2 bg-blue-500 text-white">Approve</button>
      <button className="mt-4 ml-2 p-2 bg-red-500 text-white">Reject</button>
    </div>
  );
};

export default ModerationReviewCard;
