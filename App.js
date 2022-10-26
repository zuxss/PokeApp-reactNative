import React, { useState, useEffect, useReft } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
  Switch,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  Modal,
  Linking,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
  Vibration,
} from "react-native";
import { WebView } from "react-native-webview";
import pokemonList from "./pokeList";

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [searchPokemons, setSearchPokemons] = useState("");
  const [pokemonBuscado, setPokemonBuscado] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTouchVisible, setModalTouchVisible] = useState(false);

  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const timingAnimation = (easing) => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
      easing,
    }).start();
  };

  const size = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const animatedStyles = [
    {
      animatedValue,
      width: size,
      height: size,
    },
  ];

  const [Url, setUrl] = useState("");

  useEffect(() => {
    setPokemons(pokemonList);
  }, []);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handleSearchChange = () => {
    setPokemonBuscado(searchPokemons);
    setLoading(true);
    if (searchPokemons === "") {
      setTimeout(() => {
        setPokemons(pokemonList);
        setLoading(false);
      }, 800);
    } else {
      setTimeout(() => {
        const filter = pokemonList.filter((p) =>
          p.name.toLowerCase().includes(searchPokemons.toLowerCase())
        );
        setPokemons(filter);
        setLoading(false);
      }, 800);
    }
  };

  const handleText = (text) => {
    setSearchPokemons(text);
  };

  const toCapLetter = function (nombre) {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  };

  const handleLink = () => {
    Linking.openURL(Url);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.containerPoke}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              timingAnimation(Easing.bounce);
              setUrl(item.url);
              setModalTouchVisible((previousState) => !previousState);
            }}
          >
            <Image source={{ uri: item.url }} style={styles.pokeImg} />
          </TouchableOpacity>
          <Text style={styles.pokeText}> {toCapLetter(item.name)}</Text>
        </View>
        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity />
          <Button
            title="Ver imagen"
            onPress={() => {
              Vibration.vibrate();
              setModalVisible((previousState) => !previousState);
              setUrl(item.url);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <View style={styles.modalView}>
            <Text
              style={{ textAlign: "center", fontSize: 18, paddingBottom: 20 }}
            >
              Si aceptas, vamos a abrir una pestaña en tu navegador, estas
              seguro?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <View style={{ marginRight: 10 }}>
                <Button title="Abrir imágen" onPress={handleLink} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Button title="Cerrar modal" onPress={setModalVisible} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={modalTouchVisible}>
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <View style={styles.webView}>
            <Animated.View style={animatedStyles}>
              <WebView source={{ uri: Url }} />
              <Button title="Cerrar" onPress={setModalTouchVisible} />
            </Animated.View>
          </View>
        </View>
      </Modal>
      <KeyboardAvoidingView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <StatusBar backgroundColor="red" />
          <Image style={styles.img} source={require("./assets/pokelogo.png")} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontStyle: "bold" }}>
            Deshabilitar búsqueda
          </Text>
          <View style={{ paddingBottom: 20 }}>
            <Switch
              onValueChange={toggleSwitch}
              style={{ paddingTop: 0, height: 30 }}
              value={isEnabled}
            />
          </View>
        </View>
        <View style={styles.container}>
          {pokemons.length ? (
            <FlatList
              data={pokemons}
              style={{ height: "67%" }}
              renderItem={renderItem}
              keyExtractor={(item) => item.name}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={searchPokemons}
                />
              }
            />
          ) : (
            <View style={styles.containerNotFind}>
              <Text style={styles}>
                No se pudo encontrar ningun Pokemon con el nombre:
              </Text>
              <Text style={styles.pokeText}>{pokemonBuscado}</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 3 }}>
            <TextInput
              style={[
                styles.input,
                (isEnabled || loading) && { backgroundColor: "gray" },
              ]}
              onChangeText={handleText}
              editable={!isEnabled}
              placeholder="Ingrese el nombre del Pokémon"
            />
          </View>
          <View>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Button
                title="Buscar"
                onPress={handleSearchChange}
                disabled={isEnabled}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    height: "100%",
    paddingTop: 40,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 40,
    padding: 10,
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
    fontSize: 15,
  },
  container: {
    width: "100%",
  },
  containerNotFind: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  pokeText: {
    fontSize: 20,
    fontStyle: "bold",
    textAlign: "center",
  },
  containerPoke: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "grey",
    paddingBottom: 10,
    paddingTop: 10,
    marginRight: 15,
    marginLeft: 15,
    borderBottomWidth: 1,
  },
  img: {
    marginBottom: 30,
    alignItems: "center",
  },
  pokeImg: {
    height: 70,
    width: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#1243AD",
    backgroundColor: "#F9D855",
    marginRight: "3%",
  },
  modalView: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    width: 300,
    height: 300,
    shadowColor: "#000",
  },

  webView: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    height: 337,
    width: 300,
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
  },
});

export default App;
