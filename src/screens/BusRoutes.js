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
import { StatusBar } from "expo-status-bar";
import { GetUser } from "../services/AuthService";

export default BusRoutes = () => {
  const personImg = require("../../assets/person.png");
  const [personLocation, setPersonLocation] = React.useState(null);
  const [routes, setRoutes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const mapRef = React.useRef(null);
  const [isLoggedIn, setUser] = React.useState(null);
  const [visibleRoutes, setVisibleRoutes] = React.useState({});

  // Efecto que solicita permisos de ubicación y carga las rutas al montar el componente
  React.useEffect(() => {
    (async () => {
      const unsubscribe = GetUser((userData) => {
        setUser(userData);
      });
      await getLocationPermission();
      await loadRoutes();

      return unsubscribe;
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
      const initialVisibility = {};
      extractedRoutes.forEach((route) => {
        initialVisibility[route.id] = true; // todas visibles por defecto
      });
      setVisibleRoutes(initialVisibility);
    } catch (error) {
      console.error("Error cargando las rutas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="black" />
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
            {routes.map(
              (route) =>
                visibleRoutes[route.id] && (
                  <Polyline
                    key={route.id}
                    coordinates={route.coordinates}
                    strokeColor={route.strokeColor}
                    strokeWidth={selectedRoute?.id === route.id ? 4 : 2}
                    tappable={true}
                    onPress={() => setSelectedRoute(route)}
                  />
                )
            )}

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

          {/* vista flotante de las rutas */}
          <View style={styles.legendContainer}>
            {routes.map((route) => {
              const isVisible = visibleRoutes[route.id];

              return (
                <View key={route.id} style={styles.legendItemContainer}>
                  {/* Parte izquierda: color y texto */}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRoute(route);
                      if (mapRef.current && route.coordinates.length > 0) {
                        const middleIndex = Math.floor(
                          route.coordinates.length / 2
                        );
                        const middleCoord = route.coordinates[middleIndex];

                        mapRef.current.animateToRegion(
                          {
                            ...middleCoord,
                            latitudeDelta: 0.06,
                            longitudeDelta: 0.06,
                          },
                          1000
                        );
                      }
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexShrink: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        marginRight: 8,
                        backgroundColor: route.strokeColor,
                        opacity: isVisible ? 1 : 0.3,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          selectedRoute?.id === route.id
                            ? "blue"
                            : isVisible
                              ? "#333"
                              : "gray",
                        textDecorationLine: !isVisible
                          ? "line-through"
                          : "none",
                        flexShrink: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {route.name} - {route.orientationRoutes || "IDA"}
                    </Text>
                  </TouchableOpacity>

                  {/* Parte derecha: botón de mostrar/ocultar si está logueado */}
                  {isLoggedIn && (
                    <TouchableOpacity
                      onPress={() =>
                        setVisibleRoutes((prev) => ({
                          ...prev,
                          [route.id]: !prev[route.id],
                        }))
                      }
                      style={{
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        backgroundColor: isVisible ? "#e74c3c" : "#2ecc71",
                        borderRadius: 6,
                        marginLeft: 8,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12 }}>
                        {isVisible ? "Ocultar" : "Mostrar"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
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
  legendItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
});
