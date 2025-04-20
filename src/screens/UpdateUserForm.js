import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getUserById, updateUser } from "../services/UserService"; // Asegúrate de tener estas funciones
import { useRoute, useNavigation } from "@react-navigation/native";

export default function UpdateUserForm(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // obtnemos los datos del suario por id
  const fetchUser = async () => {
    try {
      const data = await getUserById(userId);
      setUser(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener el usuario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await updateUser(user.id, user);
      Alert.alert("Éxito", "Usuario actualizado correctamente.");
      props.navigation.navigate("UserForm"); // Regresar a la pantalla de usuarios
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el usuario.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuario</Text>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={user.Name}
        onChangeText={(text) => setUser({ ...user, Name: text })}
      />
      <Text style={styles.label}>correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.Email}
        onChangeText={(text) => setUser({ ...user, Email: text })}
      />

      <Text style={styles.label}>Rol</Text>
      <TextInput
        style={styles.input}
        placeholder="Rol"
        value={user.Role}
        onChangeText={(text) => setUser({ ...user, Role: text })}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  }, 
  saveButton: {
    backgroundColor: "#4CAF50", // Verde elegante
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // sombra en Android
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
