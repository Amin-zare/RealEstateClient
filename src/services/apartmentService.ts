import type { Apartment } from '../types/Apartment';

export async function fetchApartments(
  companyId: number,
  expiring: boolean,
  signal?: AbortSignal
): Promise<Apartment[]> {
  let baseUrl = process.env.REACT_APP_COMPANIES_URL;
  if (!baseUrl) throw new Error('REACT_APP_COMPANIES_URL saknas i miljövariabler.');
  baseUrl = baseUrl.replace(/\/+$/, ''); 
  const url = expiring
    ? `${baseUrl}/${companyId}/apartments/expiring`
    : `${baseUrl}/${companyId}/apartments`;

  const token = process.env.REACT_APP_AUTHORIZATION_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    throw new Error('Authorization token is missing or empty.');
  }

  try {
    const res = await fetch(url, {
      headers,
      signal
    });


    if (!res.ok) {
      throw new Error(`Begäran misslyckades (${res.status} ${res.statusText}) mot ${res.url}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Error fetching apartments:', err);
    throw err;
  }
}