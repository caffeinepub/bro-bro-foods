/**
 * AdSense Snippet Parser
 * 
 * Utility to extract AdSense client ID from pasted script snippets.
 * Handles full <script> tags, raw URLs, and various formats.
 */

export interface SnippetExtractionResult {
  valid: boolean;
  clientId: string;
  error?: string;
}

/**
 * Extract AdSense client ID from a pasted snippet
 * 
 * Supports:
 * - Full <script> tags: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
 * - Raw URLs: https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456
 * - Just the client ID: ca-pub-1234567890123456
 */
export function extractAdSenseClientId(snippet: string): SnippetExtractionResult {
  if (!snippet || !snippet.trim()) {
    return {
      valid: false,
      clientId: '',
      error: 'Please paste your AdSense script snippet',
    };
  }

  const trimmed = snippet.trim();

  // Pattern to match ca-pub-XXXXXXXXXXXXXXXX
  const clientIdPattern = /ca-pub-\d{16}/;
  const match = trimmed.match(clientIdPattern);

  if (!match) {
    return {
      valid: false,
      clientId: '',
      error: 'Could not find a valid AdSense client ID (ca-pub-XXXXXXXXXXXXXXXX) in the snippet',
    };
  }

  const clientId = match[0];

  // Validate that it's a proper ca-pub ID
  if (!clientId.startsWith('ca-pub-') || clientId.length !== 23) {
    return {
      valid: false,
      clientId: '',
      error: 'Invalid AdSense client ID format',
    };
  }

  return {
    valid: true,
    clientId,
  };
}
