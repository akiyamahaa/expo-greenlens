import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, Gallery, Timer1 } from "iconsax-react-nativejs";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { analyzeWasteApi } from "../api/analyze-waste";

const { width } = Dimensions.get("window");

export function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useFocusEffect(
    React.useCallback(() => {
      // Resume preview when screen is focused
      if (cameraRef.current) {
        cameraRef.current.resumePreview();
      }
      setIsScanning(false);
    }, [])
  );

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#159947" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-10">
        <Text className="text-white text-center text-lg mb-6">
          Chúng tôi cần quyền truy cập Camera để có thể nhận diện rác thải.
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary-main px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold">Cấp quyền truy cập</Text>
        </Pressable>
      </View>
    );
  }

  const handlePickImage = async () => {
    if (isScanning) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setIsScanning(true);
        const photoUri = result.assets[0].uri;
        const analysisResult = await analyzeWasteApi(photoUri);

        const scanId = analysisResult.id || analysisResult.article?.id;

        if (scanId) {
          router.push({
            pathname: "/scan-result/[id]",
            params: { id: scanId, result: JSON.stringify(analysisResult) },
          });
        } else {
          throw new Error("Không nhận được mã định danh kết quả từ hệ thống");
        }
      }
    } catch (error: any) {
      // Error is already toasted by the httpClient interceptor
    } finally {
      setIsScanning(false);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isScanning) return;

    try {
      setIsScanning(true);

      // Pause preview to give user feedback that photo is being taken
      await cameraRef.current.pausePreview();

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      if (photo?.uri) {
        const result = await analyzeWasteApi(photo.uri);

        console.log("result", result);

        const scanId = result.id || result.article?.id;

        if (scanId) {
          router.push({
            pathname: "/scan-result/[id]",
            params: { id: scanId, result: JSON.stringify(result) }
          });
        } else {
          throw new Error("Không nhận được mã định danh kết quả từ hệ thống");
        }
      }
    } catch (error: any) {
      // Error is already toasted by the httpClient interceptor
      
      // Resume preview if failed
      if (cameraRef.current) {
        await cameraRef.current.resumePreview();
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        className="flex-1"
      >
        {/* Overlay: Darken sides, clear center */}
        <View style={styles.overlayContainer}>
          <View style={styles.darkRow} />
          <View style={styles.centerRow}>
            <View style={styles.darkColumn} />
            <View style={styles.viewfinder}>
              {/* Corners */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              {/* Scan Line */}
              <View
                className="h-[2px] w-full bg-primary-main"
                style={styles.scanLine}
              />
            </View>
            <View style={styles.darkColumn} />
          </View>
          <View style={styles.darkRow} />
        </View>

        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 items-center justify-center rounded-full bg-white/20"
            >
              <ArrowLeft size={24} color="white" variant="Linear" />
            </Pressable>
            <Pressable
              onPress={() => router.push("/scan-history")}
              className="h-12 w-12 items-center justify-center rounded-full bg-white/20"
            >
              <Timer1 size={24} color="white" variant="Linear" />
            </Pressable>
          </View>

          {/* Controls */}
          <View className="flex-1 justify-end pb-20">
            <View className="flex-row items-center justify-center px-10">
              {/* Gallery Button */}
              <View className="flex-1 items-start">
                <Pressable
                  onPress={handlePickImage}
                  disabled={isScanning}
                  className="h-12 w-12 items-center justify-center rounded-full bg-black/40 border border-white/20"
                >
                  <Gallery size={24} color="white" variant="Linear" />
                </Pressable>
              </View>

              {/* Shutter Button */}
              <View className="flex-1 items-center">
                {isScanning ? (
                  <View className="h-20 w-20 items-center justify-center">
                    <ActivityIndicator size="large" color="#159947" />
                  </View>
                ) : (
                  <Pressable
                    onPress={handleCapture}
                    className="h-20 w-20 rounded-full border-4 border-white items-center justify-center"
                  >
                    <View className="h-14 w-14 rounded-full bg-white" />
                  </Pressable>
                )}
              </View>

              {/* Placeholder for symmetry / Future Flash button */}
              <View className="flex-1" />
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  darkRow: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  centerRow: {
    flexDirection: "row",
    height: width * 0.7,
  },
  darkColumn: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  viewfinder: {
    width: width * 0.7,
    position: "relative",
  },
  scanLine: {
    position: "absolute",
    top: "45%",
    shadowColor: "#159947",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "white",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 32,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 32,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 32,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 32,
  },
});
