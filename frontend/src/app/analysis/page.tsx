import AnalysisQueue from "@/components/analysis/AnalysisQueue";
import Navbar from "@/components/navbar/navbar";

export default function analysisPage() {
    return (
        <div>
        <header style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <Navbar />
        </header>
        <main>
          <AnalysisQueue />
        </main>
      </div>
    );
}
