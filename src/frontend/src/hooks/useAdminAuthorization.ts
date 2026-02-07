import { useState, useEffect } from 'react';
import { isAdminAuthorized, hasAdminToken } from '@/lib/adminAccess';

/**
 * Reactive hook that subscribes to URL hash changes and derives admin authorization state
 * Components using this hook will re-render when the hash changes
 */
export function useAdminAuthorization() {
  const [isAuthorized, setIsAuthorized] = useState(isAdminAuthorized());
  const [hasToken, setHasToken] = useState(hasAdminToken());

  useEffect(() => {
    const checkAuthorization = () => {
      const authorized = isAdminAuthorized();
      const token = hasAdminToken();
      setIsAuthorized(authorized);
      setHasToken(token);
    };

    // Check on mount
    checkAuthorization();

    // Listen for hash changes
    window.addEventListener('hashchange', checkAuthorization);

    // Also listen for popstate (back/forward navigation)
    window.addEventListener('popstate', checkAuthorization);

    return () => {
      window.removeEventListener('hashchange', checkAuthorization);
      window.removeEventListener('popstate', checkAuthorization);
    };
  }, []);

  return {
    isAuthorized,
    hasToken,
  };
}
