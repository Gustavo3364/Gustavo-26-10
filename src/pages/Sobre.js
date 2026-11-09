import { StyleSheet, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Sobre() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o Diário de Viagem</Text>

      <Text style={styles.description}>
        Este aplicativo foi desenvolvido para registrar experiências
        de viagem utilizando recursos do dispositivo, como câmera,
        localização e acelerômetro.
      </Text>
      
      <View style={styles.buttons}>
        <Button
          title="Ir para Home"
          onPress={() => navigation.navigate("Home")}
        />

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 30,
  },
  buttons: {
    gap: 15,
    width: "100%",
  },
});