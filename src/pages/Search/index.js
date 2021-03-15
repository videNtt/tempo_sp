import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Keyboard, FlatList, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import Condition from '../../components/Condition';
import Forecast from '../../components/Forecast';
import api, { key } from '../../services/api';

export default function Search(){
  const navigation = useNavigation();

  const [input, setInput] = useState('');
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);
  const [icon, setIcon] = useState({name: 'cloud', color: '#FFF'});

  async function handleSearch() {
    const response = await api.get(`weather?key=${key}&city_name=${input}`);
    if (response.data.by === 'default') {
      setError('Hmmm, cidade não encontrada!')
      setInput('');
      setCity(null);
      Keyboard.dismiss();
      return;
    }

    setCity(response.data);
    setInput('');
    Keyboard.dismiss();

    if (response.data.results.currently === 'noite') {
      setBackground(['#0C3741', '#0F2F61']);
    }

    switch (response.data.results.condition_slug) {
      case 'clear_day':
        setIcon({name: 'partly-sunny', color: '#FFB300'})
        break;
      case 'rain':
        setIcon({name: 'rainy', color: '#FFF'})
        break;
      case 'storm':
        setIcon({name: 'rainy', color: '#FFF'})
        break;          
    }
  }

  if (city) {
    return(
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Feather
            name="chevron-left"
            size={32}
            color="#000"
          />
          <Text style={styles.text}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput 
            style={styles.textInput}
            value={input}
            onChangeText={(valor) => setInput(valor)}
            placeholder="Ex: São Paulo, SP"
          />
          <TouchableOpacity style={styles.icon} onPress={handleSearch}>
            <Feather
              name="search"
              size={22}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
        <LinearGradient
          style={styles.header}
          colors={['#1ED6FF', '#97C1FF']}
        >
          <Text style={styles.date}>{city.results.date}</Text>
          <Text style={styles.city}>{city.results.city_name}</Text>
          <Ionicons name={icon.name} color={icon.color} size={150} />
          <View>
            <Text style={styles.temp}>{city.results.temp}º</Text>
          </View>
          <Condition weather={city}/>
        </LinearGradient>
        <FlatList
            style={styles.list} 
            data={city.results.forecast} 
            keyExtractor={item => item.date} 
            renderItem={({item}) => <Forecast data={item}/>}
            horizontal={true}
            contentContainerStyle={{paddingBottom: '5%'}}
            showsHorizontalScrollIndicator={false}
          />
      </SafeAreaView>
    )
  }

  return(
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Feather
          name="chevron-left"
          size={32}
          color="#000"
        />
        <Text style={styles.text}>Voltar</Text>
      </TouchableOpacity>
      <View style={styles.searchBox}>
        <TextInput 
          style={styles.textInput}
          value={input}
          onChangeText={(valor) => setInput(valor)}
          placeholder="Ex: São Paulo, SP"
        />
        <TouchableOpacity style={styles.icon} onPress={handleSearch}>
          <Feather
            name="search"
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorMsg}>{error}</Text>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '10%',
    backgroundColor: '#E8F0FF'
  },
  backButton: {
    flexDirection: 'row',
    marginLeft: 15,
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 10
  },
  text: {
    fontSize: 22
  },
  searchBox: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDD',
    width: '90%',
    height: 50,
    borderRadius: 8
  },
  textInput: {
    width: '85%',
    height: 50,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 7,
  },
  icon: {
    width: '15%',
    backgroundColor: '#1ED6FF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  errorMsg: {
    marginTop: 25,
    fontSize: 18
  },
  header: {
    marginTop: '5%',
    width: '90%',
    paddingTop: '3%',
    paddingBottom: '3%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8
  },
  date: {
    color: '#FFF',
    fontSize: 16
  },
  city: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  temp: {
    color: '#FFF',
    fontSize: 90,
    fontWeight: 'bold'
  },
  list: {
    marginTop: 10,
    marginLeft: 10
  },
})