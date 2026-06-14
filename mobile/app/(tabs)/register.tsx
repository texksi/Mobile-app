import AuthForm from "@/components/AuthForm";
import BusIcon from "@/components/svgs/BusIcon";
import { API_URL } from "@/constants/api";
import { authEmitter } from "@/hooks/authEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setError("Greška pri registraciji");
        return;
      }

      const result = await response.json();
      await AsyncStorage.setItem("token", result.token);
      authEmitter.emit("authChanged");
      router.replace("/");
    } catch (e) {
      setError("Greška pri povezivanju sa serverom");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#03757f" }}
      edges={["top"]}
    >
      <View style={styles.containerParent}>
        <BusIcon
          size={150}
          style={{
            position: "absolute",
            top: 30,
            right: -30,
            zIndex: 10,
            transform: [{ rotate: "0deg" }, { scaleX: -1 }],
          }}
        />
        <BusIcon
          size={150}
          style={{
            position: "absolute",
            top: -20,
            left: -30,
            zIndex: 10,
            transform: [{ rotate: "20deg" }],
          }}
        />
        <View style={styles.container1}></View>
        <View style={styles.container2}>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.arrow}>← Vrati se na prijavu</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Registracija</Text>
          <Text style={styles.paragraph}>Doborodošli na BusTicket</Text>
          <AuthForm type="register" onSubmit={handleRegister} error={error} />
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.link}>Već imaš nalog? Prijavi se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerParent: {
    flex: 1,
    backgroundColor: "#03757f",
  },
  container1: {
    flex: 0.2,
    justifyContent: "center",
    backgroundColor: "#03757f",
  },
  container2: {
    flex: 0.8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#f0f2f1",
  },
  title: {
    marginLeft: 20,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
    color: "#03757f",
    letterSpacing: 3,
    marginBottom: 5,
  },
  paragraph: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "left",
    color: "#03757f",
    letterSpacing: 1,
  },
  link: { textAlign: "center", marginTop: 16, color: "#04757d" },
  arrow: {
    marginTop: 20,
    fontSize: 15,
    marginLeft: 20,
    marginBottom: 10,
    color: "#03757f",
  },
});
