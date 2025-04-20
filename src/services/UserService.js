import {
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../../credenciales";

// obtiene todos los usuairos de la base de datos
export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return [];
  }
};

// obtenemos un usuario por su id
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, "users", userId); // La colección se llama "users"
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
};

// Actualizar un usuario
export const updateUser = async (userId, updatedUser) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updatedUser);
    console.log("Usuario actualizado en Firestore");
    return true;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};
