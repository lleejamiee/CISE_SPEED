import React from "react";
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
  const handleReject = () => {
    onStatusChange(article._id, ArticleStatus.REJECTED);
  };

  const handleApprove = () => {
    onStatusChange(article._id, ArticleStatus.APPROVED);
  };

  return (
    <Card className={`${styles.card}`}>
      <CardHeader>
        <CardTitle>Review</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>

      <CardFooter>
        <Button variant={"destructive"} onClick={handleReject}>
          Reject
        </Button>
        <Button style={{ backgroundColor: "green", color: "white" }} onClick={handleApprove}>
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModerationReviewCard;
