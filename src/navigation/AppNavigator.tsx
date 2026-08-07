import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { SplashScreen } from "@/screens/SplashScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { MenuScreen } from "@/screens/MenuScreen";
import { RulesScreen } from "@/screens/RulesScreen";
import { AboutScreen } from "@/screens/AboutScreen";
import { AddCardScreen } from "@/screens/AddCardScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Rules"
          component={RulesScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="AddCard"
          component={AddCardScreen}
          options={{ animation: "slide_from_right" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
