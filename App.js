import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
} from "react-native";

import pokemonList from "./pokeList";

const styles = StyleSheet.create({
  mainContainer: {
    margin: 10,
    flex: 1,
  },
  container: {
    flexDirection: "row",
    marginBottom: 10,
    height: 75,
  },
  input: {
    height: 40,
    width: "100%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  pokemon: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  pokemonImg: {
    width: 75,
    height: 75,
    padding: 25,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "yellow",
  },
  pokemonText: {
    marginLeft: 20,
    fontWeight: "bold",
    color: "black",
  },
});

const capitalize = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const App = () => {
  const [search, setSearch] = useState("");
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    if (search) {
      setPokemons(
        pokemonList.filter((pokemon) => pokemon.name.includes(search))
      );
    } else {
      setPokemons(pokemonList);
    }
  }, [search]);

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Image source={require("./assets/pokelogo.png")} />

      <TextInput
        onChangeText={(newText) => setSearch(newText)}
        value={search}
        style={styles.input}
        placeholder="Ingresa el nombre del pokemon"
      />
      {pokemons.length ? (
        pokemons.map((pokemon, index) => (
          <View key={index} style={styles.pokemon}>
            <Image style={styles.pokemonImg} source={{ uri: pokemon.url }} />
            <Text style={styles.pokemonText}>{capitalize(pokemon.name)}</Text>
          </View>
        ))
      ) : (
        <View>
          <Text>No se pudo encontrar ningún Pokemon con el nombre</Text>
          <Text
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
          >{`"${search}"`}</Text>
        </View>
      )}
    </ScrollView>
  );
};
export default App;
