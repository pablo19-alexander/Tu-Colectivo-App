import { collection, getDocs } from "firebase/firestore";
import { db } from "../../credenciales";
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
