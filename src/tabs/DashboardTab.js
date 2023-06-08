import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Dashboard from "../pages/Dashboard";

const Stack = createNativeStackNavigator();
const DashboardTab = (props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                component={Dashboard}
                options={{ title: 'Dashboard' }}
                name="DashboardScreen"
            />
        </Stack.Navigator>
    );
};

export default DashboardTab;