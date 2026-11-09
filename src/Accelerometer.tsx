
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

import { Accelerometer } from "expo-sensors";

export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [isAvailable, setIsAvailable] = useState(true);

  const subscription = useRef<
    ReturnType<typeof Accelerometer.addListener> | null
  >(null);

  useEffect(() => {
    let mounted = true;

    async function startAccelerometer() {
      try {
        // Impede a execução do sensor no navegador.
        if (Platform.OS === "web") {
          setIsAvailable(false);
          return;
        }

        const available = await Accelerometer.isAvailableAsync();

        if (!mounted) return;

        setIsAvailable(available);

        if (!available) return;

        Accelerometer.setUpdateInterval(100);

        subscription.current = Accelerometer.addListener(
          (accelerometerData) => {
            if (!mounted) return;

            setData(accelerometerData);
          }
        );
      } catch (error) {
        if (mounted) {
          setIsAvailable(false);
        }
      }
    }

    startAccelerometer();

    return () => {
      mounted = false;
      subscription.current?.remove();
      subscription.current = null;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acelerômetro</Text>

      {!isAvailable ? (
        <Text style={styles.message}>
          Acelerômetro indisponível. Teste em um celular compatível.
        </Text>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.axis}>Eixo X</Text>
            <Text style={styles.value}>{data.x.toFixed(3)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.axis}>Eixo Y</Text>
            <Text style={styles.value}>{data.y.toFixed(3)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.axis}>Eixo Z</Text>
            <Text style={styles.value}>{data.z.toFixed(3)}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },
  axis: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  value: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
});
