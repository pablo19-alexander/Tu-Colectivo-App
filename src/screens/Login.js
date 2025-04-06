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
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import ButtonGradient from "../../components/ButtonGradient";
import SvgTop from "../../components/SvgTop";
import appFirebase from "../../credenciales";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons"; // Asegúrate de tener esto instalado

const auth = getAuth(appFirebase);
const { width, height } = Dimensions.get("window");
const db = getFirestore(appFirebase);


export default function Login(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const validateLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña");
      return;
    }
  
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      // Obtener el rol del usuario desde Firestore
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userRole = userData.role;
  
        Alert.alert("Iniciando sesión", `Rol: ${userRole}`);
  
        // Redireccionar según el rol
        if (userRole === "admin") {
          props.navigation.navigate("AdminDashboard");
        } else if (userRole === "conductor") {
          props.navigation.navigate("ConductorDashboard");
        } else {
          props.navigation.navigate("Home"); // usuario normal
        }
      } else {
        Alert.alert("Error", "No se encontró información del usuario.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Correo o contraseña incorrectos");
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

          <ButtonGradient onPress={validateLogin} />

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
