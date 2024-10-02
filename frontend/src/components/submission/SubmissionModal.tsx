"use client";

import { useState } from "react";
import { Article } from "@/type/Article";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    newArticle: Omit<Article, "_id" | "submittedAt" | "status">
  ) => void;
}

/**
 * SubmissionModal component for article submission
 */
const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([""]);
  const [journal, setJournal] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [volume, setVolume] = useState<number | "">("");
  const [startPage, setStartPage] = useState<number | "">("");
  const [endPage, setEndPage] = useState<number | "">("");
  const [doi, setDoi] = useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  // Add a new author input
  const handleAddAuthor = () => {
    setAuthors([...authors, ""]);
  };

  // Remove the author at the specified index
  const handleRemoveAuthor = (index: number) => {
    const updatedAuthors = authors.filter((_, i) => i !== index);
    setAuthors(updatedAuthors);
  };

  // Update the specific author input
  const handleAuthorChange = (index: number, value: string) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index] = value;
    setAuthors(updatedAuthors);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pages = endPage ? `${startPage}-${endPage}` : `${startPage}`;

    const newArticle: Omit<Article, "_id" | "submittedAt" | "status"> = {
      title,
      authors: authors.join(", "),
      journal,
      pubYear: typeof year === "number" ? year : 0,
      volume: typeof volume === "number" ? volume : 0,
      pages,
      doi,
    };

    onSubmit(newArticle);

    // Reset the form fields
    setTitle("");
    setAuthors([""]);
    setJournal("");
    setYear("");
    setVolume("");
    setStartPage("");
    setEndPage("");
    setDoi("");
  };

  if (!isOpen) return null; // Return null if modal is not open

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "500px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "#333",
          }}
        >
          &times;
        </button>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          New Submission
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Title:</label>
            <Input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Authors:</label>
            {authors.map((author, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Input
                  type="text"
                  name={`author${index}`}
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                  required={index === 0} // Make only the first author required
                />
                {index > 0 && (
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveAuthor(index)}
                    style={{ marginLeft: "5px" }}
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleAddAuthor}
              style={{ marginTop: "5px" }}
              disabled={!authors[0]}
            >
              + Add another author
            </Button>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Journal:</label>
            <Input
              type="text"
              name="journal"
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Publication Year:</label>
            <select
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: "5px",
                padding: "8px",
                margin: "5px",
                width: "150px",
              }}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
            >
              <option value="">Select a year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Volume:</label>
            <Input
              type="number"
              name="volume"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <label>Pages:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                type="number"
                name="startPage"
                value={startPage}
                onChange={(e) => setStartPage(Number(e.target.value) || "")}
                style={{ width: "100px" }}
              />
              <span style={{ margin: "0 10px" }}>-</span>
              <Input
                type="number"
                name="endPage"
                value={endPage}
                onChange={(e) => setEndPage(Number(e.target.value) || "")}
                style={{ width: "100px" }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "40px" }}>
            <label>DOI:</label>
            <Input
              type="text"
              name="doi"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              variant="outline"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionModal;
