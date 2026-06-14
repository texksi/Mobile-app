import { API_URL } from "@/constants/api";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KompanijeAdmin() {
  const [kompanije, setKompanije] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [naziv, setNaziv] = useState("");
  const [kontakt, setKontakt] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKompanija, setSelectedKompanija] = useState<any>(null);
  const { role, loadingRole } = useAuth();

  useEffect(() => {
    fetchSveKompanije();
  }, []);

  const fetchSveKompanije = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/kompanije`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await response.json();
      setKompanije(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingRole) return <ActivityIndicator color="#03757f" />;

  if (role !== "ADMIN")
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Nemate pristup ovoj stranici</Text>
      </View>
    );

  const openModal = (kompanija?: any) => {
    if (kompanija) {
      setSelectedKompanija(kompanija);
      setNaziv(kompanija.naziv);
      setKontakt(kompanija.kontakt);
    } else {
      setSelectedKompanija(null);
      setNaziv("");
      setKontakt("");
    }
    setModalVisible(true);
  };

  const sacuvaj = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = selectedKompanija
        ? `${API_URL}/api/kompanija/${selectedKompanija.id}`
        : `${API_URL}/api/kompanija`;
      const method = selectedKompanija ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ naziv, kontakt }),
      });

      setModalVisible(false);
      fetchSveKompanije();
    } catch (error) {
      console.error(error);
    }
  };

  const obrisi = async (id: number) => {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/kompanija/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!res.ok) {
      Alert.alert(
        "Greška",
        "Ne možete obrisati kompaniju koja ima aktivne karte",
      );
      return;
    }
    fetchSveKompanije();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#03757f" }}
      edges={["top"]}
    >
      <View style={styles.container1}>
        <Text style={styles.title}>Upravljanje kompanijama</Text>
        <Text style={styles.paragraph}>
          Kreiranje, izmena i brisanje kompanija
        </Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity style={styles.button} onPress={() => openModal()}>
          <Text style={styles.btnText}>+ Kreiraj novu kompaniju</Text>
        </TouchableOpacity>
        <FlatList
          data={kompanije}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.kartica}>
              <View style={styles.karticaHeader}>
                <Text style={styles.kompanijaNaziv}>{item.naziv}</Text>
              </View>
              <View style={styles.karticaBody}>
                <Text style={styles.karticaKontakt}>
                  Kontakt: {item.kontakt}
                </Text>
                <View style={styles.karticaButtons}>
                  <TouchableOpacity
                    style={styles.karticaButton}
                    onPress={() => openModal(item)}
                  >
                    <Text style={styles.btnTextKartica}>Izmeni podatke</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.karticaButton}
                    onPress={() => obrisi(item.id)}
                  >
                    <Text style={styles.btnTextKartica}>Obrisi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        ></FlatList>
      </View>
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedKompanija ? "Izmeni kompaniju" : "Nova kompanija"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Naziv"
              value={naziv}
              onChangeText={setNaziv}
            />
            <TextInput
              style={styles.input}
              placeholder="Kontakt"
              value={kontakt}
              onChangeText={setKontakt}
            />
            <TouchableOpacity style={styles.modalButton} onPress={sacuvaj}>
              <Text style={styles.btnText}>Sačuvaj</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.otkaziText}>Otkaži</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    backgroundColor: "#03757f",
    flex: 0.45,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  paragraph: {
    color: "#fff",
    fontSize: 20,
  },
  container2: {
    backgroundColor: "#f0f2f1",
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
  },
  button: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#03757f",
    borderRadius: 30,
    marginBottom: 40,
  },
  btnText: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "500",
  },
  kartica: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 20,
    marginBottom: 20,
  },
  karticaHeader: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  karticaBody: {
    rowGap: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  kompanijaNaziv: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#03757f",
    textAlign: "center",
  },
  karticaKontakt: {
    fontSize: 20,
    marginBottom: 10,
    color: "#03757f",
  },
  karticaButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#03757f",
    borderRadius: 30,
    marginRight: 10,
  },
  btnTextKartica: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
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
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f0f2f1",
    borderRadius: 20,
    padding: 12,
    fontSize: 15,
  },
  modalButton: {
    backgroundColor: "#03757f",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  otkaziText: {
    textAlign: "center",
    color: "#888",
    marginTop: 8,
    fontSize: 15,
  },
  karticaButtons: {
    flexDirection: "row",
  },
});
