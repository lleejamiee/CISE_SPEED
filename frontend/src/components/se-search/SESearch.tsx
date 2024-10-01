import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/SESearch.css';

interface Article {
  title: string;
  authors: string;
  journal: string;
  pubYear: number;
  volume?: string;
  pages?: string;
  doi?: string;
  status: string;
}

// List of predefined SE practices
const SE_PRACTICES = [
  'Test-Driven Development',
  'Pair Programming',
  'Continuous Integration',
  'Code Reviews',
  'Agile Practices',
  'Refactoring',
  'Version Control',
];

const SESearch = () => {
  const [selectedPractice, setSelectedPractice] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle selection from dropdown
  const handlePracticeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPractice(event.target.value);
  };

  // Handle search action
  const handleSearch = async () => {
    if (!selectedPractice) {
      alert('Please select an SE practice.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/articles?practice=${selectedPractice}`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="se-search-container">
      <h2 className="se-search-title">Search SE Evidence</h2>

      <div className="se-search-dropdown">
        <select value={selectedPractice} onChange={handlePracticeChange} className="practice-select">
          <option value="" disabled>Select an SE Practice</option>
          {SE_PRACTICES.map((practice) => (
            <option key={practice} value={practice}>
              {practice}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Display search results */}
      {articles.length > 0 && (
        <div className="results-container">
          <h3>Results:</h3>
          <ul>
            {articles.map((article) => (
              <li key={article.doi}>
                <strong>{article.title}</strong> by {article.authors}, {article.journal}, {article.pubYear}.
                {article.volume && ` Volume: ${article.volume},`} {article.pages && ` Pages: ${article.pages}`}.
                <br />
                DOI: {article.doi}
              </li>
            ))}
          </ul>
        </div>
      )}

      {articles.length === 0 && !loading && <p>No articles found for the selected practice.</p>}
    </div>
  );
};

export default SESearch;
