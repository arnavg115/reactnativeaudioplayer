import React from 'react';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import AudioPlayer from './components/AudioPlayer';
import {Ionicons} from "@expo/vector-icons"
import { View } from 'react-native';


const Settings = ()=>{
  return(
    <View>

    </View>
  )
}

const Tabs = createBottomTabNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = "home"
            } 
            else if(route.name === "Settings"){
              iconName = "settings"
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
          <Tabs.Screen name="Home" component={Home}/>
          <Tabs.Screen name="Settings" component={Settings}/>
        </Tabs.Navigator>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <AudioPlayer name = "Bouncy" source = "Tom Fox"/>
        </View>
      </NavigationContainer>
  );
}

