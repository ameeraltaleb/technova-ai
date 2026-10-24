import { auth } from '@/lib/firebase';

/**
 * Securely calls the internal AI generation endpoint by attaching the authenticated
 * admin's Firebase ID token in the Authorization header.
 */
export async function callAdminAiApi(body: Record<string, any>): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.warn('Failed to retrieve Firebase auth token for AI API:', err);
  }

  return fetch('/api/ai/generate', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}
