"use client";

import React, { useState, useEffect } from "react";
import { Article } from "@/type/Article"; // Adjust the import as needed
import { useToast } from "@/hooks/use-toast"; // Assuming you are using this for notifications
import styles from "../../styles/articleList.module.css";

/**
 *
 * @returns Approved articles component.
 */
function ArticleList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchApprovedArticles = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/status/ordered?status=approved`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setArticles(data);
        } catch (err) {
            setError("Failed to load articles.");
            toast({ title: "Failed to load articles." });
        }
    };

    useEffect(() => {
        fetchApprovedArticles();
    }, []);

    //filtered list
    const filteredArticles = articles.filter((article) => {
        const titleMatch = article.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const authorMatch =
            article.authors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false; // Use optional chaining here
        return titleMatch || authorMatch;
    });

    return (
        <div className={styles.approvedArticlesContainer}>
            <h2 className={styles.header}>Approved Articles</h2>
            <input
                type="text"
                placeholder="Search by title or author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchBar}
            />
            {error ? (
                <div className="text-center">
                    <p>{error}</p>
                </div>
            ) : filteredArticles.length === 0 ? (
                <div className="text-center">
                    <p>No approved articles found.</p>
                </div>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Authors</th>
                            <th>Journal</th>
                            <th>Publication Year</th>
                            <th>DOI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map((article) => (
                            <tr key={article._id}>
                                <td>{article.title}</td>
                                <td>{article.authors}</td>
                                <td>{article.journal}</td>
                                <td>{article.pubYear}</td>
                                <td>{article.doi || "Not provided"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ArticleList;
