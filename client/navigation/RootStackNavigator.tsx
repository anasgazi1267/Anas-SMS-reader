import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SMSReaderScreen from "@/screens/SMSReaderScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { HeaderTitle } from "@/components/HeaderTitle";

export type RootStackParamList = {
  SMSReader: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="SMSReader"
        component={SMSReaderScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Anas SMS Reader" />,
        }}
      />
    </Stack.Navigator>
  );
}
