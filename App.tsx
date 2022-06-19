import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';

import React from 'react';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import { NavigationContainer} from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes';

import theme from './src/global/styles/theme';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Dashboard } from './src/screen/Dashboard';
import { Register } from './src/screen/Register';



export default function App(): JSX.Element {
  const [fontsLoaded] = useFonts({
      Poppins_400Regular,
      Poppins_500Medium,
      Poppins_700Bold,
    });


    if(!fontsLoaded){
      return <AppLoading />
    }
  
  return (
  
  <ThemeProvider theme={theme}>
    <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>

    </GestureHandlerRootView>
 </ThemeProvider>
  )
}


