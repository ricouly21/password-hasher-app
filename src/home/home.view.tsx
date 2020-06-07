import { v1 as uuidv1 } from "react-native-uuid";
import { v4 as uuidv4 } from "react-native-uuid";

import React from "react";
import {
  Platform,
  TextInput,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import {
  CRYPTO_PEPPER,
  CRYPTO_ALGORITHM,
} from "react-native-dotenv";


const styles = StyleSheet.create(
  {
    container: {
      backgroundColor: "#fff",
      flex: 1.0,
    },
    containerTransparent: {
      backgroundColor: "transparent",
      flex: 1.0,
    },
    contentContainerStyle: {
      // backgroundColor: "#ccc",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
    },

    textInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 16,
    },
    textInputDefault: {
      backgroundColor: "white",
      width: "75%",
      height: 30,
      marginVertical: 16,
      paddingHorizontal: 2,
      borderWidth: 1.0,
      textAlign: "center",
    },
  }
)


function generateUUID() {
  let randomString = uuidv4();
  let tempList = randomString.split("-")
  randomString = tempList.join("")
  
  return randomString
}


class HomeView extends React.Component {
  constructor(props) {
    super(props)

    this.encryptString = this.encryptString.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onChangeSalt = this.onChangeSalt.bind(this);

    this.state = {
      form: {
        originalString: null,
        salt: null,
        hashedValue: null,
      }
    }
  }

  async encryptString() {
    /*
    * SHA1 is vulnerable and should not be used.
    * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#SHA-1
    SHA1 = "SHA-1",
    SHA256 = "SHA-256",
    SHA384 = "SHA-384",
    SHA512 = "SHA-512",

    * MD* is not supported on web.
    * message-digest algorithms shouldn't be used for creating secure digests.
    MD2 = "MD2",
    MD4 = "MD4",
    MD5 = "MD5"
    */

    // Set these values in .env file
    let pepper = CRYPTO_PEPPER;
    let algorithm = CRYPTO_ALGORITHM;

    // Current state values
    let formData = this.state.form
    let val = formData.originalString
    let salt = formData.salt;
    let hashedValue = null

    if (val && val !== '' && algorithm) {
      let valTohash = `${val}${salt}${pepper}`;

      hashedValue = await Crypto.digestStringAsync(
        algorithm,
        valTohash,
      )
    }

    formData.hashedValue = hashedValue
    this.setState({ form: formData })

    console.log("\n\n")
    console.log("formData: ", formData)
    console.log("pepper: ", pepper)

    return (hashedValue !== '') ? hashedValue : null;
  }

  onChangeSalt(val) {
    let formData = this.state.form;
    formData.salt = (val !== '') ? val : null;
    this.setState({ form: formData });

    this.encryptString()
  }

  onChangeText(val) {
    let formData = this.state.form;
    formData.originalString = (val !== '') ? val : null;
    this.setState({ form: formData });

    this.encryptString()
  }

  render() {
    const formData = this.state.form
    const hashedValue = formData.hashedValue

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.containerTransparent}
          contentContainerStyle={styles.contentContainerStyle}>

          <View style={styles.textInputContainer}>
            <TextInput
              style={[styles.textInputDefault, { marginRight: 8 }]}
              placeholder={"Enter text here"}
              selectionColor={(Platform.OS === "android") ? "rgba(0,0,0,0.3)" : "black"}
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={this.onChangeText}
              value={formData.originalString}>
            </TextInput>
            <TouchableOpacity
              onPress={() => this.onChangeText(generateUUID())}>
              <Ionicons name="md-refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.textInputContainer}>
            <TextInput
              style={[styles.textInputDefault, { marginRight: 8 }]}
              placeholder={"Enter cryptographic salt here"}
              selectionColor={(Platform.OS === "android") ? "rgba(0,0,0,0.3)" : "black"}
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={this.onChangeSalt}
              value={formData.salt}>
            </TextInput>
            <TouchableOpacity
              onPress={() => this.onChangeSalt(generateUUID())}>
              <Ionicons name="md-refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Text
            style={{ textAlign: "center" }}>
            {`Hashed value (using ${CRYPTO_ALGORITHM}): `}
          </Text>
          <Text
            style={{ textAlign: "center" }}
            selectable={true}>
            {`${hashedValue}`}
          </Text>

        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}


export default HomeView
