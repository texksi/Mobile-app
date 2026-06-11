import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        backgroundColor: "#fff",
      }}
    >
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text>Idi na Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text>Idi na Register</Text>
      </TouchableOpacity>
    </View>
  );
}
