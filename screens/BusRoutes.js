import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";

export default function BusRoutes() {
  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      <Text style={{ fontSize: 20 }}>Aquí se mostrarán las rutas</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
