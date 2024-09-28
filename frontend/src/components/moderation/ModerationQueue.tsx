"use client"

import React, { useState, useEffect } from "react";
import { Article } from "@/type/Article";

/**
 * Displays a table of articles with 'pending' status.
 * 
 * @returns Moderation queue component.
 */
function ModerationQueue() {
  // State to store fetched articles
  const [articles, setArticles] = useState<Article[]>([]);

  // Fetch only pending articles from the backend
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/articles/status?status=pending`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data: ", data);
        setArticles(data);
      })
      .catch((err) => {
        console.log("Error from ShowModerationQueue: " + err);
      });
  }, []);
  

  return (
    <div className="ShowModerationQueue">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <br />
            <h2 className="display-4 text-center">Moderation Queue</h2>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
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
                  <td colSpan={7} className="text-center">
                    No articles found.
                  </td>
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
                    <td>{article.submittedAt ? article.submittedAt.toString() : "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ModerationQueue;
