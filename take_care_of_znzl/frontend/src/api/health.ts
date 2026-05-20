import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

export async function wakeServer(maxRetries = 5): Promise<boolean> {
  for (let i = 0; i < maxRetries; i += 1) {
    try {
      const res = await axios.get<{ status: string }>(`${baseURL}/health`, {
        timeout: 15000,
      });
      if (res.data.status === 'ok') return true;
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return false;
}
