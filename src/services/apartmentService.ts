import type { Apartment } from '../types/Apartment';
// Fetches apartments for a company. If expiring is true, fetches only expiring apartments.
export async function fetchApartments(
  companyId: number,
  expiring: boolean,
): Promise<Apartment[]> {
  const token = process.env.REACT_APP_AUTHORIZATION_TOKEN!;
  const baseUrl = process.env.REACT_APP_COMPANIES_URL;
  if (!baseUrl) throw new Error('REACT_APP_COMPANIES_URL saknas i miljövariabler.');
  if (!token) throw new Error('REACT_APP_AUTHORIZATION_TOKEN saknas i miljövariabler.');
  const url = expiring
    ? `${baseUrl}/${companyId}/apartments/expiring`
    : `${baseUrl}/${companyId}/apartments`;
  let status: number | undefined;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    status = res.status;

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Error fetching apartments:', err);
    throw err;
  }
}