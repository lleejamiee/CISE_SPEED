"use client"; // Add this line at the top

import React, { useState } from "react";
import Content from "@/components/dashboardContent";
import Navbar from "@/components/navbar";

export default function DashboardPage() {
    // State to handle modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Navbar />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px" }}>
                <h1>Dashboard</h1>
                <button 
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                    onClick={openModal}
                >
                    + Add
                </button>
            </div>
            <Content />

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "500px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                    }}>
                        <h2>New Submission</h2>
                        <form>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Title:</label>
                                <input type="text" name="title" style={{ width: "100%", padding: "8px" }} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Author:</label>
                                <input type="text" name="author" style={{ width: "100%", padding: "8px" }} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Journal:</label>
                                <input type="text" name="journal" style={{ width: "100%", padding: "8px" }} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Year:</label>
                                <input type="number" name="year" style={{ width: "100%", padding: "8px" }} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Volume:</label>
                                <input type="text" name="volume" style={{ width: "100%", padding: "8px" }} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Pages:</label>
                                <input type="text" name="pages" style={{ width: "100%", padding: "8px" }} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>DOI:</label>
                                <input type="text" name="doi" style={{ width: "100%", padding: "8px" }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <button 
                                    type="button"
                                    style={{ marginRight: "10px", padding: "10px 20px", cursor: "pointer" }}
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
