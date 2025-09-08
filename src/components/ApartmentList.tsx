import React from 'react';
import { Apartment } from '../types/Apartment';
import { Company } from '../types/Company';
import text from '../constants/text.json';

interface ApartmentListProps {
  apartments: Apartment[];
  companies: Company[];
  selectedCompany: number;
  showExpiring: boolean;
  setShowExpiring: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApartmentList: React.FC<ApartmentListProps> = ({
  apartments,
  companies,
  selectedCompany,
  showExpiring,
  setShowExpiring,
}) => (
  <div>
    <h2>
      {text.apartmentsFor}{' '}
      {companies.find((c) => c.id === selectedCompany)?.name}
    </h2>
    <button
      className="expiring-btn"
      style={{ marginBottom: 16 }}
      onClick={() => setShowExpiring((prev) => !prev)}
    >
      {showExpiring ? text.showAllApartments : text.showExpiringContracts}
    </button>
    <div className="apartment-list">
      {apartments.length === 0 ? (
        <div className="apartment-card empty">{text.noApartments}</div>
      ) : (
        apartments.map((apt) => (
          <div
            key={apt.id}
            className={`apartment-card${showExpiring ? ' expiring' : ''}`}
          >
            <div className="apartment-address">
              <strong>{apt.address}</strong>
              {apt.isRenovated && (
                <span className="renovated">{text.renovated}</span>
              )}
            </div>
            <div className="apartment-lease">
              {text.leaseEnd}{' '}
              {new Date(apt.leaseEnd).toLocaleDateString()}
            </div>
            {showExpiring && (
              <div className="expiring-label">{text.expiringLabel}</div>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

export default ApartmentList;
