import {CameraView,Camera, useCameraPermissions} from "expo-camera";
import { useEffect, useState } from "react";
import { Button, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const BarCodeScanner = ({ onBarCodeScanned, isVisible, onClose }) => {

  const {t} = useTranslation();

        //barcode
    // const [permission, requestPermission] = useCameraPermissions();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);


    useEffect(() => {
        (async () => {
        
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);


    const handleBarCodeScanned = (type, data) => {

      if (scanned) {
        return;
      }
      setScanned(true);
      

      if (onBarCodeScanned) {
        onBarCodeScanned(type.data, type.type);
      }
        
        // Alert.alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        // if (onBarCodeScanned) {
        //     onBarCodeScanned(type, data); // Lähetä skannattu data ProductsData-komponentille
        // }
    };



      if (hasPermission === null) {
        return <Text>{t('barCodeScanner-request-permission')}</Text>;
      }
      if (hasPermission === false) {
        return <Text>{t('barCodeScanner-camera-no-access')}</Text>;
      }

      return (

        <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>

          <SafeAreaView style={styles.containerS}>
            <View style={styles.modalView}>
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  facing="back"
                  onBarcodeScanned={handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ['aztec', 'ean13', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a'],
                  }}
                />
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#f5f5f5" />
              </TouchableOpacity>

              {scanned && <Button title={t('barCodeScanner-scanAgain')} onPress={() => setScanned(false)} />}
            </View>
          </SafeAreaView>
        </Modal>
      )

}

const styles = StyleSheet.create({
  containerS: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Lisätään taustan läpinäkyvyyttä
  },
  modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      paddingVertical: 35,
      paddingHorizontal: 55,
      width: '90%', // Muutetaan modaalin leveys suhteessa ruutuun
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
  cameraContainer: {
      width: '100%',
      height: 300, // Asetetaan kameranäkymän korkeudeksi 300px
      overflow: 'hidden', // Estetään kameranäkymän ulkoneminen containerista
      borderRadius: 10, // Lisätään pyöristetyt kulmat
  },
  camera: {
      width: '100%',
      height: '100%',
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
    backgroundColor: "#5656e2",
    borderTopRightRadius: 20,
  },
})


export default BarCodeScanner;