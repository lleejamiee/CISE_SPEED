"use client";

import React, { useState, useEffect } from "react";
import { Article } from "@/type/Article";
import { useToast } from "@/hooks/use-toast";
import styles from "../../styles/articleList.module.css";
import { Claim, SeMethod } from "@/type/SeMethod";

/**
 *
 * @returns Approved articles component.
 */
function ArticleList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [seMethods, setSeMethods] = useState<SeMethod[]>([]);
    const [selectedSeMethodId, setSelectedSeMethodId] = useState<string>("");
    const [selectedClaim, setSelectedClaim] = useState<string>("");
    const [selectedPubYear, setSelectedPubYear] = useState<number>();
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
        fetchSeMethods();

        console.log("first useEffect: ");
        filteredArticles.map((article) => {
            console.log(article.title);
        });
    }, []);

    useEffect(() => {
        if (articles.length > 0) {
            console.log("HEREEEE");
            if (
                selectedClaim ||
                selectedSeMethodId ||
                searchTerm ||
                selectedPubYear
            ) {
                filterArticles();
            } else {
                fetchApprovedArticles();
            }
        }

        console.log("SE id: " + selectedSeMethodId);
        console.log("Claim: " + selectedClaim);
        console.log("Search Term: " + searchTerm);
        console.log("articles in useEffect: :");
        articles.map((article) => {
            console.log(article.title);
        });
    }, [
        searchTerm,
        selectedSeMethodId,
        selectedClaim,
        selectedPubYear,
        articles,
    ]);

    // Filter articles by author/title, SE method, claim, and pub year
    const filterArticles = () => {
        const filteredArticles = articles.filter((article) => {
            const titleMatch = article.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const authorMatch =
                article.authors
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) || false;

            const seMethodMatch = selectedSeMethodId
                ? article.seMethod === selectedSeMethodId
                : true;
            const claimMatch = selectedClaim
                ? article.claim === selectedClaim
                : true;
            const pubYearMatch = selectedPubYear
                ? article.pubYear === selectedPubYear
                : true;

            return (
                (titleMatch || authorMatch) &&
                seMethodMatch &&
                claimMatch &&
                pubYearMatch
            );
        });

        setFilteredArticles(filteredArticles);
    };

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
            <label htmlFor="claimSelect" style={{ marginRight: "8px" }}>
                Select SE Method:
            </label>
            <select
                id="seMethodSelect"
                onChange={(e) => {
                    const value = e.target.value;
                    setSelectedSeMethodId(value);
                    setSelectedClaim("");
                }}
                style={{
                    border: "1px solid #d3d3d3",
                    borderRadius: "4px",
                    padding: "8px",
                    width: "100%",
                    marginBottom: "16px",
                }}
                value={selectedSeMethodId}
            >
                <option value="">-- Select SE Method --</option>
                {seMethods.map((method) => (
                    <option key={method._id} value={method._id}>
                        {method.name}
                    </option>
                ))}
            </select>
            {selectedSeMethodId && (
                <div>
                    <label htmlFor="claimSelect" style={{ marginRight: "8px" }}>
                        Select Claim:
                    </label>
                    <select
                        id="claimSelect"
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedClaim(value);
                        }}
                        style={{
                            border: "1px solid #d3d3d3",
                            borderRadius: "4px",
                            padding: "8px",
                            width: "100%",
                            marginBottom: "16px",
                        }}
                        value={selectedClaim}
                    >
                        <option value="">-- Select Claim --</option>
                        {seMethods
                            .find((method) => method._id === selectedSeMethodId)
                            ?.claims.map((claim: Claim, index: number) => (
                                <option key={index} value={claim.name}>
                                    {claim.name}
                                </option>
                            ))}
                    </select>
                </div>
            )}
            <div>
                <label htmlFor="pubYearSelect" style={{ marginRight: "8px" }}>
                    Select Publication Year:
                </label>
                <select
                    id="pubYearSelect"
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setSelectedPubYear(value);
                    }}
                    style={{
                        border: "1px solid #d3d3d3",
                        borderRadius: "4px",
                        padding: "8px",
                        width: "100%",
                        marginBottom: "16px",
                    }}
                    value={selectedPubYear}
                >
                    <option value="">-- Select Publication Year --</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
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
