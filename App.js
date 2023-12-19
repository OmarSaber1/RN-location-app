import React, { useState, useEffect, createRef } from "react";
import { Button, Image, View, Platform, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const [currentLocation, setCurrentLocation] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    // const [status, requestPermission] = ImagePicker.useCameraPermissions();

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log(
        "User location:",
        location.coords.latitude,
        location.coords.longitude
      );
      setCurrentLocation(location);
      navigation.navigate("Home");
      // Use this location data in your app
    } catch (error) {
      console.error("Error getting location:", error.message);
    }
  };

  console.log({ currentLocation });

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 210,
      }}
    >
      <Button title='Pick an image from camera roll' onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}

      <Button
        style={{ marginTop: 50 }}
        title='Get Location'
        onPress={getUserLocation}
      />
      {currentLocation && (
        <MapView
          onPress={getUserLocation}
          style={{ height: "100%", width: "100%" }}
          initialRegion={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title='Your Location'
          />
        </MapView>
      )}
    </View>
  );
}
