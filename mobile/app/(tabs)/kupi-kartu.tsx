import { API_URL } from "@/constants/api";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TIPOVI = [
  { label: "Standard", value: "standard", multiplier: 1 },
  { label: "Business", value: "business", multiplier: 1.5 },
  { label: "First", value: "first", multiplier: 2 },
];

export default function BuyTicketsScreen() {
  const [polaziste, setPolaziste] = useState("");
  const [odrediste, setOdrediste] = useState("");
  const [loading, setLoading] = useState(false);
  const [putovanja, setPutovanja] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPutovanje, setSelectedPutovanje] = useState<any>(null);
  const [selectedTip, setSelectedTip] = useState("standard");
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchSvaPutovanja();
  }, []);

  const fetchSvaPutovanja = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/putovanja`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await response.json();
      setPutovanja(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pretraziPutovanja = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const params = new URLSearchParams({ polaziste, odrediste });
      const response = await fetch(
        `${API_URL}/api/putovanja/pretraga?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      const data = await response.json();
      setPutovanja(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const rezervisi = (item: any) => {
    if (role === "GOST") {
      router.push("/login");
      return;
    }
    setSelectedPutovanje(item);
    setSelectedTip("standard");
    setModalVisible(true);
  };

  const izracunajCenu = () => {
    if (!selectedPutovanje) return 0;
    const tip = TIPOVI.find((t) => t.value === selectedTip);
    return selectedPutovanje.osnovnaCena * (tip?.multiplier ?? 1);
  };

  const dodajUKorpu = async () => {
    const token = await AsyncStorage.getItem("token");
    const payload = JSON.parse(atob(token!.split(".")[1]));
    const username = payload.sub;
    const kljuc = `korpa_${username}`;

    const stavka = {
      putovanjeId: selectedPutovanje.id,
      polaziste: selectedPutovanje.polaziste,
      odrediste: selectedPutovanje.odrediste,
      tip: selectedTip,
      osnovnaCena: izracunajCenu(),
    };

    const existing = await AsyncStorage.getItem(kljuc);
    const korpa = existing ? JSON.parse(existing) : [];
    korpa.push(stavka);
    await AsyncStorage.setItem(kljuc, JSON.stringify(korpa));
    setModalVisible(false);
    alert("Dodato u korpu!");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#03757f" }}
      edges={["top"]}
    >
      <View style={styles.container1}>
        <Text style={styles.title}>
          Rezervišite svoje putovanje brzo i lako
        </Text>
      </View>
      <View style={styles.ticketSearch}>
        <Text style={styles.labels}>Polazište</Text>
        <TextInput
          style={styles.input}
          placeholder="Beograd"
          placeholderTextColor="#b0b5b5"
          value={polaziste}
          onChangeText={setPolaziste}
        />
        <Text style={styles.labels}>Odredište</Text>
        <TextInput
          style={styles.input}
          placeholder="Novi Sad"
          placeholderTextColor="#b0b5b5"
          value={odrediste}
          onChangeText={setOdrediste}
        />
        <TouchableOpacity style={styles.button} onPress={pretraziPutovanja}>
          <Text style={styles.buttonText}>
            {loading ? "Pretražujem..." : "Pretraži putovanja"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tickets}>
        <FlatList
          data={putovanja}
          keyExtractor={(item) => item.id.toString()}
          style={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.kartica}>
              <View style={styles.karticaHeader}>
                <Text style={styles.ruta}>
                  {item.polaziste} → {item.odrediste}
                </Text>
                <Text style={styles.cena}>{item.osnovnaCena} RSD</Text>
              </View>
              <View style={styles.karticaBody}>
                <Text style={styles.vreme}>
                  🕐 Polazak:{" "}
                  {new Date(item.vremePolaska).toLocaleString("sr-RS")}
                </Text>
                <Text style={styles.vreme}>
                  🕐 Dolazak:{" "}
                  {new Date(item.vremeDolaska).toLocaleString("sr-RS")}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.rezervisiBtn}
                onPress={() => rezervisi(item)}
              >
                <Text style={styles.rezervisiBtnText}>Rezerviši</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Modal za izbor tipa karte */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Izaberi tip karte</Text>
            <Text style={styles.modalRuta}>
              {selectedPutovanje?.polaziste} → {selectedPutovanje?.odrediste}
            </Text>

            {TIPOVI.map((tip) => (
              <TouchableOpacity
                key={tip.value}
                style={styles.radioRow}
                onPress={() => setSelectedTip(tip.value)}
              >
                <View style={styles.radioOuter}>
                  {selectedTip === tip.value && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>
                  {tip.label} —{" "}
                  {selectedPutovanje
                    ? (selectedPutovanje.osnovnaCena * tip.multiplier).toFixed(
                        0,
                      )
                    : 0}{" "}
                  RSD
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.ukupno}>
              Ukupno: {izracunajCenu().toFixed(0)} RSD
            </Text>

            <TouchableOpacity style={styles.button} onPress={dodajUKorpu}>
              <Text style={styles.buttonText}>Dodaj u korpu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.otkazi}>Otkaži</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container1: {
    backgroundColor: "#03757f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 20,
  },
  ticketSearch: {
    backgroundColor: "#f0f2f1",
    padding: 24,
    borderRadius: 40,
    width: width * 0.9,
    alignSelf: "center",
    marginTop: -50,
    zIndex: 10,
  },
  input: {
    borderRadius: 20,
    padding: 12,
    backgroundColor: "#ffffff",
    color: "#333",
    marginBottom: 16,
  },
  labels: {
    color: "#03757f",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#03757f",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 2,
  },
  lista: { flex: 1 },
  kartica: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  karticaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ruta: { fontSize: 16, fontWeight: "bold", color: "#03757f" },
  cena: { fontSize: 18, fontWeight: "bold", color: "#03757f" },
  karticaBody: { rowGap: 4, marginBottom: 12 },
  vreme: { fontSize: 13, color: "#666" },
  rezervisiBtn: {
    backgroundColor: "#03757f",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  rezervisiBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  tickets: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: 46,
    backgroundColor: "#f0f2f1",
    paddingTop: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    rowGap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#03757f",
  },
  modalRuta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    rowGap: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#03757f",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#03757f",
  },
  radioLabel: { fontSize: 15, color: "#333" },
  ukupno: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#03757f",
    marginTop: 8,
  },
  otkazi: {
    textAlign: "center",
    color: "#999",
    marginTop: 8,
    fontSize: 14,
  },
});
