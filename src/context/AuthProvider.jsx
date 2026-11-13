import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { tokenStorage } from '../api/client';
import * as authApi from '../api/auth.api';

/**
 * Sesión global de la aplicación.
 * Al cargar la página, si hay un token guardado se valida con /auth/me;
 * si ya expiró o la cuenta fue deshabilitada, se limpia la sesión.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(tokenStorage.get()));

  useEffect(() => {
    if (!tokenStorage.get()) return;
    authApi
      .getMe()
      .then(({ data }) => setUser(data))
      .catch(() => tokenStorage.clear())
      .finally(() => setIsLoading(false));
  }, []);

  const startSession = useCallback(({ token, user: sessionUser }) => {
    tokenStorage.set(token);
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { data } = await authApi.login(credentials);
      return startSession(data);
    },
    [startSession]
  );

  const register = useCallback(
    async (formData) => {
      const { data } = await authApi.register(formData);
      return startSession(data);
    },
    [startSession]
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
