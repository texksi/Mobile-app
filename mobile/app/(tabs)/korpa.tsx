import { API_URL } from "@/constants/api";
import { authEmitter } from "@/hooks/authEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NACINI_PLACANJA = ["KARTICA", "GOTOVINA", "ONLINE"];

export default function KorpaScreen() {
  const [korpa, setKorpa] = useState<any[]>([]);
  const [nacinPlacanja, setNacinPlacanja] = useState("KARTICA");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      ucitajKorpu();
    }, []),
  );

  const getKljuc = async () => {
    const token = await AsyncStorage.getItem("token");
    const payload = JSON.parse(atob(token!.split(".")[1]));
    return `korpa_${payload.sub}`;
  };

  const ucitajKorpu = async () => {
    const kljuc = await getKljuc();
    const data = await AsyncStorage.getItem(kljuc);
    setKorpa(data ? JSON.parse(data) : []);
  };

  const ukloniStavku = async (index: number) => {
    const kljuc = await getKljuc();
    const novaKorpa = korpa.filter((_, i) => i !== index);
    setKorpa(novaKorpa);
    await AsyncStorage.setItem(kljuc, JSON.stringify(novaKorpa));
  };

  const ukupanIznos = korpa.reduce((sum, s) => sum + s.osnovnaCena, 0);

  const generisiBrojSedista = () => {
    const red = Math.floor(Math.random() * 10) + 1;
    const kolona = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
    return `${red}${kolona}`;
  };

  const kupi = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const payload = JSON.parse(atob(token!.split(".")[1]));
      const username = payload.sub;
      const kljuc = `korpa_${username}`;

      const korisnikResponse = await fetch(
        `${API_URL}/api/korisnici/username?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      const korisnik = await korisnikResponse.json();
      const korisnikId = korisnik.id;

      if (!korisnikId) {
        Alert.alert("Greška", "Nije moguće prepoznati korisnika.");
        setLoading(false);
        return;
      }

      const rezResponse = await fetch(`${API_URL}/api/rezervacije`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          nacinPlacanja,
          status: "KREIRANA",
          ukupanIznos: ukupanIznos,
          korisnikId,
        }),
      });

      if (!rezResponse.ok) throw new Error("Greška pri kreiranju rezervacije");
      const rezervacija = await rezResponse.json();

      for (const stavka of korpa) {
        await fetch(`${API_URL}/api/karte`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            brojSedista: generisiBrojSedista(),
            osnovnaCena: stavka.osnovnaCena,
            tip: stavka.tip,
            rezervacijaId: rezervacija.id,
            putovanjeId: stavka.putovanjeId,
          }),
        });
      }

      await AsyncStorage.removeItem(kljuc);
      authEmitter.emit("authChanged");
      Alert.alert("Uspešno!", "Kupovina je završena!", [
        { text: "OK", onPress: () => router.replace("/moje-rezervacije") },
      ]);
    } catch (e) {
      Alert.alert("Greška", "Došlo je do greške pri kupovini.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#03757f" }}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Korpa</Text>
      </View>

      <View style={styles.container}>
        {korpa.length === 0 ? (
          <Text style={styles.prazna}>Korpa je prazna</Text>
        ) : (
          <>
            <FlatList
              data={korpa}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.stavka}>
                  <View style={styles.stavkaInfo}>
                    <Text style={styles.ruta}>
                      {item.polaziste} → {item.odrediste}
                    </Text>
                    <Text style={styles.tip}>Tip: {item.tip}</Text>
                    <Text style={styles.cena}>{item.osnovnaCena} RSD</Text>
                  </View>
                  <TouchableOpacity onPress={() => ukloniStavku(index)}>
                    <Text style={styles.ukloni}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <Text style={styles.ukupno}>Ukupno: {ukupanIznos} RSD</Text>

            <Text style={styles.nacinLabel}>Način plaćanja:</Text>
            <View style={styles.radioGroup}>
              {NACINI_PLACANJA.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={styles.radioRow}
                  onPress={() => setNacinPlacanja(n)}
                >
                  <View style={styles.radioOuter}>
                    {nacinPlacanja === n && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel2}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.kupiBtn}
              onPress={kupi}
              disabled={loading}
            >
              <Text style={styles.kupiBtnText}>
                {loading ? "Kupujem..." : "Kupi"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#03757f",
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f2f1",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  prazna: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#999",
  },
  stavka: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stavkaInfo: {
    rowGap: 4,
  },
  ruta: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#03757f",
  },
  tip: {
    fontSize: 13,
    color: "#666",
  },
  cena: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  ukloni: {
    fontSize: 20,
    color: "#999",
    padding: 4,
  },
  ukupno: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#03757f",
    textAlign: "right",
    marginBottom: 16,
    marginTop: 8,
  },
  nacinLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  radioGroup: {
    rowGap: 10,
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
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
  radioLabel2: {
    fontSize: 15,
    color: "#333",
  },
  kupiBtn: {
    backgroundColor: "#03757f",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  kupiBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
