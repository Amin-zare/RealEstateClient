import { Apartment } from '../types/Apartment';

export async function saveRenovatedApartments(
  apartments: Apartment[],
  renovatedState: { [id: number]: boolean }
): Promise<number> {
  if (!Array.isArray(apartments) || apartments.length === 0) {
    throw new TypeError('apartments must be a non-empty array');
  }
  if (
    typeof renovatedState !== 'object' || renovatedState === null ||
    Array.isArray(renovatedState)
  ) {
    throw new TypeError('renovatedState must be an object mapping numeric ids to booleans');
  }
  for (const key of Object.keys(renovatedState)) {
    if (isNaN(Number(key)) || typeof renovatedState[Number(key)] !== 'boolean') {
      throw new TypeError('renovatedState must map numeric ids to booleans');
    }
  }
  const webhookUrl = process.env.REACT_APP_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.trim() === '') {
    throw new Error('REACT_APP_WEBHOOK_URL is missing or empty.');
  }

  const changed = apartments.filter((a: Apartment) => renovatedState[a.id] !== a.isRenovated);
  const failures: Array<{ id: number; status?: number; statusText?: string; error?: any }> = [];
  for (const apt of changed) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': process.env.REACT_APP_WEBHOOK_SECRET || ''
        },
        body: JSON.stringify({ apartmentId: apt.id, isRenovated: renovatedState[apt.id] })
      });
      if (!res.ok) {
        failures.push({ id: apt.id, status: res.status, statusText: res.statusText });
        console.error(`Webhook failed for apartment ${apt.id}: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      failures.push({ id: apt.id, error });
      console.error(`Webhook error for apartment ${apt.id}:`, error);
    }
  }

  return changed.length;
}
