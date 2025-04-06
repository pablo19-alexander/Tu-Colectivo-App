import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import ButtonGradient from "../../components/ButtonGradient";
import SvgTop from "../../components/SvgTop";
import appFirebase from "../../credenciales";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const auth = getAuth(appFirebase);
const { width } = Dimensions.get("window");

export default function Register({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Registro exitoso", "Ya puedes iniciar sesión.");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
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

        {/* Contenido por encima del fondo */}
        <View style={styles.container}>
          <Text style={styles.title}>Registrarse</Text>
          <Text style={styles.subTitle}>Crea una cuenta nueva</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
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

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar contraseña"
              secureTextEntry={!showConfirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <ButtonGradient onPress={handleRegister} />

          <Text style={styles.forgotPassword}>
            ¿Ya tienes una cuenta?,{" "}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Login")}
            >
              Inicia sesión
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
  input: {
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
