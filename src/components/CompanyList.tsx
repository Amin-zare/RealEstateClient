import React from 'react';
import { Company } from '../types/Company';

interface CompanyListProps {
  companies: Company[];
  selectedCompany: number | null;
  onSelect: (id: number) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, selectedCompany, onSelect }) => (
  <ul className="company-list">
    {companies.map((company) => (
      <li key={company.id}>
        <button
          type="button"
          className={`company-btn${selectedCompany === company.id ? ' selected' : ''}`}
          aria-pressed={selectedCompany === company.id}
          onClick={() => onSelect(company.id)}
        >
          {company.name}
        </button>
      </li>
    ))}
  </ul>
);

export default CompanyList;
