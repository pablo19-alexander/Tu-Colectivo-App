import * as react from "react";
import * as Location from "expo-location";
import { View, StyleSheet, Alert, Button } from "react-native";
import MapView, { Geojson, Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_KEY } from "@env";
import { GetRouters } from "../api/GetRouters";
import { DOMParser } from "xmldom";
import { kml } from "@tmcw/togeojson";

export default BusRoutes = () => {
  const personImg = require("../../assets/person.png");
  const [personLocation, setpersonLocation] = react.useState({
    // coordenadas de neiva
    latitude: 2.9343961682675244,
    longitude: -75.28085097157924,
  });

  const [destination, setdestination] = react.useState();

  // para que se cargue cuando se inicie en la vista
  react.useEffect(() => {
    (async () => {
      await loadRoutes();
    })();
    getLocationPermission();
  }, []);

  const loadRoutes = async () => {
    try {
      const response = await GetRouters();
      //console.log(response);

      if (response != null) {
        const theKml = new DOMParser().parseFromString(response);
        const converted = kml(theKml);
        console.log("esta es las cordenas" + converted);
        setdestination(converted);
      }

      // console.log("hola");
    } catch (error) {
      throw new Error(error);
    }
  };

  // solicitamos permisos al usuario
  async function getLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso denegado!");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setpersonLocation(current);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: personLocation.latitude,
          longitude: personLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {destination?.features ? (
          <Geojson geojson={destination} />
        ) : (
          console.log("Esperando datos de la ruta...")
        )}
        {/* marca la ubicacion de la persona */}
        <Marker coordinate={personLocation} image={personImg} />
      </MapView>
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
});
