import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import HomeScreen from './Home';
import MyListScreen from './MyListScreen';

const Stack = createStackNavigator();

export default function App() {
  const [myList, setMyList] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {props => <HomeScreen {...props} myList={myList} setMyList={setMyList} />}
        </Stack.Screen>
        <Stack.Screen name="My List">
          {props => <MyListScreen {...props} myList={myList} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}