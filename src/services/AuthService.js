import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../credenciales";

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
export const RegisterUser = async (
  email,
  password,
  confirmPassword,
  name,
  role
) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !confirmPassword || !name) {
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
    // creamos el usuario de autenticacion
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    try {
      // guardamos el usuario en la base de datos
      await setDoc(doc(db, "users", user.uid), {
        Email: email,
        Name: name,
        Role: role || "User",
      });

      return "success";
    } catch (firestoreError) {
      await deleteUser(user);
      throw new Error(
        "Error al guardar en la base de datos. Usuario eliminado."
      );
    }
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("El correo electrónico ya está en uso.");
    } else {
      throw new Error(error.message);
    }
  }
};

// Función para escuchar cambios de autenticación y obtener el rol
export const Getuser = (callback) => {
  return onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          // crea un nuevo objeto con los datos del usuario
          callback({ ...currentUser, ...userData });
        } else {
          callback(currentUser); // Usuario sin datos adicionales
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        callback(currentUser); // Retorna aunque haya error
      }
    } else {
      callback(null);
    }
  });
};
