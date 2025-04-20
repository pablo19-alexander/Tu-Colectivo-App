import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Menu, Provider } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../../credenciales";
import { GetUser } from "../services/AuthService";

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = GetUser((userData) => {
      setUser(userData);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setMenuVisible(false);
  };

  const goToPage = (pageName) => {
    navigation.navigate(pageName);
  };

  return (
    <Provider>
      <ImageBackground
        source={require("../../assets/fondo.jpg")}
        style={styles.container}
        imageStyle={styles.imageBackground}
      >
        <View style={styles.overlay}>
          <StatusBar style="light" />
          <View style={styles.menuContainer}>
            {user && (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Feather name="menu" size={40} color="#fff" top={20} />
                  </TouchableOpacity>
                }
              >
                <Menu.Item title={user.email} disabled />
                {user.Role === "admin" && (
                  <Menu.Item
                    onPress={() => {
                      setMenuVisible(false);
                      goToPage("UserForm");
                    }}
                    title="Usuarios"
                  />
                )}
                <Menu.Item onPress={logout} title="Cerrar sesión" />
              </Menu>
            )}
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>TU COLECTIVO</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => goToPage("Routes")}
            >
              <Text style={styles.buttonText}>Ver rutas</Text>
              <Image
                source={require("../../assets/location.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {!user && (
              <>
                <Text style={styles.orText}>o</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => goToPage("Login")}
                >
                  <Text style={styles.buttonText}>Log in</Text>
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
              </>
            )}
          </View>
        </View>
      </ImageBackground>
    </Provider>
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  menuContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
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
