
import './App.css';
import React, { useState } from 'react';
import { Company } from './types/Company';
import { fetchCompanies } from './services/companyService';
import text from './constants/text.json';
import CompanyList from './components/CompanyList';

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
      // Fetch companies without signal argument  const data = await fetchCompanies();
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (err: any) {
        if (err.name === 'AbortError') return; // Ignore abort
        console.error('Could not fetch companies:', err);
        setError('Något gick fel. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="App">
      <h1>{text.welcomeTitle}</h1>
      <h2>{text.chooseCompany}</h2>
      {loading ? (
        <div className="loading" role="status" aria-live="polite">
          <span className="spinner" />
          <span style={{marginLeft: '1rem'}}>{text.loading}</span>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <CompanyList
          companies={companies}
          selectedCompany={selectedCompany}
          onSelect={setSelectedCompany}
        />
      )}
    </div>
  );
}

export default App;