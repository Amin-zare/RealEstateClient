import React, { useState, useEffect } from 'react';
import { Company } from '../types/Company';
import { Apartment } from '../types/Apartment';
import { fetchCompanies } from '../services/companyService';
import { fetchApartments } from '../services/apartmentService';
import text from '../constants/text.json';
import CompanyList from '../components/CompanyList';
import Loading from './Loading';
import ApartmentList from '../components/ApartmentList';
import { Link } from 'react-router-dom';

const PortalPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [showExpiring, setShowExpiring] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingApts, setLoadingApts] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [aptError, setAptError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        setLoadingCompanies(true);
        setCompanyError(null);
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Could not fetch companies:', err);
        setCompanyError(text.genericError);
      } finally {
        setLoadingCompanies(false);
      }
    };
    run();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedCompany === null) {
      setApartments([]);
      return;
    }
    const controller = new AbortController();
    setLoadingApts(true);
    setAptError(null);
    fetchApartments(selectedCompany, showExpiring)
      .then((data) => {
        setApartments(data);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        console.error('Could not fetch apartments:', err);
        setApartments([]);
        setAptError(text.genericError);
      })
      .finally(() => {
        setLoadingApts(false);
      });
    return () => {
      controller.abort();
    };
  }, [selectedCompany, showExpiring]);

  return (
    <div className="App">
      <h1>{text.welcomeTitle}</h1>
      <h2>{text.chooseCompany}</h2>
      {loadingCompanies ? (
        <Loading />
      ) : companyError ? (
        <div className="error-message">{companyError}</div>
      ) : (
        <CompanyList
          companies={companies}
          selectedCompany={selectedCompany}
          onSelect={setSelectedCompany}
        />
      )}
      {selectedCompany !== null && (
        loadingApts ? (
          <Loading />
        ) : aptError ? (
          <div className="error-message">{aptError}</div>
        ) : (
          <ApartmentList
            apartments={apartments}
            companies={companies}
            selectedCompany={selectedCompany}
            showExpiring={showExpiring}
            setShowExpiring={setShowExpiring}
          />
        )
      )}
      <Link to="/" className="portal-btn" role="button">{text.backButton}</Link>
    </div>

  );
};

export default PortalPage;
