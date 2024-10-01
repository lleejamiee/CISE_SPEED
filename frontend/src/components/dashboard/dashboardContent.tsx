"use client";

import { useState } from "react";
import { Article } from "@/type/Article";
import SubmissionModal from "../submission/SubmissionModal";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

/**
 * Dashboard content component for article search and submission.
 * 
 * Featurs a button to open a submission modal and handle 
 * new article submissions.
 * 
 * @returns The rendered Content component.
 */
export default function Content() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle new article submission
  const handleNewArticleSubmission = (newArticle: Omit<Article, "_id" | "submittedAt" | "status">) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Article submitted: ", data);
        toast({
          title: "Article submitted successfully!",
        });
        closeModal(); // Close modal after successful submission
      })
      .catch((err) => {
        console.log("Error submitting article: " + err);
        toast({
          variant: "destructive",
          title: "Error submitting article: ",
          description: err.message
        });
      });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px" }}>
        <h1>Dashboard</h1>
        <Button 
          variant="outline"
          onClick={openModal}
        >
          + Submit Article
        </Button>
      </div>

      <SubmissionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSubmit={handleNewArticleSubmission} 
      />
    </div>
  );
}
