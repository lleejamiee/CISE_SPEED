"use client";

import React, { useState, useEffect } from "react";
import { Article } from "@/type/Article";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import styles from "../../styles/ModerationQueue.module.css";

/**
 * Displays a list of articles with 'pending' status using Card components.
 *
 * @returns Moderation queue component.
 */
function ModerationQueue() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch only pending articles from the backend in ascending order
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/status/ordered?status=pending_moderation`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched data: ", data);
        setArticles(data);
      } catch (err) {
        console.log("Error from ModerationQueue: ", err);
        setError("Failed to load articles.");
      }
    };

    fetchArticles();
  }, []);

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
    <div className={styles.moderationQueueContainer}>
      {error ? (
        <div className="text-center">
          <p>{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center">
          <p>No articles found.</p>
        </div>
      ) : (
        articles.map((article) => (
          <Card key={article._id} className={`${styles.card} my-4`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                {article.title}
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                Submitted:{" "}
                {article.submittedAt
                  ? formatSubmissionDate(new Date(article.submittedAt))
                  : "N/A"}
              </CardDescription>
              <CardContent className={styles.cardContent}>
                <div className={styles.gridContainer}>
                  <p>
                    <strong>Authors:</strong>
                  </p>
                  <p>{article.authors}</p>

                  <p>
                    <strong>Journal:</strong>
                  </p>
                  <p>
                    {article.journal}{" "}
                    {article.pages
                      ? article.pages.includes("-")
                        ? `, pp. ${article.pages}`
                        : `, p. ${article.pages}`
                      : ""}
                  </p>

                  <p>
                    <strong>Publication Year:</strong>
                  </p>
                  <p>{article.pubYear}</p>

                  <p>
                    <strong>DOI:</strong>
                  </p>
                  <p>
                    {article.doi ? article.doi : "Not provided"}
                  </p>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}

export default ModerationQueue;
