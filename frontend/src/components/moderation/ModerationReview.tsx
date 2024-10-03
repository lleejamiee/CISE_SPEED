"use client"

import React, { useState, useEffect } from "react";
import { Article, ArticleStatus } from "@/type/Article";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import styles from "../../styles/ModerationReview.module.css";

interface ModerationReviewCardProps {
  article: Article;
  onStatusChange: (id: string, status: ArticleStatus) => void;
}

/**
 * Displays and allows editing of a selected article.
 *
 * @param article The article to be reviewed and edited.
 * @returns Moderation review component.
 */
const ModerationReviewCard: React.FC<ModerationReviewCardProps> = ({
  article,
  onStatusChange,
}) => {
  const [isRelevant, setIsRelevant] = useState(false);
  const [isPeerReviewed, setIsPeerReviewed] = useState(false);

  // Reset checkbox states when a new article is selected
  useEffect(() => {
    setIsRelevant(false);
    setIsPeerReviewed(false);
  }, [article]);

  const handleReject = () => {
    onStatusChange(article._id, ArticleStatus.REJECTED);
  };

  const handleApprove = () => {
    onStatusChange(article._id, ArticleStatus.APPROVED);
  };

  // Determine if the "Approve" button should be enabled
  const isApproveEnabled = isRelevant && isPeerReviewed;

  return (
    <Card className={`${styles.card}`}>
      <CardHeader>
        <CardTitle>Article Details</CardTitle>
        <p>
          <strong>Title: </strong>
          {article.title}
        </p>
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
      </CardHeader>
      <CardContent>
        <h3>Review</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            id="relevance"
            style={{ width: "16px", height: "16px" }}
            checked={isRelevant}
            onChange={() => setIsRelevant(!isRelevant)}
          />
          <label htmlFor="relevance">
            Is the article relevant to the empirical evaluation of SE practices?
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            id="peerReviewed"
            style={{ width: "16px", height: "16px" }}
            checked={isPeerReviewed}
            onChange={() => setIsPeerReviewed(!isPeerReviewed)}
          />
          <label htmlFor="peerReviewed">
            Is the article published in a peer-reviewed journal or conference?
          </label>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant={"destructive"} onClick={handleReject}>
          Reject
        </Button>
        <Button
          variant={isApproveEnabled ? undefined : "outline"}
          style={
            isApproveEnabled ? { backgroundColor: "green", color: "white" } : {}
          }
          onClick={handleApprove}
          disabled={!isApproveEnabled} // Disable button if conditions are not met
        >
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModerationReviewCard;
