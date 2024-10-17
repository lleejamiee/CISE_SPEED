import React, { useState, useEffect } from "react";
import { Article, ArticleStatus } from "@/type/Article";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import styles from "../../styles/Review.module.css";
import { toast } from "@/hooks/use-toast";

interface ModerationReviewCardProps {
  article: Article;
  onStatusChange: (id: string, status: ArticleStatus) => void;
  onDelete: (id: string) => void;
}

/**
 * Component for reviewing an article in the moderation queue.
 * Displays article details, allows moderators to check for duplicates,
 * mark relevance, and approve or reject the submission.
 *
 * @param article - The selected article for review.
 * @param onStatusChange - Function to change the article status.
 * @param onDelete - Function to delete the article.
 *
 * @returns ModerationReviewCard component.
 */
const ModerationReviewCard: React.FC<ModerationReviewCardProps> = ({
  article,
  onStatusChange,
  onDelete,
}) => {
  const [isRelevant, setIsRelevant] = useState(false);
  const [isPeerReviewed, setIsPeerReviewed] = useState(false);
  const [isDuplicateConfirmed, setIsDuplicateConfirmed] = useState(false);
  const [buttonText, setButtonText] = useState("Search for duplicates");
  const [duplicates, setDuplicates] = useState<Article[]>([]);
  const [showDuplicates, setShowDuplicates] = useState(false);

  useEffect(() => {
    setIsRelevant(false);
    setIsPeerReviewed(false);
    setIsDuplicateConfirmed(false);
    setButtonText("Search for duplicates");
    setDuplicates([]);
    setShowDuplicates(false);
  }, [article]);

  // Handle article rejection
  const handleReject = () => {
    if (isDuplicateConfirmed) {
      onDelete(article._id);
      toast({ title: `Article deleted as a confirmed duplicate.` });
    } else {
      onStatusChange(article._id, ArticleStatus.REJECTED);
      toast({ title: `Article status updated to rejected.` });
    }
  };

  // Handle article approval
  const handleApprove = () => {
    onStatusChange(article._id, ArticleStatus.PENDING_ANALYSIS);
    toast({ title: `Article status updated to pending analysis.` });
  };

  // Search for duplicate titles or doi's from the database
  const searchForDuplicates = () => {
    setButtonText("Searching...");

    const titleParam = encodeURIComponent(article.title.trim().toLowerCase());
    const doiParam = encodeURIComponent(article.doi.trim());
    console.log("titleParam: ", titleParam, ",doi: ", doiParam);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/duplicates?title=${titleParam}&doi=${doiParam}`;

    fetch(url, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          console.log(response.statusText);
          throw new Error(`Error fetching duplicates: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setDuplicates(data);
          setShowDuplicates(true);
          setButtonText("Possible duplicates found");
        } else {
          setButtonText("No duplicates found");
          setShowDuplicates(false);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  // Determine if the "Approve" button should be enabled
  const isApproveEnabled = isRelevant && isPeerReviewed;

  return (
    <Card className={`${styles.card}`}>
      <CardHeader>
        <CardTitle className={"text-center"}>Review Submission</CardTitle>
        <h3>Article Details</h3>
        <p>
          <strong>Title: </strong>
          {article.title}
        </p>
        <p>
          <strong>Authors: </strong>
          {article.authors}
        </p>
        <p>
          <strong>Journal: </strong>
          {article.journal}
        </p>
        <p>
          <strong>Publication Year: </strong>
          {article.pubYear}
        </p>
        <p>
          <strong>DOI: </strong>
          {article.doi || "Not provided"}
        </p>
      </CardHeader>
      <div className={styles.reviewWrapper}>
        <CardContent>
          <h3>Review</h3>
          <Button
            variant="link"
            onClick={searchForDuplicates}
            className={`${styles.searchButton} ${
              buttonText !== "Search for duplicates"
                ? duplicates.length > 0
                  ? styles.duplicateFound
                  : styles.noDuplicatesFound
                : ""
            }`}
          >
            {buttonText}
          </Button>

          {showDuplicates && duplicates.length > 0 && (
            <div className={styles.duplicatesPopup}>
              <table className={styles.duplicatesTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Authors</th>
                    <th>Status</th>
                    <th>DOI</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicates.map((dup) => (
                    <tr key={dup._id}>
                      <td>
                        <strong>{dup.title}</strong>
                      </td>
                      <td>{dup.authors || "Not provided"}</td>
                      <td>{dup.status}</td>
                      <td>{dup.doi || "Not provided"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: "10px" }}>
                <input
                  type="checkbox"
                  id="isDuplicateConfirmed"
                  checked={isDuplicateConfirmed}
                  onChange={() =>
                    setIsDuplicateConfirmed(!isDuplicateConfirmed)
                  }
                />
                <label
                  htmlFor="isDuplicateConfirmed"
                  style={{ marginLeft: "0.5rem" }}
                >
                  Is this article a duplicate?
                </label>
              </div>
              <button
                onClick={() => setShowDuplicates(false)}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              id="relevance"
              style={{ width: "16px", height: "16px" }}
              checked={isRelevant}
              onChange={() => setIsRelevant(!isRelevant)}
            />
            <label htmlFor="relevance">
              Is the article relevant to the empirical evaluation of SE
              practices?
            </label>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              id="peerReviewed"
              style={{ width: "16px", height: "16px" }}
              checked={isPeerReviewed}
              onChange={() => setIsPeerReviewed(!isPeerReviewed)}
            />
            <label htmlFor="peerReviewed">
              Is the article published in a peer-reviewed journal or conference?
            </label>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant={"destructive"}
            onClick={handleReject}
            style={{ marginRight: "20px" }}
          >
            Reject
          </Button>
          <Button
            variant={isApproveEnabled ? undefined : "outline"}
            style={
              isApproveEnabled
                ? { backgroundColor: "green", color: "white" }
                : {}
            }
            onClick={handleApprove}
            disabled={!isApproveEnabled}
          >
            Approve
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ModerationReviewCard;
