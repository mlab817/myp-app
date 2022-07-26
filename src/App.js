import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import {getUser, loginViaCredentials, loginViaQr} from "./utils/axios.utils";
import {Camera, CameraType} from "expo-camera";
import * as BarcodeScanner from 'expo-barcode-scanner'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);

  const [scanned, setScanned] = useState(false)

  const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleLogin = async () => {
    await loginViaCredentials('test@example.com', 'password')
    await getUser()
  }

  const handleScanned = ({ type, data }) => {
    setScanned(true)

    if (type === BarcodeScanner.Constants.BarCodeType.qr) {
      console.log(data)
      loginViaQr({ loginKey: data })
    } else {
      console.log('not qr')
    }
  }

  //
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>No permission to access camera yet.</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button title="Login" onPress={handleLogin} />

      <Camera
        onBarCodeScanned={scanned ? undefined : handleScanned}
        style={styles.camera}
        type={type} />

      <Button title="Rescan" onPress={() => setScanned(false)} />
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
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 300,
  }
});
