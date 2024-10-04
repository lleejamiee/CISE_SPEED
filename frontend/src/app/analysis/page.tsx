import AnalysisQueue from "@/components/analysis/AnalysisQueue";
import Navbar from "@/components/navbar/navbar";

export default function analysisPage() {
    return (
        <div>
            <Navbar />
            <main>
                <AnalysisQueue />
            </main>
        </div>
    );
}
