import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview"; // Importa WebView para mostrar Google Maps
import * as Location from "expo-location"; // Importa expo-location para obtener la ubicación del usuario

export default function BusRoutes() {
  // Estado para almacenar la ubicación del usuario
  const [userLocation, setUserLocation] = useState(null);
  // Estado para controlar la carga de la ubicación
  const [loading, setLoading] = useState(true);

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    const getLocation = async () => {
      // Solicita permisos de ubicación al usuario
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // Muestra una alerta si el usuario deniega los permisos
        Alert.alert(
          "Permiso denegado",
          "Habilita la ubicación para ver tu posición en el mapa."
        );
        setLoading(false);
        return;
      }

      // Obtiene la ubicación actual del usuario
      let location = await Location.getCurrentPositionAsync({});
      // Guarda la ubicación en el estado
      setUserLocation(location.coords);
      // Marca la carga como finalizada
      setLoading(false);
    };

    getLocation(); // Llama a la función para obtener la ubicación
  }, []); // Se ejecuta solo una vez al montar el componente

  // Construye la URL del mapa de Google Maps con la ruta de los colectivos
  const googleMapsURL = userLocation
    ? `https://www.google.com/maps/d/embed?mid=1pz9lihRHXHcju1yyY20xSSJ7nLgg974&ehbc=2E312F&ll=${userLocation.latitude},${userLocation.longitude}&z=14`
    : "https://www.google.com/maps/d/embed?mid=1pz9lihRHXHcju1yyY20xSSJ7nLgg974&ehbc=2E312F";

  return (
    <View style={styles.container}>
      {loading ? (
        // Muestra un indicador de carga mientras se obtiene la ubicación
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        // Muestra el mapa con la ruta de los colectivos y la ubicación del usuario
        <WebView source={{ uri: googleMapsURL }} style={styles.webview} />
      )}
    </View>
  );
}

// Definición de estilos para la vista
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible en la pantalla
  },
  webview: {
    flex: 1, // Permite que el WebView ocupe toda la pantalla
  },
});
