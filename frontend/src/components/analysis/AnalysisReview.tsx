import React, { useState, useEffect } from "react";
import { Article, ArticleStatus, Evidence } from "@/type/Article";
import { SeMethod, Claim } from "@/type/SeMethod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import CreateNewModal from "@/components/analysis/CreateNewModal";
import styles from "../../styles/Review.module.css";
import { toast } from "@/hooks/use-toast";

interface AnalysisReviewCardProps {
  article: Article;
  onStatusChange: (
    id: string,
    status: ArticleStatus,
    seMethodId?: string,
    claim?: string,
    evidence?: Evidence
  ) => void;
}

/**
 * Component for reviewing an article submission in the analysis queue.
 * Displays article details and allows analysers to select an SE method,
 * claim, and evidence before approving the article.
 *
 * @param article - The article object containing submission details.
 * @param onStatusChange - Function to update the article's status and related data.
 *
 * @returns AnalysisReviewCard component.
 */
const AnalysisReviewCard: React.FC<AnalysisReviewCardProps> = ({
  article,
  onStatusChange,
}) => {
  const [selectedSeMethodId, setSelectedSeMethodId] = useState<string>("");
  const [selectedClaim, setSelectedClaim] = useState<string>("");
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | "">("");
  const [seMethods, setSeMethods] = useState<SeMethod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAddSeMethodModalOpen, setIsAddSeMethodModalOpen] = useState(false);
  const [isAddClaimModalOpen, setIsAddClaimModalOpen] = useState(false);

  const isApprovedEnabled =
    !!selectedSeMethodId && !!selectedClaim && !!selectedEvidence;

  useEffect(() => {
    setSelectedSeMethodId("");
    setSelectedClaim("");
    setSelectedEvidence("");
    fetchSeMethods();
  }, [article]);

  // Fetch SE methods from the backend
  const fetchSeMethods = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/semethods`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
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

  // Handle article approval
  const handleApprove = async () => {
    if (!selectedSeMethodId || !selectedClaim || !selectedEvidence) {
      toast({
        title:
          "Please select an SE method, claim, and evidence before approving.",
      });
      return;
    }

    try {
      onStatusChange(
        article._id,
        ArticleStatus.APPROVED,
        selectedSeMethodId,
        selectedClaim,
        selectedEvidence
      );
      toast({
        title: `Article successfully updated and approved`,
      });
    } catch (error: any) {
      console.error("Error updating and approving article:", error);
      toast({
        title: error.message || "Error updating and approving article.",
      });
    }
  };

  // Handle adding new SE method
  const handleAddSeMethod = async (methodName: string) => {
    if (!methodName) {
      toast({ title: "Please enter a name for the new SE method." });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/semethods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: methodName, claims: [] }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create new SE method.");
      }

      const newMethod = await response.json();
      setSeMethods([...seMethods, newMethod]);
      setSelectedSeMethodId(newMethod._id);
      toast({ title: "New SE method created successfully!" });
    } catch (err: any) {
      console.error("Error creating SE method:", err);
      toast({ title: err.message || "Failed to create new SE method." });
    }
  };

  // Handle adding new claim
  const handleAddClaim = async (claimName: string) => {
    if (!claimName || !selectedSeMethodId) {
      toast({ title: "Please select a SE method and enter a claim." });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/semethods/${selectedSeMethodId}/claims`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: claimName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create new claim.");
      }

      const updatedMethod = await response.json();
      const updatedSeMethods = seMethods.map((method) =>
        method._id === updatedMethod._id ? updatedMethod : method
      );
      setSeMethods(updatedSeMethods);
      setSelectedClaim(claimName);
      toast({ title: "New claim added successfully!" });
    } catch (err: any) {
      console.error("Error creating claim:", err);
      toast({ title: err.message || "Failed to create new claim." });
    }
  };

  return (
    <Card className={`${styles.card}`}>
      <CardHeader>
        <CardTitle className="text-center">Analyse Submission</CardTitle>
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
          <h3>Analysis</h3>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <>
              <div>
                <label htmlFor="seMethodSelect" style={{ marginRight: "8px" }}>
                  Select SE Method:
                </label>
                <select
                  id="seMethodSelect"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "add") {
                      setIsAddSeMethodModalOpen(true);
                    } else {
                      setSelectedSeMethodId(value);
                      setSelectedClaim("");
                      setSelectedEvidence("");
                    }
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
                  <option value="add"> + Add new SE method</option>
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
                        if (value === "add") {
                          setIsAddClaimModalOpen(true);
                        } else {
                          setSelectedClaim(value);
                          setSelectedEvidence("");
                        }
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
                      <option value="add"> + Add new claim</option>
                    </select>

                    {selectedClaim && (
                      <div style={{ marginBottom: "16px" }}>
                        <label
                          htmlFor="evidenceSelect"
                          style={{ marginRight: "8px" }}
                        >
                          Select Evidence:
                        </label>
                        <select
                          id="evidenceSelect"
                          onChange={(e) =>
                            setSelectedEvidence(e.target.value as Evidence)
                          }
                          style={{
                            border: "1px solid #d3d3d3",
                            borderRadius: "4px",
                            padding: "8px",
                            width: "100%",
                          }}
                          value={selectedEvidence}
                        >
                          <option value="">-- Select Evidence --</option>
                          {Object.values(Evidence).map((evidence) => (
                            <option key={evidence} value={evidence}>
                              {evidence}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            style={{
              backgroundColor: isApprovedEnabled ? "green" : "lightgray",
              color: isApprovedEnabled ? "white" : "black",
            }}
            onClick={handleApprove}
            disabled={!isApprovedEnabled}
          >
            Approve
          </Button>
        </CardFooter>
      </div>

      <CreateNewModal
        title="Add new SE method"
        isOpen={isAddSeMethodModalOpen}
        onClose={() => setIsAddSeMethodModalOpen(false)}
        onSubmit={(value) => handleAddSeMethod(value)}
      />
      <CreateNewModal
        title={`Add new claim for ${
          seMethods.find((method) => method._id === selectedSeMethodId)?.name
        }`}
        isOpen={isAddClaimModalOpen}
        onClose={() => setIsAddClaimModalOpen(false)}
        onSubmit={(value) => handleAddClaim(value)}
      />
    </Card>
  );
};

export default AnalysisReviewCard;
