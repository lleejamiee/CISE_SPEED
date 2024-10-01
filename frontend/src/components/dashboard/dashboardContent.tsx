import { useState } from "react";
import { Article, ArticleStatus } from "@/type/Article";

export default function Content() {
    // State to handle modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State to store form input values
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [journal, setJournal] = useState("");
    const [year, setYear] = useState<number | "">("");
    const [volume, setVolume] = useState<number | "">("");
    const [pages, setPages] = useState("");
    const [doi, setDoi] = useState("");

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to submit a new article to the backend
    const submitNewArticle = (e: React.FormEvent) => {
        e.preventDefault();

        const newArticle: Omit<Article, "_id" | "submittedAt" | "status"> = {
            title,
            authors: author,
            journal,
            pubYear: typeof year === "number" ? year : 0,
            volume: typeof volume === "number" ? volume : 0,
            pages,
            doi,
        };

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
                // Optionally close the modal and reset the form
                setIsModalOpen(false);
                setTitle("");
                setAuthor("");
                setJournal("");
                setYear("");
                setVolume("");
                setPages("");
                setDoi("");
            })
            .catch((err) => {
                console.log("Error submitting article: " + err);
            });
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px" }}>
                <h1>Dashboard</h1>
                <button 
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                    onClick={openModal}
                >
                    + Add
                </button>
            </div>

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
                        <form onSubmit={submitNewArticle}>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Title:</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    style={{ width: "100%", padding: "8px" }} 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Author:</label>
                                <input 
                                    type="text" 
                                    name="author" 
                                    style={{ width: "100%", padding: "8px" }}
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Journal:</label>
                                <input 
                                    type="text" 
                                    name="journal" 
                                    style={{ width: "100%", padding: "8px" }}
                                    value={journal}
                                    onChange={(e) => setJournal(e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Year:</label>
                                <input 
                                    type="number" 
                                    name="year" 
                                    style={{ width: "100%", padding: "8px" }}
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Volume:</label>
                                <input 
                                    type="number" 
                                    name="volume" 
                                    style={{ width: "100%", padding: "8px" }}
                                    value={volume}
                                    onChange={(e) => setVolume(Number(e.target.value))}
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Pages:</label>
                                <input 
                                    type="text" 
                                    name="pages" 
                                    style={{ width: "100%", padding: "8px" }}
                                    value={pages}
                                    onChange={(e) => setPages(e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>DOI:</label>
                                <input 
                                    type="text" 
                                    name="doi" 
                                    style={{ width: "100%", padding: "8px" }}
                                    value={doi}
                                    onChange={(e) => setDoi(e.target.value)}
                                />
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
