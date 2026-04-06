import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearStoredToken,
  clearStoredUser,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/lib/storage";
import {
  LoginPayload,
  RegisterPayload,
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from "@/features/auth/api/authApi";
import { AppUser } from "@/types/api";

interface AuthContextValue {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapUser(user: Pick<AppUser, "id" | "email" | "displayName">): AppUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AppUser | null>(() => getStoredUser());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const persistSession = (sessionToken: string, sessionUser: AppUser) => {
    setToken(sessionToken);
    setUser(sessionUser);
    setStoredToken(sessionToken);
    setStoredUser(sessionUser);
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    clearStoredToken();
    clearStoredUser();
  };

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const storedToken = getStoredToken();

      if (!storedToken) {
        if (isMounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser(storedToken);
        if (!isMounted) {
          return;
        }

        persistSession(storedToken, currentUser);
      } catch {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshCurrentUser = async () => {
    if (!token) {
      clearSession();
      return;
    }

    const currentUser = await getCurrentUser(token);
    persistSession(token, currentUser);
  };

  const handleAuthSuccess = async (
    action: Promise<{
      token: string;
      userId: number;
      email: string;
      displayName: string;
    }>,
  ) => {
    const response = await action;
    persistSession(
      response.token,
      mapUser({
        id: response.userId,
        email: response.email,
        displayName: response.displayName,
      }),
    );
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login: async (payload) => {
        await handleAuthSuccess(loginRequest(payload));
      },
      register: async (payload) => {
        await handleAuthSuccess(registerRequest(payload));
      },
      logout: () => {
        clearSession();
      },
      refreshCurrentUser,
    }),
    [isBootstrapping, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
