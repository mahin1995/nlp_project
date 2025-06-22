"use client";
import { AuthService, IUser } from "@/service/auth-service";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
interface AuthContextType {
  user: string | null;
  login: (body: IUser) => Promise<boolean>;
  logout: () => void;
  register: (body: IUser) => Promise<boolean>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_web");
    if (storedUser) {
      setUser(storedUser); // Initialize user state from local storage
    }
  }, []);

  // Login function
  const login = async (body: IUser) => {
    const result = await AuthService.login(body);
    if (result.success) {
      if (result.token) {
        localStorage.setItem("jwt_token_web", result.token); // Store token in local storage
        localStorage.setItem("user_web", body.username); // Store username in local storage
        setUser(body.username); // Set user state
      }
      return true;
    } else return false;
  };
  const register = async (body: IUser) => {
    // setUser(username);
    const result = await AuthService.register(body);
    if (result.success) {
      console.error("Registration Success");
      if (result.token) {
        localStorage.setItem("jwt_token_web", result.token); // Store token in local storage
        localStorage.setItem("user_web", body.username); // Store username in local storage
        setUser(body.username); // Set user state
      }
      return true;
    } else return false;
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem("jwt_token_web"); // Store token in local storage
    localStorage.removeItem("user_web"); // Store username in local storage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
