import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { role } = useAuth();

  return (
    <Tabs
      key={role}
      screenOptions={{
        tabBarActiveTintColor: "#03757f",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kupi-kartu"
        options={{
          title: "Karte",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="ticket" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="moje-rezervacije"
        options={{
          title: "Rezervacije",
          href: role === "GOST" ? null : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen name="login" options={{ href: null, headerShown: false }} />
      <Tabs.Screen
        name="register"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="admin-kompanije"
        options={{
          title: "Kompanije - Admin",
          href: role === "ADMIN" ? undefined : null,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="domain" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
