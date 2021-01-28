import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './src/views/Splash';
import Onboarding from './src/views/Onboarding';
import Home from './src/views/Home';
import themes from './src/constants/themes';
import Auth from './src/api/auth';

export const AuthContext = React.createContext();

const App = () => {
  const Stack = createStackNavigator();
  const scheme = useColorScheme();

  const [state, setState] = useState({
    auth: {
      isLoading: true,
      isAuthenticated: false,
    }
  });

  const auth = new Auth();

  const authContext = React.useMemo(
    () => ({
      refreshAuthentication: () => {
        setState({
          ...state,
          auth: {
            ...state.auth,
            isLoading: true
          }
        });
      },

      setAuthenticated: (isAuthenticated) => {
        setState({
          ...state,
          auth: {
            isLoading: false,
            isAuthenticated
          }
        });
      },

      signOut: () => {
        auth.resetAuthentication().then(response => {
          setState({
            ...state,
            auth: {
              isLoading: false,
              isAuthenticated: false
            }
          });
        });
      }
    }),
    []
  );

  useEffect(() => {
    const tryAuth = async () => {
      const accessToken = await auth.getAccessToken();
      // accessToken will be undefined or null if user is not authenticated
      if (accessToken === undefined || accessToken === null) {
        authContext.setAuthenticated(false);
      } else {
        authContext.setAuthenticated(true);
      }
    }

    if (state.auth.isLoading && !state.auth.isAuthenticated) {
      tryAuth();
    }
  }, [state.auth.isLoading]);

  return (
    <AppearanceProvider>
      <AuthContext.Provider value={authContext}>
        {state.auth.isLoading ?
          <Splash />
          :
          <NavigationContainer theme={scheme === 'dark' ? {colors: themes.dark} : {colors: themes.light}}>
            {state.auth.isAuthenticated ?
              <Home />
              :
              <Onboarding />
            }
          </NavigationContainer>
        }
      </AuthContext.Provider>
    </AppearanceProvider>
  );
};

export default App;