import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MojeRezervacije() {
  const [rezervacije, setRezervacije] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [otvorene, setOtvorene] = useState<Set<number>>(new Set());
  const [karte, setKarte] = useState<{ [key: number]: any[] }>({});

  useEffect(() => {
    fetchKorisnikaIRezervacije();
  }, []);

  const fetchKorisnikaIRezervacije = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const payload = JSON.parse(atob(token!.split(".")[1]));
      const username = payload.sub;

      const korisnikRes = await fetch(
        `${API_URL}/api/korisnici/username?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      const korisnik = await korisnikRes.json();

      const rezervRes = await fetch(
        `${API_URL}/api/korisnici/${korisnik.id}/rezervacije`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      const data = await rezervRes.json();
      setRezervacije(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBoja = (status: string) => {
    if (status === "PLACENA") return "#2e7d32";
    if (status === "OTKAZANA") return "#c62828";
    return "#f9a825";
  };

  const fetchKarte = async (id: number) => {
    if (karte[id]) return;
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/rezervacije/${id}/karte`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await res.json();
    setKarte((prev) => ({ ...prev, [id]: data }));
  };

  const toggleKarte = (id: number) => {
    const novo = new Set(otvorene);
    if (novo.has(id)) {
      novo.delete(id);
    } else {
      novo.add(id);
      fetchKarte(id);
    }
    setOtvorene(novo);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#03757f" }}
      edges={["top"]}
    >
      <View style={styles.container1}>
        <Text style={styles.title}>Moje rezervacije</Text>
      </View>
      <View style={styles.listaContainer}>
        {rezervacije.length === 0 ? (
          <Text style={styles.prazno}>Nemate rezervacija</Text>
        ) : (
          <FlatList
            data={rezervacije}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.kartica}>
                <View style={styles.karticaHeader}>
                  <Text style={styles.rezervacijaNaslov}>
                    Rezervacija #{item.id}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: getStatusBoja(item.status) },
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.status}</Text>
                  </View>
                </View>
                <View style={styles.karticaBody}>
                  <Text style={styles.info}>
                    Nacin placanja: {item.nacinPlacanja}
                  </Text>
                  <Text style={styles.info}>
                    Ukupna cena: {item.ukupanIznos} RSD
                  </Text>
                  <Text style={styles.info}>
                    Datum rezervacije:{" "}
                    {new Date(item.datumKreiranja).toLocaleDateString("sr-RS")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleKarte(item.id)}
                    style={styles.button}
                  >
                    <Text style={styles.btnText}>
                      {otvorene.has(item.id) ? "Sakrij karte" : "Prikaži karte"}
                    </Text>
                  </TouchableOpacity>

                  {otvorene.has(item.id) && karte[item.id] && (
                    <View style={styles.karteContainer}>
                      {karte[item.id].map((karta) => (
                        <View key={karta.id} style={styles.kartaRow}>
                          <Text style={styles.kartaInfo}>
                            {karta.brojSedista} {karta.tip}
                          </Text>
                          <Text style={styles.kartaInfo}>
                            Cena: {karta.osnovnaCena} RSD
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 0.25,
    backgroundColor: "#03757f",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  listaContainer: {
    flex: 1,
    backgroundColor: "#f0f2f1",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 8,
  },
  prazno: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
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
  rezervacijaNaslov: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#03757f",
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  karticaBody: {
    rowGap: 6,
  },
  info: {
    fontSize: 13,
    color: "#666",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#03757f",
    borderRadius: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  karteContainer: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    paddingTop: 10,
    rowGap: 12,
  },
  kartaRow: {
    backgroundColor: "#f0f2f1",
    borderRadius: 12,
    padding: 10,
    rowGap: 4,
  },
  kartaInfo: {
    fontSize: 13,
    color: "#444",
  },
});
