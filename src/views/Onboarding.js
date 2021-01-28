import React, { useState } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
import Intro from './onboarding/Intro';

const Onboarding = () => {
  const Stack = createStackNavigator();
  const theme = useTheme().colors;

  const styles = {
    content: {
      backgroundColor: theme.body,
      flex: 1
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false}}
      style={styles.content}
    >
      <Stack.Screen name="Intro" component={Intro} />
    </Stack.Navigator>
  );
};

export default Onboarding;
