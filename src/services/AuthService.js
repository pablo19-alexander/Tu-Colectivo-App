import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import appFirebase from "../../credenciales";

const auth = getAuth(appFirebase);
// valida el inicion de sesion
export const ValidateLogin = async (email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    throw new Error("Por favor ingresa correo y contraseña");
  }

  if (!emailRegex.test(email)) {
    throw new Error("Por favor ingresa un correo electrónico válido.");
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Correo o contraseña incorrectos");
  }
};

// registra un usuario
export const RegisterUser = async (email, password, confirmPassword) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !confirmPassword) {
    throw new Error("Todos los campos son obligatorios.");
  }

  if (!emailRegex.test(email)) {
    throw new Error("Por favor ingresa un correo electrónico válido.");
  }

  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }

  if (password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden.");
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return "success";
  } catch (error) {
    throw new Error(error.message);
  }
};
