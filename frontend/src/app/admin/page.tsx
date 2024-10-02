"use client"; // Make this a Client Component

import Navbar from "@/components/navbar/navbar";
import { useEffect, useState } from "react";
import styles from './AdminPage.module.css'; // Importing CSS module for styling

export default function AdminPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch articles from the backend
    const fetchArticles = async () => {
        try {
            const response = await fetch("/api/articles"); // INCORRECT ENDPOINT
            const data = await response.json();
            console.log("Fetched articles:", data); // Log the fetched articles
            setArticles(data);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    return (
        <div>
            <Navbar />
            <main>
                <h1>Admin Page</h1>
                <table className={styles.articleTable}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Authors</th>
                            <th>Journal</th>
                            <th>Volume</th>
                            <th>Pages</th>
                            <th>Publication Year</th>
                            <th>DOI</th>
                            <th>Status</th>
                            <th>Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length === 0 ? (
                            <tr>
                                <td colSpan={9} className={styles.noArticles}>No articles available.</td>
                            </tr>
                        ) : (
                            articles.map((article, index) => (
                                <tr key={index}>
                                    <td>{article.title}</td>
                                    <td>{article.authors}</td>
                                    <td>{article.journal}</td>
                                    <td>{article.volume}</td>
                                    <td>{article.pages}</td>
                                    <td>{article.pubYear}</td>
                                    <td>{article.doi}</td>
                                    <td>{article.status}</td>
                                    <td>{new Date(article.submittedAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
}
