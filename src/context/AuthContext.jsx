import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "HYDRATE_START":
      return { ...state, isLoading: true, error: null };
    case "HYDRATE_SUCCESS":
      return {
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "HYDRATE_EMPTY":
      return { ...initialState, isLoading: false };
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "REQUEST_DONE":
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    dispatch({ type: "HYDRATE_START" });
    const session = authService.getStoredSession();
    if (session?.user) {
      dispatch({ type: "HYDRATE_SUCCESS", payload: { user: session.user } });
    } else {
      dispatch({ type: "HYDRATE_EMPTY" });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: "AUTH_START" });
    const result = await authService.login(email, password);
    if (result.success) {
      dispatch({ type: "AUTH_SUCCESS", payload: { user: result.data.user } });
      return { success: true };
    }
    dispatch({ type: "AUTH_ERROR", payload: result.error });
    return { success: false, error: result.error };
  }, []);

  const register = useCallback(async (payload) => {
    dispatch({ type: "AUTH_START" });
    const result = await authService.register(payload);
    if (result.success) {
      dispatch({ type: "AUTH_SUCCESS", payload: { user: result.data.user } });
      return { success: true };
    }
    dispatch({ type: "AUTH_ERROR", payload: result.error });
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: "AUTH_START" });
    await authService.logout();
    dispatch({ type: "LOGOUT" });
  }, []);

  const forgotPassword = useCallback(async (email) => {
    dispatch({ type: "AUTH_START" });
    const result = await authService.forgotPassword(email);
    if (result.success) {
      dispatch({ type: "REQUEST_DONE" });
      return { success: true, message: result.data.message };
    }
    dispatch({ type: "AUTH_ERROR", payload: result.error });
    return { success: false, error: result.error };
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
