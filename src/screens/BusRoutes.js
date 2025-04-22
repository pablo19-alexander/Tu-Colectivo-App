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
  const [showLegend, setShowLegend] = React.useState(false);

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
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No podemos obtener tu ubicación.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const userLocation = {
        latitude: 2.954973,//location.coords.latitude,
        longitude: -75.297467//location.coords.longitude,
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
          <View style={styles.floatingMenuContainer}>
            <TouchableOpacity
              onPress={() => setShowLegend((prev) => !prev)}
              style={styles.floatingButton}
            >
              <Text style={styles.floatingButtonText}>
                {showLegend ? "Ocultar rutas" : "Ver rutas"}
              </Text>
            </TouchableOpacity>

            {showLegend && (
              <View
                style={[
                  styles.legendContainer,
                  { maxWidth: isLoggedIn ? 300 : 150 }, // Ajusta la altura si esta logueado
                ]}
              >
                {routes.map((route) => {
                  const isVisible = visibleRoutes[route.id];

                  return (
                    <View key={route.id} style={styles.legendItemContainer}>
                      {/* Parte izquierda: color y texto */}
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedRoute(route);
                          if (mapRef.current && route.coordinates.length > 0) {
                            const middleIndex = Math.floor(route.coordinates.length / 2);
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
                        style={styles.legendLeftSection}
                      >
                        <View
                          style={[
                            styles.legendColor,
                            {
                              backgroundColor: route.strokeColor,
                              opacity: isVisible ? 1 : 0.3,
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.legendText,
                            selectedRoute?.id === route.id && styles.legendTextSelected,
                            !isVisible && styles.legendTextHidden,
                          ]}
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
                          style={[
                            styles.toggleButton,
                            {
                              backgroundColor: isVisible ? "#e74c3c" : "#2ecc71",
                            },
                          ]}
                        >
                          <Text style={styles.toggleButtonText}>
                            {isVisible ? "Ocultar" : "Mostrar"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
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
  floatingMenuContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
    alignItems: "flex-end",
  },
  floatingButton: {
    backgroundColor: "#3498db",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 4,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  legendContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    // maxHeight: 300,
    width: 230,
    elevation: 5,
  },
  legendItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 4,
  },
  legendLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    flex: 1,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  legendTextSelected: {
    color: "blue",
  },
  legendTextHidden: {
    color: "gray",
    textDecorationLine: "line-through",
  },
  toggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 12,
  },
});
