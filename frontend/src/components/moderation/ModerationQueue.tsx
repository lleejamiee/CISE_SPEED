"use client";

import React, { useState, useEffect } from "react";
import { Article } from "@/type/Article";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import styles from "../../styles/ModerationQueue.module.css";

/**
 * Displays a list of articles with 'pending' status using Card components.
 *
 * @returns Moderation queue component.
 */
function ModerationQueue() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch only pending articles from the backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/status?status=pending_moderation`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched data: ", data);
        setArticles(data);
      } catch (err) {
        console.log("Error from ModerationQueue: ", err);
        setError("Failed to load articles."); // Set error message
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className={styles.moderationQueueContainer}>
      {error ? (
        <div className="text-center">
          <p>{error}</p> {/* Display error message */}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center">
          <p>No articles found.</p>
        </div>
      ) : (
        articles.map((article) => (
          <Card key={article._id} className={`${styles.card} my-4`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>{article.title}</CardTitle>
              <CardDescription className={styles.cardDescription}>
                {article.authors}
              </CardDescription>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}

export default ModerationQueue;
