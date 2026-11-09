
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diário de Viagem</Text>
        <Text style={styles.subtitle}>
          Registre momentos, explore lugares e descubra informações
          do seu ambiente.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Minhas ferramentas</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Camera")}
      >
        <Text style={styles.icon}>📷</Text>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Minha Câmera</Text>
          <Text style={styles.description}>
            Tire fotos e salve seus registros na galeria.
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Location")}
      >
        <Text style={styles.icon}>📍</Text>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Minha Localização</Text>
          <Text style={styles.description}>
            Consulte suas coordenadas geográficas.
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Accelerometer")}
      >
        <Text style={styles.icon}>📱</Text>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Acelerômetro</Text>
          <Text style={styles.description}>
            Acompanhe os movimentos nos eixos X, Y e Z.
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => navigation.navigate("Sobre")}
      >
        <Text style={styles.aboutButtonText}>Sobre o aplicativo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F1F5F9",
    padding: 20,
  },
  header: {
    backgroundColor: "#2563EB",
    padding: 24,
    borderRadius: 16,
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#DBEAFE",
    lineHeight: 23,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  icon: {
    fontSize: 30,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 19,
  },
  arrow: {
    fontSize: 28,
    color: "#2563EB",
    marginLeft: 8,
  },
  aboutButton: {
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  aboutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});
