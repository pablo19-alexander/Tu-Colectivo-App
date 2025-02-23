import * as react from "react";
import * as Location from "expo-location";
import { View, StyleSheet, Alert, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_KEY } from "@env";
// import GeojsonData from "../Routes/Ruta106.geojson";

export default BusRoutes = () => {
  const personImg = require("../assets/person.png");
  const [personLocation, setpersonLocation] = react.useState({
    latitude: 2.9343961682675244,
    longitude: -75.28085097157924,
  });

  const [destination, setdestination] = react.useState({
    latitude: 2.9428080492549773,
    longitude: -75.29110329036519,
  });

  // para que se cargue cuando se inicie en la vista
  react.useEffect(() => {
    getLocationPermission();
  }, []);

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
        initialRegion={{
          latitude: personLocation.latitude,
          longitude: personLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* marca la ubicacion de la persona */}
        <Marker coordinate={personLocation} image={personImg} />
        {/* marca la ubicacion de destino */}
        {/* <Marker coordinate={destination} /> */}

        {/* marca la ruta */}
        <MapViewDirections
          origin={personLocation}
          destination={destination}
          image={personImg}
          apikey={GOOGLE_MAPS_KEY}
        />
        {/* <Polyline coordinates={[personLocation, destination]} /> */}
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
