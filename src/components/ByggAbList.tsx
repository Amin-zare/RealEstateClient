import React, { useState } from 'react';
import { saveRenovatedApartments } from '../services/saveRenovatedApartments';
import { Apartment } from '../types/Apartment';
import { Company } from '../types/Company';
import text from '../constants/text.json';

interface ApartmentListProps {
  apartments: Apartment[];
  companies: Company[];
  selectedCompany: number;
}


const ApartmentList: React.FC<ApartmentListProps> = ({
  apartments,
  companies,
  selectedCompany,
}) => {
  const [renovatedState, setRenovatedState] = useState<{[id: number]: boolean}>(
    () => Object.fromEntries(apartments.map(a => [a.id, a.isRenovated]))
  );
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleCheckbox = (id: number) => {
    setRenovatedState(prev => ({ ...prev, [id]: !prev[id] }));
    setSaveMsg(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const changedCount = await saveRenovatedApartments(apartments, renovatedState);
      setSaveMsg((typeof changedCount === 'number' && changedCount > 0) ? 'Ändringar sparade!' : 'Inga ändringar att spara.');
    } catch (err) {
      setSaveMsg('Fel vid sparande!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>
        {text.apartmentsFor}{' '}
        {companies.find((c) => c.id === selectedCompany)?.name}
      </h2>
      <div className="apartment-list">
        {apartments.length === 0 ? (
          <div className="apartment-card empty">{text.noApartments}</div>
        ) : (
          apartments.map((apt) => (
            <div key={apt.id} className="apartment-card">
              <div className="apartment-address">
                <input
                  type="checkbox"
                  checked={!!renovatedState[apt.id]}
                  onChange={() => handleCheckbox(apt.id)}
                  style={{ marginRight: 8 }}
                  aria-label={text.renovated}
                />
                <strong>{apt.address}</strong>
              </div>
              <div className="apartment-lease">
                {text.leaseEnd}{' '}
                {new Date(apt.leaseEnd).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: 24,  gap: 12 }}>
        <button
          className="portal-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Sparar...' : 'Spara'}
        </button>
        {saveMsg && <span className="save-message">{saveMsg}</span>}
      </div>
    </div>
  );
};

export default ApartmentList;
