import Header from "@/components/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const mockKompanije = [
  { id: 1, naziv: "BusExpress", opis: "Brzi i udobni autobusi" },
  { id: 2, naziv: "TravelPlus", opis: "Povoljne cene, vrhunska usluga" },
  { id: 3, naziv: "EuroRide", opis: "Međunarodne linije" },
  { id: 4, naziv: "CityLine", opis: "Gradski i prigradski prevoz" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [polaziste, setPolaziste] = useState("");
  const [odrediste, setOdrediste] = useState("");

  return (
    <ScrollView style={styles.container}>
      <Header activeTab="/" />

      {/* Hero sekcija */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Putuj jednostavno,{"\n"}rezerviši brzo
        </Text>
        <Text style={styles.heroSubtitle}>
          Pronađi najbolje linije i rezerviši karte u par klikova
        </Text>
      </View>

      {/* Pretraga */}
      <View style={styles.searchBox}>
        <Text style={styles.sectionTitle}>Pretraži putovanja</Text>
        <TextInput
          style={styles.input}
          placeholder="Polazište"
          placeholderTextColor="#999"
          value={polaziste}
          onChangeText={setPolaziste}
        />
        <TextInput
          style={styles.input}
          placeholder="Odredište"
          placeholderTextColor="#999"
          value={odrediste}
          onChangeText={setOdrediste}
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => router.push("/")}
        >
          <Text style={styles.searchBtnText}>Pretraži</Text>
        </TouchableOpacity>
      </View>

      {/* Kompanije */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kompanije</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockKompanije.map((k) => (
            <TouchableOpacity
              key={k.id}
              style={styles.card}
              onPress={() => router.push("/")}
            >
              <MaterialCommunityIcons
                name="bus"
                size={24}
                color="#03757f"
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.cardTitle}>{k.naziv}</Text>
              <Text style={styles.cardOpis}>{k.opis}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Zasto mi */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zašto mi?</Text>
        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <MaterialCommunityIcons
              name="bus-clock"
              size={32}
              color="#03757f"
            />
            <Text style={styles.featureText}>Brza rezervacija</Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={32}
              color="#03757f"
            />
            <Text style={styles.featureText}>Sigurno plaćanje</Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={32}
              color="#03757f"
            />
            <Text style={styles.featureText}>Praćenje putovanja</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f1",
  },
  hero: {
    backgroundColor: "#03757f",
    padding: 24,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#ffffffcc",
    textAlign: "center",
  },
  searchBox: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    marginTop: -20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  searchBtn: {
    backgroundColor: "#03757f",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  searchBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 1,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#03757f",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#c8eaea",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 180,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#03757f",
    marginBottom: 4,
    textAlign: "center",
  },
  cardOpis: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feature: {
    backgroundColor: "#c8eaea",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "30%",
    elevation: 2,
  },
  featureText: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    marginTop: 8,
  },
});
