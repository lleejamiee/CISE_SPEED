"use client";

import React, { useState, useEffect, useContext } from "react";
import { Article } from "@/type/Article";
import { useToast } from "@/hooks/use-toast";
import styles from "../../styles/articleList.module.css";
import { Claim, SeMethod } from "@/type/SeMethod";
import { AuthenticationContext } from "@/context/AuthContext";

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
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [toDelete, setToDelete] = useState<Article>();
    const authContext = useContext(AuthenticationContext);
    const { user } = authContext;

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
            setFilteredArticles(data);
        } catch (err) {
            setError("Failed to load articles.");
            toast({ title: "Failed to load articles." });
        }
    };

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

    useEffect(() => {
        if (articles.length > 0) {
            console.log("HEREEEE");
            if (toDelete) {
                fetchApprovedArticles();
            } else if (selectedClaim || selectedSeMethodId) {
                filterBySEorClaim();
            } else {
                fetchApprovedArticles();
            }
        }

        console.log("SE id: " + selectedSeMethodId);
        console.log("Claim: " + selectedClaim);
        console.log("articles in useEffect: :");
        articles.map((article) => {
            console.log(article.title);
        });
    }, [selectedSeMethodId, selectedClaim, toDelete]);

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

    const removeArticle = async (article: Article) => {
        setToDelete(article);
        if (window.confirm("Delete article " + article.title + "?")) {
            fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/${article._id}`,
                {
                    method: "DELETE",
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error deleting article.");
                    }
                    console.log("To delete: " + toDelete);
                    setToDelete(undefined);
                    console.log("To delete after: " + toDelete);
                    fetchApprovedArticles();
                    initialFilter();

                    toast({ title: "Article deleted successfully." });
                })
                .catch((error) => {
                    console.error("Deletion error:", error);
                    toast({ title: "Failed to delete article." });
                });
        } else {
            setToDelete(undefined);
        }
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
                            {user?.role === "admin" && <th>Delete</th>}
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
                                {user?.role === "admin" && (
                                    <td>
                                        <button
                                            onClick={() =>
                                                removeArticle(article)
                                            }
                                        >
                                            delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ArticleList;
