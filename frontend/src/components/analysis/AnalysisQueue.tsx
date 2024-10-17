"use client";

import React, { useState, useEffect } from "react";
import { Article, ArticleStatus, Evidence } from "@/type/Article";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import styles from "../../styles/AnalysisQueue.module.css";
import { useToast } from "@/hooks/use-toast";
import AnalysisReviewCard from "./AnalysisReview";

/**
 * Component for displaying and managing articles in the analysis queue.
 * Fetches articles pending analysis, allows reviewers to select an article
 * for detailed review, and updates the article status upon approval.
 *
 * @returns AnalysisQueue component.
 */
function AnalysisQueue() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch only articles pending analysis from the backend in ascending order
  const fetchArticles = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/status/ordered?status=pending_analysis`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles.");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Change status, add SE method, claim and evidence to an article
  const handleApprove = (
    id: string,
    status: ArticleStatus,
    seMethodId?: string,
    claim?: string,
    evidence?: Evidence
  ) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, seMethod: seMethodId, claim, evidence }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update article.");
        }
        return res.json();
      })
      .then((data) => {
        setSelectedArticle(null);
        fetchArticles();
        toast({ title: `Article status updated to ${status}.` });
      })
      .catch((error) => {
        toast({ title: `Failed to update article.` });
        setError("Failed to update article.");
      });
  };

  // Helper function to format the submission date
  const formatSubmissionDate = (submittedDate: Date) => {
    const now = new Date();
    const timeDifference = now.getTime() - submittedDate.getTime();

    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 3600));
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysDifference < 1) {
      if (hoursDifference < 1) {
        return `${minutesDifference} minute${
          minutesDifference !== 1 ? "s" : ""
        } ago`;
      } else {
        return `${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
      }
    } else if (daysDifference < 7) {
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (daysDifference < 30) {
      const weeksDifference = Math.floor(daysDifference / 7);
      return `${weeksDifference} week${weeksDifference > 1 ? "s" : ""} ago`;
    } else {
      const monthsDifference = Math.floor(daysDifference / 30);
      return `${monthsDifference} month${monthsDifference > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className={styles.analysisContainer}>
      <div style={{ overflowY: "auto" }}>
        <h2 className={styles.analysisHeader}>Analysis Queue</h2>
        <div className={styles.analysisQueue}>
          {error ? (
            <div className="text-center">
              <p>{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center">
              <p>No articles pending analysis.</p>
            </div>
          ) : (
            articles.map((article) => (
              <Card
                key={article._id}
                className={`${styles.card}`}
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader>
                  <CardTitle className={styles.cardTitle}>
                    <p>{article.title}</p>
                  </CardTitle>
                  <CardDescription>
                    Submitted:{" "}
                    {article.submittedAt
                      ? formatSubmissionDate(new Date(article.submittedAt))
                      : "N/A"}
                  </CardDescription>
                  <CardContent className="p-0 m-0">
                    <div className={styles.cardContent}>
                      <p>
                        <b>Authors: </b>
                        {article.authors}
                      </p>

                      <p>
                        <b>Journal: </b>
                        {article.journal}{" "}
                        {article.pages
                          ? article.pages.includes("-")
                            ? `, pp. ${article.pages}`
                            : `, p. ${article.pages}`
                          : ""}
                      </p>

                      <p>
                        <b>Publication Year: </b>
                        {article.pubYear}
                      </p>

                      <p>
                        <b>DOI: </b>
                        {article.doi ? article.doi : "Not provided"}
                      </p>
                    </div>
                  </CardContent>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
      <div className={styles.analysisReview}>
        {selectedArticle ? (
          <AnalysisReviewCard
            article={selectedArticle}
            onStatusChange={handleApprove}
          />
        ) : (
          <p style={{ marginTop: "20px" }} className="text-center">
            Select an article to analyse
          </p>
        )}
      </div>
    </div>
  );
}

export default AnalysisQueue;
