import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BusRoutes from "../screens/BusRoutes";
import Login from "../screens/Login";
import Home from "../screens/Home";
import Register from "../screens/Register";
import UserForm from "../screens/UserForm";
import UpdateUserForm from "../screens/UpdateUserForm";

const Stack = createStackNavigator();

export default function NavigationStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      {/* // vista principal */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Routes"
        component={BusRoutes}
        options={{ title: "Rutas de colectivos" }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserForm"
        component={UserForm}
        options={{ title: "Formulario de Usuario" }}
      />
      <Stack.Screen
        name="UpdateUserForm"
        component={UpdateUserForm}
        options={{ title: "Actualizar Usuario" }}
      />
    </Stack.Navigator>
  );
}
