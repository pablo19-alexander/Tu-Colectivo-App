/**
 * Componente BusRoutes
 * Este componente muestra un mapa con las rutas de los colectivos y la ubicación del usuario.
 * Obtiene la ubicación del usuario, carga las rutas desde un archivo KML y las dibuja en el mapa.
 */

import * as React from "react";
import * as Location from "expo-location";
import { View, StyleSheet, Alert, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import { GetRouters } from "../api/GetRouters";
import { DOMParser } from "xmldom";
import { kml } from "@tmcw/togeojson";

export default BusRoutes = () => {
  // Imagen del usuario
  const personImg = require("../../assets/person.png");

  // Estado para la ubicación del usuario
  const [personLocation, setPersonLocation] = React.useState(null);

  // Estado para almacenar las rutas obtenidas del KML
  const [routes, setRoutes] = React.useState([]);

  // Estado para manejar la carga de datos
  const [loading, setLoading] = React.useState(true);

  const [selectedRoute, setSelectedRoute] = React.useState(null);

  // Referencia al mapa para manipular la vista
  const mapRef = React.useRef(null);

  // useEffect se ejecuta al montar el componente
  React.useEffect(() => {
    (async () => {
      await getLocationPermission();
      await loadRoutes();
    })();
  }, []);

  /**
   * Solicita permiso de ubicación al usuario y obtiene su posición actual.
   */
  const getLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No podemos obtener tu ubicación.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setPersonLocation(userLocation);

      // Mueve la cámara del mapa a la ubicación del usuario
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...userLocation,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
      }
    } catch (error) {
      console.error("Error obteniendo la ubicación:", error);
    }
  };

  /**
   * Carga las rutas desde el archivo KML proporcionado por la API.
   */
  const loadRoutes = async () => {
    try {
      // console.log("Cargando rutas...");

      const response = await GetRouters();
      if (!response) {
        console.log("No se recibió respuesta del servidor.");
        return;
      }

      const theKml = new DOMParser().parseFromString(response);
      const converted = kml(theKml);

      if (
        !converted ||
        !converted.features ||
        converted.features.length === 0
      ) {
        console.log("No se encontraron rutas en el KML.");
        return;
      }

      // Extraer rutas y asignar color basado en el <name>
      const extractedRoutes = converted.features
        .map((feature, index) => {
          const coordinates =
            feature.geometry?.coordinates?.map(([lng, lat]) => ({
              latitude: lat,
              longitude: lng,
            })) || [];

          if (coordinates.length === 0) {
            console.log(`No se encontraron coordenadas en la ruta ${index}`);
            return null;
          }

          // Obtener el <name> de la ruta y determinar el color
          const routeName = feature.properties?.name
            ? feature.properties.name.toLowerCase()
            : "";
          let routeColor = "#000000"; // Color por defecto
          if (routeName.includes("vuelta")) {
            routeColor = "red";
          } else if (routeName.includes("ida")) {
            routeColor = "green";
          }

          return {
            id: index,
            coordinates,
            strokeColor: routeColor,
            strokeWidth: 2,
          };
        })
        .filter((route) => route !== null); // Eliminar rutas vacías

      setRoutes(extractedRoutes);
      // console.log("Rutas cargadas correctamente:", extractedRoutes.length);
    } catch (error) {
      console.error("Error cargando las rutas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={
              personLocation
                ? {
                    latitude: personLocation.latitude,
                    longitude: personLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }
                : {
                    latitude: 2.9343961682675244,
                    longitude: -75.28085097157924,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }
            }
          >
            {routes.map((route) => (
              <Polyline
                key={route.id}
                coordinates={route.coordinates}
                strokeColor={route.strokeColor}
                strokeWidth={route.strokeWidth}
                tappable={true} // Habilita el clic en la línea
                onPress={() => setSelectedRoute(route)} // Guarda la ruta seleccionada
              />
            ))}

            {selectedRoute && (
              <Marker coordinate={selectedRoute.coordinates[0]}>
                <Callout onPress={() => setSelectedRoute(null)}>
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>
                      {selectedRoute.name}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            )}

            {personLocation && (
              <Marker coordinate={personLocation} image={personImg} />
            )}
          </MapView>

          {/* 📌 Leyenda de rutas */}
          <View style={styles.legendContainer}>
            {routes.map((route) => (
              <View key={route.id} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: route.strokeColor },
                  ]}
                />
                <Text style={styles.legendText}>{route.name || "Ruta"}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  legendContainer: {
    position: "absolute",
    top: 20, // Ajusta la distancia desde la parte superior
    right: 20, // Mueve la leyenda a la derecha
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 10,
    marginRight: 8,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
