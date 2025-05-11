import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import ButtonGradient from "../../components/ButtonGradient";
import SvgTop from "../../components/SvgTop";
import { Ionicons } from "@expo/vector-icons";
import { ValidateLogin } from "../services/AuthService";

export default function Login(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async () => {
    try {
      await ValidateLogin(email, password);
      Alert.alert("Inicion de sesión exitoso", "Bienvenido!");
      props.navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        {/* Fondo SVG */}
        <View style={styles.svgContainer}>
          <SvgTop />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subTitle}>Iniciar sesión en su cuenta</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Ingrese su email"
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <ButtonGradient onPress={handleLogin} />

          <Text style={styles.forgotPassword}>
            ¿No tienes una cuenta?,{" "}
            <Text
              style={styles.registerLink}
              onPress={() => props.navigation.navigate("Register")}
            >
              Regístrate
            </Text>
          </Text>
          <StatusBar style="auto" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    marginTop: -40,
    paddingHorizontal: 20,
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: -1,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "aliceblue",
  },
  subTitle: {
    fontSize: 18,
    color: "azure",
    marginBottom: 20,
  },
  textInput: {
    padding: 10,
    paddingStart: 30,
    width: "80%",
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    width: "80%",
    height: 50,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    paddingLeft: 10,
  },
  forgotPassword: {
    fontSize: 14,
    color: "gray",
    marginTop: 20,
  },
  registerLink: {
    color: "#FF0000",
    fontWeight: "bold",
  },
});
