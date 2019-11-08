import React, { useEffect, useState, useReducer } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Gyroscope } from 'expo-sensors';

function locationReducer(state, newState) {
  return Object.assign({}, state, newState);
}

const locationInitialState = {
  latitude: '',
  longitude: '',
  date: '',
};

function gyroReducer(state, newState) {
  return Object.assign({}, state, newState);
}

const gyroInitialState = {
  x: '',
  y: '',
  z: '',
};

export default function App() {
  const [permissions, setPermissions] = useState(false);
  const [locationState, locationSetState] = useReducer(locationReducer, locationInitialState);
  const [gyroState, gyroSetState] = useReducer(gyroReducer, gyroInitialState);

  useEffect(() => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => setPermissions(status === 'granted'));

    Gyroscope.isAvailableAsync()
      .then(result => {
        if (result) {
          Gyroscope.addListener(getGyroscope);
        }
      });

    return () => {
      Gyroscope.removeAllListeners();
    };
  }, []);

  async function handlePress() {
    const {
      coords: {
        latitude,
        longitude,
      },
      timestamp,
    } = await Location.getCurrentPositionAsync();

    const date = new Date(timestamp).toString();

    locationSetState({ latitude, longitude, date });
  }

  async function getGyroscope({ x, y, z }) {
    gyroSetState({ x, y, z });
  }

  const { latitude, longitude, date } = locationState;
  const { x, y, z } = gyroState;
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      {!!latitude && <Text>Latitude: {latitude}</Text>}
      {!!longitude && <Text>Longitude: {longitude}</Text>}
      {!!date && <Text>Last seen: {date}</Text>}
      {!!x && <Text>X: {x}</Text>}
      {!!y && <Text>Y: {y}</Text>}
      {!!z && <Text>Z: {z}</Text>}
      <Button
        title="Get location"
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
