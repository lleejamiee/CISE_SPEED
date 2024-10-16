import { toast } from "@/hooks/use-toast";
import { Article } from "@/type/Article";

interface DeleteButtonProps {
    toDelete: Article | undefined;
    setToDelete: React.Dispatch<React.SetStateAction<Article | undefined>>;
}

export default function DeleteButton({
    toDelete,
    setToDelete,
}: DeleteButtonProps) {
    const removeArticle = async () => {
        setToDelete(toDelete);
        if (
            toDelete &&
            window.confirm("Delete article " + toDelete.title + "?")
        ) {
            fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/${toDelete._id}`,
                {
                    method: "DELETE",
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error deleting article.");
                    }
                    setToDelete(undefined);

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

    return <button onClick={removeArticle}>Delete</button>;
}
