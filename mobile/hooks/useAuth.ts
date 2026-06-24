import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { authEmitter } from "./authEvents";

export type Role = "ADMIN" | "KORISNIK" | "GOST";

export function useAuth() {
  const [role, setRole] = useState<Role>("GOST");
  const [loadingRole, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setRole("GOST");
        return;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    } catch {
      setRole("GOST");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    authEmitter.on("authChanged", checkAuth);
    return () => {
      authEmitter.off("authChanged", checkAuth);
    };
  }, []);

  return { role, loadingRole };
}
