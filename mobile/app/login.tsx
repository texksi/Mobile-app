import AuthForm from "@/components/AuthForm";
import TicketIcon from "@/components/svgs/TicketIcon";
import TravelIcon from "@/components/svgs/TravelIcon";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setError("Pogrešni kredencijali");
        return;
      }

      const result = await response.json();
      await AsyncStorage.setItem("token", result.token);
      router.replace("/");
    } catch (e) {
      setError("Greska pri povezivanju sa serverom");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#03757f" }}
      edges={["top"]}
    >
      <View style={styles.container}>
        <View style={styles.container1}>
          <Text style={styles.title}>Dobrodošli</Text>
          <Text style={styles.paragraph}>
            Prijavite se da bi rezervisali karte
          </Text>
          <TicketIcon
            size={100}
            style={{ position: "absolute", top: 40, right: 160 }}
          />
        </View>
        <View style={styles.container2}>
          <Text style={styles.titleLogin}>Prijava</Text>
          <AuthForm type="login" onSubmit={handleLogin} error={error} />
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.link}>Nemaš nalog? Registruj se</Text>
          </TouchableOpacity>
          <TravelIcon
            size={180}
            style={{ position: "absolute", top: 420, right: 115 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03757f",
  },
  container1: {
    flex: 0.27,
    backgroundColor: "#03757f",
  },
  container2: {
    flex: 0.73,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#f0f2f1",
  },
  title: {
    marginTop: 150,
    fontSize: 43,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textAlign: "center",
  },
  link: { textAlign: "center", marginTop: 16, color: "#03757f" },
  paragraph: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  titleLogin: {
    marginTop: 40,
    marginLeft: 30,
    fontSize: 38,
    fontWeight: "bold",
    color: "#03757f",
    letterSpacing: 2,
  },
});
