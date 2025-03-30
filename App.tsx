import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Blocks from './blocks';
import BlockDetails from './blockDetails';
import { theme } from './assets/theme';
import { StyleSheet, View } from 'react-native';

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Solana Explorer"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background, 
              },
              headerTintColor: theme.colors.white, 
              cardStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          >
            <Stack.Screen name="Solana Explorer" component={Blocks} />
            <Stack.Screen name="Details" component={BlockDetails} />
          </Stack.Navigator>  
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingTop: 50,
    // borderWidth: 20,
    // borderColor: "red",
    backgroundColor: theme.colors.background,
    // paddingHorizontal: 20,
  },
});