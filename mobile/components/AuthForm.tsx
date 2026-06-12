import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: any) => void;
  error?: string;
}

export default function AuthForm({ type, onSubmit, error }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (type === "login") {
      onSubmit({ username, password });
    } else {
      onSubmit({ username, password, ime, prezime, email });
    }
  };

  return (
    <View style={styles.container}>
      {type === "register" && (
        <>
          <Text style={styles.label}>Ime</Text>
          <TextInput
            style={styles.input}
            placeholder="Ime"
            placeholderTextColor={"#6b7575"}
            value={ime}
            onChangeText={setIme}
          />
          <Text style={styles.label}>Prezime</Text>
          <TextInput
            style={styles.input}
            placeholder="Prezime"
            placeholderTextColor={"#6b7575"}
            value={prezime}
            onChangeText={setPrezime}
          />
          <Text style={styles.label}>Email adresa</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#6b7575"}
            value={email}
            onChangeText={setEmail}
          />
        </>
      )}
      <Text style={styles.label}>Korisničko ime</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={"#6b7575"}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Lozinka</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"#6b7575"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {type === "login" ? "Prijavi se" : "Registruj se"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 3, padding: 20 },
  input: {
    borderRadius: 20,
    padding: 12,
    backgroundColor: "#ffffff",
    color: "#383d3d",
    marginBottom: 13,
  },
  button: {
    backgroundColor: "#03757f",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 2,
  },
  error: { color: "red", fontSize: 13 },
  label: {
    color: "#03757f",
    fontSize: 15,
    marginBottom: 4,
    fontWeight: "600",
    marginLeft: 8,
  },
});
