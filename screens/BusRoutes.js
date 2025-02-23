import * as react from "react";
import * as Location from "expo-location";
import { View, StyleSheet, Alert, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_KEY } from "@env";

export default BusRoutes = () => {
  const personImg = require("../assets/person.png");
  const [origin, setOrgin] = react.useState({
    latitude: 2.935124338031733,
    longitude: -75.28114344248516,
  });

  const [destination, setdestination] = react.useState({
    latitude: 2.9428080492549773,
    longitude: -75.29110329036519,
  });

  // para que se cargue cunado se inicie en la vista
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
    setOrgin(current);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={origin} image={personImg} />
        <Marker coordinate={destination} />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_KEY}
        />
        {/* <Polyline coordinates={[origin, destination]} /> */}
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
