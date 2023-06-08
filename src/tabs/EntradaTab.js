import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Entrada from "../pages/Entrada";
import Tarea from "../pages/Tarea";
import TareaEdit from "../pages/TareaEdit";

const Stack = createNativeStackNavigator();

const EntradaTab = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Entrada}
        options={{ title: 'Entrada de Datos' }}
        name="EntradaScreen"
      />
      <Stack.Screen
        component={Tarea}
        options={{ title: 'Agregar Tarea' }}
        name="TareaScreen"
      />
      <Stack.Screen
        component={TareaEdit}
        options={{ title: 'Editar Tarea' }}
        name="TareaEdit"
      />
    </Stack.Navigator>
  );
};

export default EntradaTab;