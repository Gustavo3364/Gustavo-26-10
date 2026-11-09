
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/pages/Home";
import Sobre from "./src/pages/Sobre";

import Camera from "./src/Camera";
import Location from "./src/Location";
import Accelerometer from "./src/Accelerometer";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Diário de Viagem" }}
        />

        <Stack.Screen
          name="Sobre"
          component={Sobre}
          options={{ title: "Sobre o aplicativo" }}
        />

        <Stack.Screen
          name="Camera"
          component={Camera}
          options={{ title: "Minha Câmera" }}
        />

        <Stack.Screen
          name="Location"
          component={Location}
          options={{ title: "Minha Localização" }}
        />

        <Stack.Screen
          name="Accelerometer"
          component={Accelerometer}
          options={{ title: "Acelerômetro" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
