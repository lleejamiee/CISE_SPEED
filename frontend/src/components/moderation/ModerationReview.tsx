"use client";

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

const ModerationReviewCard: React.FC<ModerationReviewCardProps> = ({
  article,
  onStatusChange,
}) => {
  const [isRelevant, setIsRelevant] = useState(false);
  const [isPeerReviewed, setIsPeerReviewed] = useState(false);
  const [buttonText, setButtonText] = useState("Search for duplicates");

  useEffect(() => {
    setIsRelevant(false);
    setIsPeerReviewed(false);
    setButtonText("Search for duplicates");
  }, [article]);

  const handleReject = () => {
    onStatusChange(article._id, ArticleStatus.REJECTED);
  };

  const handleApprove = () => {
    onStatusChange(article._id, ArticleStatus.PENDING_ANALYSIS);
  };

  const searchForDuplicates = () => {
    setButtonText("Searching..."); // Update button text during loading

    const titleParam = encodeURIComponent(article.title.trim().toLowerCase());
    console.log("titleParam: " + titleParam);
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/duplicates?title=${titleParam}`;

    fetch(url, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          console.log(response.statusText);
          throw new Error(`Error fetching duplicates: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setButtonText("Possible duplicate found");
        } else {
          setButtonText("No duplicates found");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  // Determine if the "Approve" button should be enabled
  const isApproveEnabled = isRelevant && isPeerReviewed;

  return (
    <Card className={`${styles.card}`}>
      <CardHeader>
        <CardTitle className={"text-center"}>Review Submission</CardTitle>
        <h3>Article Details</h3>
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
      <div className={styles.reviewWrapper}>
        <CardContent>
          <h3>Review</h3>
          <Button variant="link" onClick={searchForDuplicates}>
            {buttonText}
          </Button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              id="relevance"
              style={{ width: "16px", height: "16px" }}
              checked={isRelevant}
              onChange={() => setIsRelevant(!isRelevant)}
            />
            <label htmlFor="relevance">
              Is the article relevant to the empirical evaluation of SE
              practices?
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
          <Button
            variant={"destructive"}
            onClick={handleReject}
            style={{ marginRight: "20px" }}
          >
            Reject
          </Button>
          <Button
            variant={isApproveEnabled ? undefined : "outline"}
            style={
              isApproveEnabled
                ? { backgroundColor: "green", color: "white" }
                : {}
            }
            onClick={handleApprove}
            disabled={!isApproveEnabled}
          >
            Approve
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ModerationReviewCard;
