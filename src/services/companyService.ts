import { Company } from '../types/Company';

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const token = process.env.REACT_APP_AUTHORIZATION_TOKEN;
    if (!token || token.trim() === '') {
      throw new Error('Authorization token is missing or empty.');
    }
    const baseUrl = process.env.REACT_APP_COMPANIES_URL;
    if (!baseUrl || baseUrl.trim() === '') {
      throw new Error('REACT_APP_COMPANIES_URL is missing or empty.');
    }
    const res = await fetch(baseUrl, {
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