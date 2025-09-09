import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import text from '../constants/text.json';
import { Company } from '../types/Company';
import { Apartment } from '../types/Apartment';
import CompanyList from './CompanyList';
import ByggAbList from './ByggAbList';
import { fetchCompanies } from '../services/companyService';
import { fetchApartments } from '../services/apartmentService';
import Loading from './Loading';


const ByggAbPage: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [companyError, setCompanyError] = useState<string | null>(null);
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loadingApartments, setLoadingApartments] = useState(false);
    const [apartmentError, setApartmentError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const run = async () => {
            try {
                setLoadingCompanies(true);
                setCompanyError(null);
                const data = await fetchCompanies();
                setCompanies(data);
            } catch (err: unknown) {
                let message = text.genericError;
                if (err && typeof err === 'object' && 'name' in err && (err as any).name === 'AbortError') return;
                if (err instanceof Error) {
                    message = err.message;
                } else if (typeof err === 'string') {
                    message = err;
                }
                console.error('Could not fetch companies:', err);
                setCompanyError(message);
            } finally {
                setLoadingCompanies(false);
            }
        };
        run();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const fetchApts = async () => {
            if (selectedCompany == null) {
                setApartments([]);
                return;
            }
            setLoadingApartments(true);
            setApartmentError(null);
            try {
                const data = await fetchApartments(selectedCompany, false);
                setApartments(data);
            } catch (err: unknown) {
                let message = text.genericError;
                if (err instanceof Error) {
                    message = err.message;
                } else if (typeof err === 'string') {
                    message = err;
                }
                console.error('Could not fetch apartments:', err);
                setApartmentError(message);
            } finally {
                setLoadingApartments(false);
            }
        };
        fetchApts();
    }, [selectedCompany]);

    return (
        <div className="App home-center">
            <h2>{text.byggAbTitle}</h2>
            <p>{text.byggAbText}</p>
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
            {selectedCompany != null && (
                <div style={{ marginTop: 24 }}>
                    {loadingApartments ? (
                        <Loading />
                    ) : apartmentError ? (
                        <div className="error-message">{apartmentError}</div>
                    ) : (
                        <ByggAbList
                            apartments={apartments}
                            companies={companies}
                            selectedCompany={selectedCompany}
                        />
                    )}
                </div>
            )}
            <Link to="/" className="portal-btn" role="button">{text.backButton}</Link>
        </div>
    );
};

export default ByggAbPage;
