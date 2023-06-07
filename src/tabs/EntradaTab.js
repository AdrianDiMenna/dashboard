import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Entrada from "../pages/Entrada";
import Tarea from "../pages/Tarea";

const Stack = createNativeStackNavigator();

const EntradaTab = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Entrada}
        options={{ title: 'Entrada de Datos' }}
        name="Entrada"
      />
      <Stack.Screen
        component={Tarea}
        options={{ title: 'Agregar Tarea' }}
        name="Tarea"
      />
    </Stack.Navigator>
  );
};

export default EntradaTab;