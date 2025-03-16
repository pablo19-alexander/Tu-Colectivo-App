/**
 * Componente BusRoutes
 * Este componente muestra un mapa con las rutas de los colectivos y la ubicación del usuario.
 * Obtiene la ubicación del usuario, carga las rutas desde un archivo KML y las dibuja en el mapa.
 */

import * as React from "react";
import * as Location from "expo-location";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import { GetRouters } from "../api/GetRouters";
import { DOMParser } from "xmldom";
import { kml } from "@tmcw/togeojson";

export default BusRoutes = () => {
  const personImg = require("../../assets/person.png");
  const [personLocation, setPersonLocation] = React.useState(null);
  const [routes, setRoutes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const mapRef = React.useRef(null);

  // Efecto que solicita permisos de ubicación y carga las rutas al montar el componente
  React.useEffect(() => {
    (async () => {
      await getLocationPermission();
      await loadRoutes();
    })();
  }, []);

  /**
   * Solicita permisos de ubicación al usuario y obtiene su ubicación actual.
   * Si se concede el permiso, centra el mapa en la ubicación del usuario.
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

      // Centrar el mapa en la ubicación del usuario
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          { ...userLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 },
          1000
        );
      }
    } catch (error) {
      console.error("Error obteniendo la ubicación:", error);
    }
  };

  /**
   * Carga las rutas de los colectivos desde un archivo KML y las procesa.
   * Extrae coordenadas, nombres y colores de las rutas para su representación en el mapa.
   */
  const loadRoutes = async () => {
    try {
      const response = await GetRouters();
      if (!response) return;
      const theKml = new DOMParser().parseFromString(response);
      const converted = kml(theKml);
      if (!converted?.features?.length) return;

      const extractedRoutes = converted.features
        .map((feature, index) => {
          const coordinates =
            feature.geometry?.coordinates?.map(([lng, lat]) => ({
              latitude: lat,
              longitude: lng,
            })) || [];
          if (!coordinates.length) return null;

          // Determinar el color de la ruta según su nombre
          const routeName = feature.properties?.name?.toLowerCase() || "";
          let routeColor = routeName.includes("vuelta")
            ? "red"
            : routeName.includes("ida")
              ? "green"
              : "black";

          return {
            id: index,
            name: feature.properties?.description || "Ruta desconocida",
            orientationRoutes: feature.properties?.name,
            coordinates,
            strokeColor: routeColor,
            strokeWidth: 2,
          };
        })
        .filter((route) => route);

      setRoutes(extractedRoutes);
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
                    ...personLocation,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }
                : {
                    latitude: 2.9273, // Ubicación por defecto (Neiva, Huila)
                    longitude: -75.2819,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }
            }
          >
            {/* Dibujar las rutas en el mapa */}
            {routes.map((route) => (
              <Polyline
                key={route.id}
                coordinates={route.coordinates}
                strokeColor={route.strokeColor}
                strokeWidth={selectedRoute?.id === route.id ? 4 : 2}
                tappable={true}
                onPress={() => setSelectedRoute(route)}
              />
            ))}

            {/* Mostrar información de la ruta seleccionada */}
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

            {/* Mostrar la ubicación del usuario */}
            {personLocation && (
              <Marker coordinate={personLocation} image={personImg} />
            )}
          </MapView>

          {/* Leyenda de rutas */}
          <View style={styles.legendContainer}>
            {routes.map((route) => (
              <TouchableOpacity
                key={route.id}
                onPress={() => setSelectedRoute(route)}
                style={styles.legendItem}
              >
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: route.strokeColor },
                  ]}
                />
                <Text
                  style={[
                    styles.legendText,
                    selectedRoute?.id === route.id && { color: "blue" },
                  ]}
                >
                  {route.name} - {route.orientationRoutes || "IDA"}
                </Text>
              </TouchableOpacity>
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
    top: 20,
    right: 20,
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
