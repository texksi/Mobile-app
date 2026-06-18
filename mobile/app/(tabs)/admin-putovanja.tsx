import { API_URL } from "@/constants/api";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Kompanija = {
  id: number;
  naziv: string;
  kontakt?: string;
};

type Putovanje = {
  id: number;
  polaziste: string;
  odrediste: string;
  vremePolaska: string;
  vremeDolaska: string;
  osnovnaCena: number;
  kompanijaId: number;
};

type DatePickerTarget = "polazak" | "dolazak" | null;

const webDateInputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 20,
  borderWidth: 0,
  backgroundColor: "#f0f2f1",
  fontSize: 15,
  outline: "none",
};

export default function AdminPutovanja() {
  const [putovanja, setPutovanja] = useState<Putovanje[]>([]);
  const [kompanije, setKompanije] = useState<Kompanija[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPutovanje, setSelectedPutovanje] = useState<Putovanje | null>(
    null,
  );

  const [polaziste, setPolaziste] = useState("");
  const [odrediste, setOdrediste] = useState("");
  const [osnovnaCena, setOsnovnaCena] = useState("");
  const [vremePolaska, setVremePolaska] = useState(new Date());
  const [vremeDolaska, setVremeDolaska] = useState(new Date());
  const [kompanijaId, setKompanijaId] = useState<number | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [datePickerTarget, setDatePickerTarget] =
    useState<DatePickerTarget>(null);

  const { role, loadingRole } = useAuth();

  useEffect(() => {
    if (!loadingRole && role === "ADMIN") {
      fetchPodaci();
    }
  }, [loadingRole, role]);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  const fetchPodaci = async () => {
    setLoading(true);

    try {
      const token = await getToken();

      const [putovanjaResponse, kompanijeResponse] = await Promise.all([
        fetch(`${API_URL}/api/putovanja`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }),
        fetch(`${API_URL}/api/kompanije`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }),
      ]);

      if (!putovanjaResponse.ok) {
        throw new Error("Greška pri učitavanju putovanja.");
      }

      if (!kompanijeResponse.ok) {
        throw new Error("Greška pri učitavanju kompanija.");
      }

      const putovanjaData = await putovanjaResponse.json();
      const kompanijeData = await kompanijeResponse.json();

      setPutovanja(putovanjaData);
      setKompanije(kompanijeData);
    } catch (error) {
      console.error(error);
      Alert.alert("Greška", "Nije moguće učitati podatke.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingRole) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator color="#03757f" size="large" />
      </SafeAreaView>
    );
  }

  if (role !== "ADMIN") {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <Text style={styles.noAccess}>Nemate pristup</Text>
      </SafeAreaView>
    );
  }

  const resetForma = () => {
    const sada = new Date();
    const dolazak = new Date();
    dolazak.setMinutes(dolazak.getMinutes() + 90);

    setPolaziste("");
    setOdrediste("");
    setOsnovnaCena("");
    setVremePolaska(sada);
    setVremeDolaska(dolazak);
    setKompanijaId(kompanije[0]?.id ?? null);
    setSelectedPutovanje(null);
    setDropdownOpen(false);
    setDatePickerTarget(null);
  };

  const openModal = (putovanje?: Putovanje) => {
    if (putovanje) {
      setSelectedPutovanje(putovanje);
      setPolaziste(putovanje.polaziste);
      setOdrediste(putovanje.odrediste);
      setOsnovnaCena(String(putovanje.osnovnaCena));
      setVremePolaska(new Date(putovanje.vremePolaska));
      setVremeDolaska(new Date(putovanje.vremeDolaska));
      setKompanijaId(putovanje.kompanijaId);
    } else {
      resetForma();
    }

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForma();
  };

  const getKompanijaNaziv = (id?: number) => {
    return kompanije.find((kompanija) => kompanija.id === id)?.naziv ?? "-";
  };

  const formatDatum = (value: string | Date) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatDateTimeForBackend = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  };

  const parseErrorMessage = async (response: Response) => {
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return data.message || data.error || text;
    } catch {
      return text || "Došlo je do greške.";
    }
  };

  const validiraj = () => {
    if (!polaziste.trim()) {
      Alert.alert("Greška", "Unesite polazište.");
      return false;
    }

    if (!odrediste.trim()) {
      Alert.alert("Greška", "Unesite odredište.");
      return false;
    }

    if (!osnovnaCena || Number(osnovnaCena) <= 0) {
      Alert.alert("Greška", "Unesite ispravnu osnovnu cenu.");
      return false;
    }

    if (!kompanijaId) {
      Alert.alert("Greška", "Izaberite kompaniju.");
      return false;
    }

    if (vremeDolaska <= vremePolaska) {
      Alert.alert("Greška", "Vreme dolaska mora biti posle vremena polaska.");
      return false;
    }

    return true;
  };

  const sacuvaj = async () => {
    if (!validiraj()) return;

    setSaving(true);

    try {
      const token = await getToken();

      const url = selectedPutovanje
        ? `${API_URL}/api/putovanja/${selectedPutovanje.id}`
        : `${API_URL}/api/putovanja`;

      const method = selectedPutovanje ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          polaziste: polaziste.trim(),
          odrediste: odrediste.trim(),
          vremePolaska: formatDateTimeForBackend(vremePolaska),
          vremeDolaska: formatDateTimeForBackend(vremeDolaska),
          osnovnaCena: Number(osnovnaCena),
          kompanijaId,
        }),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message);
      }

      closeModal();
      await fetchPodaci();

      Alert.alert(
        "Uspešno",
        selectedPutovanje
          ? "Putovanje je uspešno izmenjeno."
          : "Putovanje je uspešno kreirano.",
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert("Greška", error.message || "Nije moguće sačuvati putovanje.");
    } finally {
      setSaving(false);
    }
  };

  const obrisiPutovanje = async (id: number) => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/putovanja/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message);
      }

      await fetchPodaci();
      Alert.alert("Uspešno", "Putovanje je obrisano.");
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Greška",
        error.message || "Ne možete obrisati putovanje koje ima aktivne karte.",
      );
    }
  };

  const potvrdiBrisanje = (id: number) => {
    Alert.alert("Brisanje putovanja", "Da li ste sigurni?", [
      {
        text: "Otkaži",
        style: "cancel",
      },
      {
        text: "Obriši",
        style: "destructive",
        onPress: () => obrisiPutovanje(id),
      },
    ]);
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS !== "ios") {
      setDatePickerTarget(null);
    }

    if (!selectedDate || !datePickerTarget) return;

    if (datePickerTarget === "polazak") {
      setVremePolaska(selectedDate);
    }

    if (datePickerTarget === "dolazak") {
      setVremeDolaska(selectedDate);
    }
  };

  const renderWebDateInput = (value: Date, onChange: (date: Date) => void) => {
    return React.createElement("input" as any, {
      type: "datetime-local",
      value: formatDateTimeLocal(value),
      onChange: (event: any) => onChange(new Date(event.target.value)),
      style: webDateInputStyle,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upravljanje putovanjima</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => openModal()}
        >
          <Text style={styles.createButtonText}>+ Kreiraj novo putovanje</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color="#03757f" size="large" />
        ) : (
          <FlatList
            data={putovanja}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nema putovanja.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.route}>
                  {item.polaziste} → {item.odrediste}
                </Text>

                <View style={styles.cardBody}>
                  <Text style={styles.cardText}>
                    Polazak: {formatDatum(item.vremePolaska)}
                  </Text>
                  <Text style={styles.cardText}>
                    Dolazak: {formatDatum(item.vremeDolaska)}
                  </Text>
                  <Text style={styles.price}>Cena: {item.osnovnaCena} RSD</Text>
                  <Text style={styles.cardText}>
                    Kompanija: {getKompanijaNaziv(item.kompanijaId)}
                  </Text>
                </View>

                <View style={styles.cardButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openModal(item)}
                  >
                    <Text style={styles.buttonText}>Izmeni</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => potvrdiBrisanje(item.id)}
                  >
                    <Text style={styles.buttonText}>Obriši</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedPutovanje ? "Izmeni putovanje" : "Novo putovanje"}
            </Text>

            <Text style={styles.label}>Polazište</Text>
            <TextInput
              style={styles.input}
              placeholder="Polazište"
              value={polaziste}
              onChangeText={setPolaziste}
            />
            <Text style={styles.label}>Odredište</Text>
            <TextInput
              style={styles.input}
              placeholder="Odredište"
              value={odrediste}
              onChangeText={setOdrediste}
            />

            <Text style={styles.label}>Osnovna cena</Text>
            <TextInput
              style={styles.input}
              placeholder="Osnovna cena"
              value={osnovnaCena}
              onChangeText={setOsnovnaCena}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Vreme polaska</Text>
            {Platform.OS === "web" ? (
              <View>{renderWebDateInput(vremePolaska, setVremePolaska)}</View>
            ) : (
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setDatePickerTarget("polazak")}
              >
                <Text style={styles.dateButtonText}>
                  {formatDatum(vremePolaska)}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.label}>Vreme dolaska</Text>
            {Platform.OS === "web" ? (
              <View>{renderWebDateInput(vremeDolaska, setVremeDolaska)}</View>
            ) : (
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setDatePickerTarget("dolazak")}
              >
                <Text style={styles.dateButtonText}>
                  {formatDatum(vremeDolaska)}
                </Text>
              </TouchableOpacity>
            )}

            {datePickerTarget && Platform.OS !== "web" && (
              <DateTimePicker
                value={
                  datePickerTarget === "polazak" ? vremePolaska : vremeDolaska
                }
                mode="datetime"
                display="default"
                onChange={onDateChange}
              />
            )}

            <Text style={styles.label}>Kompanija</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text style={styles.dropdownButtonText}>
                {kompanijaId
                  ? getKompanijaNaziv(kompanijaId)
                  : "Izaberite kompaniju"}
              </Text>
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.dropdownList}>
                {kompanije.map((kompanija) => (
                  <TouchableOpacity
                    key={kompanija.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setKompanijaId(kompanija.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>
                      {kompanija.naziv}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={sacuvaj}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? "Čuvam..." : "Sačuvaj"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.cancelText}>Otkaži</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#03757f",
  },
  center: {
    flex: 1,
    backgroundColor: "#f0f2f1",
    justifyContent: "center",
    alignItems: "center",
  },
  noAccess: {
    color: "#03757f",
    fontSize: 22,
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "#03757f",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f2f1",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
  },
  createButton: {
    backgroundColor: "#03757f",
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  route: {
    color: "#03757f",
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  cardBody: {
    rowGap: 6,
    marginBottom: 16,
  },
  cardText: {
    color: "#333",
    fontSize: 15,
  },
  price: {
    color: "#03757f",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 10,
  },
  editButton: {
    backgroundColor: "#03757f",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteButton: {
    backgroundColor: "#9b1c1c",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    rowGap: 10,
    maxHeight: "92%",
  },
  modalTitle: {
    color: "#03757f",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f0f2f1",
    borderRadius: 20,
    padding: 12,
    fontSize: 15,
  },
  label: {
    color: "#03757f",
    fontWeight: "bold",
    marginTop: 4,
  },
  dateButton: {
    backgroundColor: "#f0f2f1",
    borderRadius: 20,
    padding: 12,
  },
  dateButtonText: {
    color: "#333",
    fontSize: 15,
  },
  dropdownButton: {
    backgroundColor: "#f0f2f1",
    borderRadius: 20,
    padding: 12,
  },
  dropdownButtonText: {
    color: "#333",
    fontSize: 15,
  },
  dropdownList: {
    backgroundColor: "#f0f2f1",
    borderRadius: 20,
    paddingVertical: 6,
    maxHeight: 140,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dropdownItemText: {
    color: "#333",
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#03757f",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelText: {
    color: "#888",
    textAlign: "center",
    fontSize: 15,
    marginTop: 6,
  },
});
