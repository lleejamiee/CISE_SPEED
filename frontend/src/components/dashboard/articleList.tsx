"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Article } from "@/type/Article";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/use-debounce";
import styles from "../../styles/articleList.module.css";
import { Claim, SeMethod } from "@/type/SeMethod";
import { Rating } from "@mui/material"; // Material-UI Rating component

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
    const [sortColumn, setSortColumn] = useState<string>("title");
    const [sortDirection, setSortDirection] = useState<string>("asc");

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

    useEffect(() => {
        fetchApprovedArticles();
        fetchSeMethods();

        console.log("--First useEffect--");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (articles.length > 0) {
            console.log("--HEREEEE--");
            filterArticles();
        }

        console.log("SE id: " + selectedSeMethodId);
        console.log("Claim: " + selectedClaim);
        console.log("Search Term: " + searchTerm);
        console.log("Pub Year: " + selectedPubYear);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        articles,
        debouncedSearchTerm,
        selectedSeMethodId,
        selectedClaim,
        selectedPubYear,
        sortColumn,
        sortDirection,
        searchTerm,
    ]);

    // Filter articles by author/title, SE method, claim, and pub year
    const filterArticles = useCallback(() => {
        let filtered = articles.filter((article) => {
            const titleMatch = article.title
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase());
            const authorMatch =
                article.authors
                    ?.toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase()) || false;

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

        filtered = filtered.sort((a, b) => {
            let comparison = 0;

            if (sortColumn === "title") {
                comparison = (a.title || "").localeCompare(b.title || "");
            } else if (sortColumn === "authors") {
                comparison = (a.authors || "").localeCompare(b.authors || "");
            } else if (sortColumn === "pubYear") {
                comparison = (a.pubYear || 0) - (b.pubYear || 0);
            } else if (sortColumn === "journal") {
                comparison = (a.journal || "").localeCompare(b.journal || "");
            } else if (sortColumn === "doi") {
                comparison = (a.doi || "").localeCompare(b.doi || "");
            } else if (sortColumn === "ratings") {
                comparison = (a.pubYear || 0) - (b.pubYear || 0);
            } else if (sortColumn === "claim") {
                comparison = (a.claim || "").localeCompare(b.claim || "");
            } else if (sortColumn === "evidence") {
                comparison = (a.evidence || "").localeCompare(b.evidence || "");
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });

        setFilteredArticles(filtered);
        console.log("Filtered Articles: " + filtered.length);
    }, [
        articles,
        debouncedSearchTerm,
        selectedSeMethodId,
        selectedClaim,
        selectedPubYear,
        sortColumn,
        sortDirection,
    ]);

    const handleSort = (column: string) => {
        const newDirection =
            sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(newDirection);
    };

    const calculateAverageRating = (ratings: number[]): number => {
        if (!ratings || ratings.length === 0) return 0;
        const sum = ratings.reduce((a, b) => a + b, 0);
        return sum / ratings.length;
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

    useEffect(() => {
        if (searchTerm !== "") {
            initialFilter();
        } else {
            setFilteredArticles(articles); // Reset to all articles when search is empty
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

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
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>
                                    <span>Title</span>
                                    <br></br>
                                    <button
                                        className={styles.sortButton}
                                        onClick={() => handleSort("title")}
                                        aria-label="Sort by title"
                                    >
                                        sort
                                        {sortColumn === "title" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </button>
                                </th>
                                <th>
                                    <span>Authors</span>
                                    <br></br>
                                    <button
                                        className={styles.sortButton}
                                        onClick={() => handleSort("authors")}
                                        aria-label="Sort by authors"
                                    >
                                        sort
                                        {sortColumn === "authors" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </button>
                                </th>
                                <th>
                                    <th>
                                        <span>Journal</span>
                                        <br></br>
                                        <button
                                            className={styles.sortButton}
                                            onClick={() =>
                                                handleSort("journal")
                                            }
                                            aria-label="Sort by journal"
                                        >
                                            sort
                                            {sortColumn === "journal" &&
                                                (sortDirection === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </button>
                                    </th>
                                </th>
                                <th>
                                    <span>Publication Year</span>
                                    <br></br>
                                    <button
                                        className={styles.sortButton}
                                        onClick={() => handleSort("pubYear")}
                                        aria-label="Sort by publication year"
                                    >
                                        sort
                                        {sortColumn === "pubYear" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </button>
                                </th>
                                <th>
                                    <span>DOI</span>
                                    <br></br>
                                    <button
                                        className={styles.sortButton}
                                        onClick={() => handleSort("doi")}
                                        aria-label="Sort by doi"
                                    >
                                        sort
                                        {sortColumn === "doi" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </button>
                                </th>
                                <th>
                                    <span>Star Rating</span>
                                </th>
                                <th>
                                    <span>Claim</span>
                                    <br></br>
                                    <button
                                        className={styles.sortButton}
                                        onClick={() => handleSort("claim")}
                                        aria-label="Sort by claim"
                                    >
                                        sort
                                        {sortColumn === "claim" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </button>
                                </th>
                                <th>
                                    <span>Evidence</span>
                                    <br></br>
                                    <button
                                        className={styles.sortButton}
                                        onClick={() => handleSort("evidence")}
                                        aria-label="Sort by evidence"
                                    >
                                        sort
                                        {sortColumn === "evidence" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </button>
                                </th>
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
                                        <Rating
                                            name={`rating-${article._id}`}
                                            value={calculateAverageRating(
                                                article.ratings ?? []
                                            )}
                                            onChange={(event, newValue) =>
                                                handleRatingSubmit(
                                                    article._id,
                                                    newValue || 0
                                                )
                                            }
                                            precision={0.5}
                                        />
                                    </td>

                                    <td>{article.claim}</td>
                                    <td>{article.evidence}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ArticleList;
