"use client";

import React, { useState, useEffect } from "react";
import { Article } from "@/type/Article"; // Adjust the import as needed
import { useToast } from "@/hooks/use-toast"; // Assuming you are using this for notifications
import { Rating } from "@mui/material"; // Material-UI Rating component
import styles from "../../styles/articleList.module.css";
import { Claim, SeMethod } from "@/type/SeMethod";

/**
 *
 * @returns Approved articles component.
 */
function ArticleList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [error, setError] = useState<string | null>(null);
    const [seMethods, setSeMethods] = useState<SeMethod[]>([]);
    const [selectedSeMethodId, setSelectedSeMethodId] = useState<string>("");

    const [selectedClaim, setSelectedClaim] = useState<string>("");
    const [selectedPubYear, setSelectedPubYear] = useState<number | undefined>(
        undefined
    );
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

    const { toast } = useToast();

    // Generate array of years from 1900 to current year
    const years = Array.from(
        { length: new Date().getFullYear() - 1900 + 1 },
        (_, i) => 1900 + i
    ).reverse();

    // Fetch approved articles from database
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
            setFilteredArticles(data);
            console.log("Fetched articles: " + data.length);
        } catch (err) {
            setError("Failed to load articles.");
            toast({ title: "Failed to load articles." });
        }
    };

    // Fetch SE Methods from database
    const fetchSeMethods = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/semethods`
            );
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.statusText}`
                );
            }
            const data: SeMethod[] = await response.json();
            setSeMethods(data);
        } catch (err: any) {
            console.error("Error fetching SE methods:", err);
            setError("Failed to load SE methods.");
            toast({
                title: "Failed to load SE methods.",
                description: err.message || "An error occurred.",
            });
        }
    };

    useEffect(() => {
        fetchApprovedArticles();
        initialFilter();
        fetchSeMethods();

        console.log("first useEffect: ");
        filteredArticles.map((article) => {
            console.log(article.title);
        });
    }, []);

    // Helper function to calculate the average rating
    const calculateAverageRating = (ratings: number[]): number => {
        if (!ratings || ratings.length === 0) return 0;
        const sum = ratings.reduce((a, b) => a + b, 0);
        return sum / ratings.length;
    };

    //filtered list
    const initialFilter = () => {
        const filteredArticles = articles.filter((article) => {
            const titleMatch = article.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const authorMatch =
                article.authors
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) || false; // Use optional chaining here
            return titleMatch || authorMatch;
        });

        setFilteredArticles(filteredArticles);
    };

    // Filtering articles by SE Method & Claim
    const filterBySEorClaim = () => {
        const filteredArticles = selectedClaim
            ? articles.filter((article) => {
                  return (
                      article.seMethod === selectedSeMethodId &&
                      article.claim === selectedClaim
                  );
              })
            : articles.filter((article) => {
                  return article.seMethod === selectedSeMethodId;
              });

        setFilteredArticles(filteredArticles);

        console.log("articles in filterBySEClaim: :");
        filteredArticles.map((article) => {
            console.log(article.title);
        });
    };

    const handleRatingSubmit = async (articleId: string, newRating: number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/${articleId}/rate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ rating: newRating }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to submit rating.");
            }

            const updatedArticle = await response.json();
            setArticles((prevArticles) =>
                prevArticles.map((article) =>
                    article._id === updatedArticle._id
                        ? updatedArticle
                        : article
                )
            );
            toast({ title: "Rating submitted successfully!" });
        } catch (err) {
            toast({ title: "Failed to submit rating." });
        }
    };
    
    

    return (
        <div className={styles.approvedArticlesContainer}>
            <div className={styles.filterContainer}>
                <h2>Filter Articles</h2>
                <div>
                    <label htmlFor="authorTitleSearch" className={styles.label}>
                        Title or Author:
                    </label>
                    <input
                        id="authorTitleSearch"
                        type="text"
                        placeholder="Search by title or author"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchBar}
                    />
                </div>
                <div className={styles.rowContainer}>
                    <div style={{ flex: 1, marginRight: "8px" }}>
                        <label htmlFor="pubYearSelect" className={styles.label}>
                            Publication Year:
                        </label>
                        <select
                            id="pubYearSelect"
                            onChange={(e) => {
                                const value =
                                    e.target.value === ""
                                        ? undefined
                                        : parseInt(e.target.value);
                                setSelectedPubYear(value);
                            }}
                            className={styles.selectBox}
                            value={selectedPubYear}
                        >
                            <option value="">
                                -- Select Publication Year --
                            </option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1, marginRight: "8px" }}>
                        <label
                            htmlFor="seMethodSelect"
                            className={styles.label}
                        >
                            SE Method:
                        </label>
                        <select
                            id="seMethodSelect"
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedSeMethodId(value);
                                setSelectedClaim("");
                            }}
                            className={styles.selectBox}
                            value={selectedSeMethodId}
                        >
                            <option value="">-- Select SE Method --</option>
                            {seMethods.map((method) => (
                                <option key={method._id} value={method._id}>
                                    {method.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        {selectedSeMethodId && (
                            <div>
                                <label
                                    htmlFor="claimSelect"
                                    className={styles.label}
                                >
                                    Select Claim:
                                </label>
                                <select
                                    id="claimSelect"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedClaim(value);
                                    }}
                                    className={styles.selectBox}
                                    value={selectedClaim}
                                >
                                    <option value="">-- Select Claim --</option>
                                    {seMethods
                                        .find(
                                            (method) =>
                                                method._id ===
                                                selectedSeMethodId
                                        )
                                        ?.claims.map(
                                            (claim: Claim, index: number) => (
                                                <option
                                                    key={index}
                                                    value={claim.name}
                                                >
                                                    {claim.name}
                                                </option>
                                            )
                                        )}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <h2 className={styles.header}>Approved Articles</h2>
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
                            <th>Rating</th>
                            <th>Claim</th>
                            <th>Evidence</th>
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
                                <td>
                                    <StarRatingComponent
                                        name={`rating-${article._id}`}
                                        starCount={5}
                                        value={calculateAverageRating(article.ratings ?? [])}
                                        editing={true} // Prevents user from changing rating
                                        onStarClick={(nextValue: number) =>
                                            handleRatingSubmit(article._id, nextValue)
                                        }
                                    />
                                </td>
                                <td>{article.claim}</td>
                                <td>{article.evidence}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ArticleList;
