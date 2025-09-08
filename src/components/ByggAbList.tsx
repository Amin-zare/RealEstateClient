import React, { useState } from 'react';
import { Apartment } from '../types/Apartment';
import { Company } from '../types/Company';
import text from '../constants/text.json';

interface ApartmentListProps {
  apartments: Apartment[];
  companies: Company[];
  selectedCompany: number;
  showExpiring: boolean;
}


const ApartmentList: React.FC<ApartmentListProps> = ({
  apartments,
  companies,
  selectedCompany,
  showExpiring,
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
      // Skicka bara ändringar
      const changed = apartments.filter(a => renovatedState[a.id] !== a.isRenovated);
      const REACT_APP_WEBHOOK_URL = process.env.REACT_APP_WEBHOOK_URL || '';
      const REACT_APP_WEBHOOK_SECRET = process.env.REACT_APP_WEBHOOK_SECRET || '';
      for (const apt of changed) {
        await fetch(REACT_APP_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': REACT_APP_WEBHOOK_SECRET
          },
          body: JSON.stringify({ apartmentId: apt.id, isRenovated: renovatedState[apt.id] })
        });
      }
      setSaveMsg(changed.length > 0 ? 'Ändringar sparade!' : 'Inga ändringar att spara.');
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
            <div
              key={apt.id}
              className={`apartment-card${showExpiring ? ' expiring' : ''}`}
            >
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
              {showExpiring && (
                <div className="expiring-label">{text.expiringLabel}</div>
              )}
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
        {saveMsg && <span>{saveMsg}</span>}
      </div>
    </div>
  );
};

export default ApartmentList;
