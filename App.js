import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native"; // Importa NavigationContainer
import NavigationStack from "./navigation/NavigationStack"; // Importa NavigationStack

// Componente principal de la aplicación
export default function App() {
  return (
    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>
  );
}
