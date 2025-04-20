import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Button, // Importamos el botón
  Alert, // Importamos alert para mostrar mensajes
} from "react-native";
import { getAllUsers } from "../services/UserService"; // Asegúrate de que la ruta esté bien

export default function UserForm(props) {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    props.navigation.navigate("UpdateUserForm", { userId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.name}>{item.Name || "Sin nombre"}</Text>
      <Text style={styles.email}>{item.Email}</Text>
      <Text style={styles.role}>Rol: {item.Role || "N/A"}</Text>
      <Button
        title="Editar"
        onPress={() => handleEdit(item.id)} // Llamamos a la función de edición
      />
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color="#999999"
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    color: "#555",
  },
  role: {
    marginTop: 5,
    fontStyle: "italic",
  },
});
