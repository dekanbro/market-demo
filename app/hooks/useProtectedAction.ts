import { usePrivy } from '@privy-io/react-auth';

export function useProtectedAction() {
  const { login, authenticated } = usePrivy();

  const handleProtectedAction = (action: () => void) => {
    if (!authenticated) {
      login();
      return;
    }
    action();
  };

  return {
    handleProtectedAction,
    isAuthenticated: authenticated,
    login,
  };
} 