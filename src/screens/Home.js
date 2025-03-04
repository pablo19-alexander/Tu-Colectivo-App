import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Home({ navigation }) {
  const goToPage = (pageName) => {
    navigation.navigate(pageName);
  };

  return (
    <ImageBackground
      source={require("../../assets/fondo.jpg")} // Ruta de la imagen de fondo
      style={styles.container}
      imageStyle={styles.imageBackground} // Aplica el estilo para oscurecer la imagen
    >
      {/* Capa de oscurecimiento */}
      <View style={styles.overlay}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>TU COLECTIVO</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => goToPage("Routes")} // Navega a la pantalla "Routes"
          >
            <Text style={styles.buttonText}>Ver rutas</Text>
            <Image
              source={require("../../assets/location.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          <Text style={styles.orText}>o</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => goToPage("Login")} // Navega a la pantalla "Login"
          >
            <Text style={styles.buttonText}>log in</Text>
            <Image
              source={require("../../assets/login.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          <Text style={styles.registerText}>
            ¿Aún no tienes una cuenta?,{" "}
            <Text
              style={styles.registerLink}
              onPress={() => goToPage("Register")}
            >
              Regístrate
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Capa oscura semitransparente
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header: {
    marginTop: -90,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  orText: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 5,
  },
  registerText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 20,
  },
  registerLink: {
    color: "#FF0000",
    fontWeight: "bold",
  },
});
