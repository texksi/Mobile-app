import { API_URL } from "@/constants/api";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Role = "ADMIN" | "KORISNIK" | "GOST";

type Korisnik = {
  id: number;
  ime: string;
  prezime: string;
  username: string;
  email: string;
  role: Role;
};

const roles: Role[] = ["ADMIN", "KORISNIK", "GOST"];

export default function AdminKorisnici() {
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKorisnik, setSelectedKorisnik] = useState<Korisnik | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState<Role>("KORISNIK");

  const { role, loadingRole } = useAuth();

  useEffect(() => {
    if (!loadingRole && role === "ADMIN") {
      fetchKorisnici();
    }
  }, [loadingRole, role]);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
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

  const fetchKorisnici = async () => {
    setLoading(true);

    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/korisnici`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message);
      }

      const data = await response.json();
      setKorisnici(data);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Greška", error.message || "Nije moguće učitati korisnike.");
    } finally {
      setLoading(false);
    }
  };

  const openRoleModal = (korisnik: Korisnik) => {
    setSelectedKorisnik(korisnik);
    setSelectedRole(korisnik.role);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedKorisnik(null);
    setSelectedRole("KORISNIK");
  };

  const sacuvajRole = async () => {
    if (!selectedKorisnik) return;

    setSaving(true);

    try {
      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/korisnici/${selectedKorisnik.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            ime: selectedKorisnik.ime,
            prezime: selectedKorisnik.prezime,
            email: selectedKorisnik.email,
            username: selectedKorisnik.username,
            role: selectedRole,
          }),
        },
      );

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message);
      }

      closeModal();
      await fetchKorisnici();

      Alert.alert("Uspešno", "Rola korisnika je uspešno izmenjena.");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Greška", error.message || "Nije moguće izmeniti rolu.");
    } finally {
      setSaving(false);
    }
  };

  const obrisiKorisnika = async (id: number) => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/korisnici/${id}`, {
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

      await fetchKorisnici();
      Alert.alert("Uspešno", "Korisnik je obrisan.");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Greška", error.message || "Nije moguće obrisati korisnika.");
    }
  };

  const potvrdiBrisanje = (id: number) => {
    if (Platform.OS === "web") {
      const confirmed =
        typeof window !== "undefined"
          ? window.confirm("Da li ste sigurni da želite da obrišete korisnika?")
          : true;

      if (confirmed) {
        obrisiKorisnika(id);
      }

      return;
    }

    Alert.alert("Brisanje korisnika", "Da li ste sigurni?", [
      {
        text: "Otkaži",
        style: "cancel",
      },
      {
        text: "Obriši",
        style: "destructive",
        onPress: () => obrisiKorisnika(id),
      },
    ]);
  };

  const getBadgeStyle = (korisnikRole: Role) => {
    if (korisnikRole === "ADMIN") return styles.badgeAdmin;
    if (korisnikRole === "KORISNIK") return styles.badgeKorisnik;
    return styles.badgeGost;
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

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upravljanje korisnicima</Text>
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator color="#03757f" size="large" />
        ) : (
          <FlatList
            data={korisnici}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nema korisnika.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>
                    {item.ime} {item.prezime}
                  </Text>

                  <View style={[styles.badge, getBadgeStyle(item.role)]}>
                    <Text style={styles.badgeText}>{item.role}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardText}>Username: {item.username}</Text>
                  <Text style={styles.cardText}>Email: {item.email}</Text>
                </View>

                <View style={styles.cardButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openRoleModal(item)}
                  >
                    <Text style={styles.buttonText}>Izmeni rolu</Text>
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
            <Text style={styles.modalTitle}>Izmena role</Text>

            {selectedKorisnik && (
              <Text style={styles.selectedUserText}>
                {selectedKorisnik.ime} {selectedKorisnik.prezime}
              </Text>
            )}

            <Text style={styles.label}>Izaberi rolu</Text>

            <View style={styles.roleList}>
              {roles.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.roleOption,
                    selectedRole === item && styles.roleOptionSelected,
                  ]}
                  onPress={() => setSelectedRole(item)}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      selectedRole === item && styles.roleOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={sacuvajRole}
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
  cardHeader: {
    alignItems: "center",
    rowGap: 10,
    marginBottom: 12,
  },
  name: {
    color: "#03757f",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  badgeAdmin: {
    backgroundColor: "#03757f",
  },
  badgeKorisnik: {
    backgroundColor: "#2563eb",
  },
  badgeGost: {
    backgroundColor: "#9ca3af",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  cardBody: {
    rowGap: 6,
    marginBottom: 16,
  },
  cardText: {
    color: "#333",
    fontSize: 15,
    textAlign: "center",
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
    paddingHorizontal: 18,
  },
  deleteButton: {
    backgroundColor: "#9b1c1c",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
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
    rowGap: 12,
  },
  modalTitle: {
    color: "#03757f",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedUserText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  label: {
    color: "#03757f",
    fontWeight: "bold",
    marginTop: 4,
  },
  roleList: {
    rowGap: 10,
  },
  roleOption: {
    backgroundColor: "#f0f2f1",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  roleOptionSelected: {
    backgroundColor: "#03757f",
    borderColor: "#03757f",
  },
  roleOptionText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  roleOptionTextSelected: {
    color: "#fff",
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
