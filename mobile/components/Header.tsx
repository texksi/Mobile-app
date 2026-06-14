import { authEmitter } from "@/hooks/authEvents";
import { useAuth } from "@/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TABS = [
  { label: "Home", route: "/" },
  { label: "Kompanije", route: "/kompanije" },
  { label: "Moje Rezervacije", route: "/moje-rezervacije" },
  { label: "Rezerviši Putovanje", route: "/rezervisi-putovanje" },
  { label: "Kupi Kartu", route: "/kupi-kartu" },
];

type Props = {
  activeTab: string;
};

export default function Header({ activeTab }: Props) {
  const router = useRouter();
  const { role } = useAuth();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    getUsername();
  }, [role]);

  const getUsername = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.sub);
    } catch {
      setUsername(null);
    }
  };

  const odjavi = async () => {
    await AsyncStorage.removeItem("token");
    authEmitter.emit("authChanged");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <MaterialCommunityIcons name="bus" size={26} color="#fff" />
          <Text style={styles.logo}>BusTicket</Text>
        </View>
        {role === "GOST" ? (
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.btnOutlineText}>Prijava</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFilled}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.btnFilledText}>Registracija</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.authButtons}>
            <MaterialCommunityIcons name="account" size={20} color="#fff" />
            <Text style={styles.username}>{username}</Text>
            <TouchableOpacity style={styles.btnOutline} onPress={odjavi}>
              <Text style={styles.btnOutlineText}>Odjava</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#03757f",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  authButtons: {
    flexDirection: "row",
    gap: 8,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnOutlineText: {
    color: "#fff",
    fontSize: 13,
  },
  btnFilled: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnFilledText: {
    color: "#03757f",
    fontSize: 13,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  tab: {
    color: "#ffffffaa",
    fontSize: 13,
    paddingBottom: 4,
  },
  activeTab: {
    color: "#fff",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  username: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },
});
