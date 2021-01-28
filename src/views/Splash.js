import React from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

const Splash = () => {
  const theme = useTheme().colors;

  const styles = {
    content: {
      backgroundColor: theme.body,
      flex: 1
    },
    safeContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  };

  return (
    <View style={styles.content}>
      <SafeAreaView style={styles.safeContent}>
        <ActivityIndicator />
      </SafeAreaView>
    </View>
  );
};

export default Splash;
