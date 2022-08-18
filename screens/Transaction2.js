import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domState: "normal",  // está modo de scáner 
      hasCameraPermissions: null,  //sabremos si el usuario ha otorgado permisos de cámara
      scanned: false,      //sabremos si el usuario ha otorgado permisos de cámara a la app
      scannedData: ""      //obtendremos los datos escaneados después de scanear
    };
  }

  //Función para solicitar permiso de la cámara, asíncrona porque necesitamos esperar respuesta
  getCameraPermissions = async domState => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);  //puede solicitar varios permisos
    
    this.setState({
      /*status === "granted" es true cuando el usuario ha dado permiso
        status === "granted" es false cuando el usuario no ha dado permiso
        */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false
    });
  };

  //obtiene los datos y los muestra dentro de un texto
  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({
      scannedData: data,
      domState: "normal",
      scanned: true
    });
  };

  render() {
    const { domState, hasCameraPermissions, scannedData, scanned } = this.state;
    if (domState === "scanner") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {hasCameraPermissions ? scannedData : "Solicitar permiso de la cámara"}
        </Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 25 }]}
          onPress={() => this.getCameraPermissions("scanner")}
        >
          <Text style={styles.buttonText}>Escanear código QR</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5653D4"
  },
  text: {
    color: "#ffff",
    fontSize: 15
  },
 
});
