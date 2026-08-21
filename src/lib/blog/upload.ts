import { PARSE_APP_ID, PARSE_JAVASCRIPT_KEY, PARSE_SERVER_URL } from './config';

/** Uploads to the Parse Files API and returns the public URL. */
export async function uploadImage(file: File, sessionToken?: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'upload.png';

  const headers: Record<string, string> = {
    'X-Parse-Application-Id': PARSE_APP_ID,
    'X-Parse-Javascript-Key': PARSE_JAVASCRIPT_KEY,
    'Content-Type': file.type || 'application/octet-stream',
  };
  if (sessionToken) headers['X-Parse-Session-Token'] = sessionToken;

  const response = await fetch(`${PARSE_SERVER_URL}/files/${safeName}`, {
    method: 'POST',
    headers,
    body: file,
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error || 'Upload failed.');
  }

  const { url } = await response.json();
  if (!url) throw new Error('Upload did not return a URL.');
  return url as string;
}
