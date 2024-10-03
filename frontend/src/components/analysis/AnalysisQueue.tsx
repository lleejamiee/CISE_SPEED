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
import styles from "../../styles/AnalysisQueue.module.css";
import { useToast } from "@/hooks/use-toast";

/**
 *
 * @returns analysis queue component
 */
function AnalysisQueue() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

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
                return `${hoursDifference} hour${
                    hoursDifference !== 1 ? "s" : ""
                } ago`;
            }
        } else if (daysDifference < 7) {
            return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
        } else if (daysDifference < 30) {
            const weeksDifference = Math.floor(daysDifference / 7);
            return `${weeksDifference} week${
                weeksDifference > 1 ? "s" : ""
            } ago`;
        } else {
            const monthsDifference = Math.floor(daysDifference / 30);
            return `${monthsDifference} month${
                monthsDifference > 1 ? "s" : ""
            } ago`;
        }
    };

    return (
        <div className={styles.pendingAnalysisContainer}>
            <div style={{ overflowY: "auto" }}>
                <h2 className={styles.pendingAnalysisHeader}>
                    Pending Analysis Queue
                </h2>
                <div className={styles.pendingAnalysisQueue}>
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
                                            ? formatSubmissionDate(
                                                  new Date(article.submittedAt)
                                              )
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
                                                    ? article.pages.includes(
                                                          "-"
                                                      )
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
                                                {article.doi
                                                    ? article.doi
                                                    : "Not provided"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </CardHeader>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnalysisQueue;
