import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <MaterialCommunityIcons name="bus" size={26} color="#fff" />
          <Text style={styles.logo}>BusTicket</Text>
        </View>
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
      </View>
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.route}
            onPress={() => router.push(tab.route as any)}
          >
            <Text
              style={[styles.tab, activeTab === tab.route && styles.activeTab]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
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
});
