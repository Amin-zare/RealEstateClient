import { Company } from '../types/Company';

export async function fetchCompanies(): Promise<Company[]> {
  const url = process.env.REACT_APP_COMPANIES_URL;
  const token = process.env.REACT_APP_AUTHORIZATION_TOKEN;
  if (!url) throw new Error('REACT_APP_COMPANIES_URL saknas i miljövariabler.');
  if (!token) throw new Error('REACT_APP_AUTHORIZATION_TOKEN saknas i miljövariabler.');
  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('API svarar inte med en lista av företag.');
    }
    return data as Company[];
  } catch (err) {
    if ((err as any).name === 'AbortError') {
      throw new Error('Begäran avbröts (timeout eller avbruten).');
    }
    throw new Error('Kunde inte hämta företag: ' + (err instanceof Error ? err.message : String(err)));
  }
}