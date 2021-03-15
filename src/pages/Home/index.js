import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, FlatList } from 'react-native';
import * as Location from 'expo-location';

import Menu from '../../components/Menu';
import Header from '../../components/Header';
import Condition from '../../components/Condition';
import Forecast from '../../components/Forecast';
import api, { key } from '../../services/api';

const dados = [
  {
    "date": "14/03",
    "weekday": "Dom",
    "max": 28,
    "min": 18,
    "description": "Parcialmente nublado",
    "condition": "cloudly_day"
  },
  {
    "date": "15/03",
    "weekday": "Seg",
    "max": 27,
    "min": 19,
    "description": "Tempestades",
    "condition": "storm"
  },
  {
    "date": "16/03",
    "weekday": "Ter",
    "max": 28,
    "min": 19,
    "description": "Tempestades",
    "condition": "storm"
  },
  {
    "date": "17/03",
    "weekday": "Qua",
    "max": 28,
    "min": 18,
    "description": "Tempestades",
    "condition": "storm"
  },
  {
    "date": "18/03",
    "weekday": "Qui",
    "max": 27,
    "min": 18,
    "description": "Tempestades",
    "condition": "storm"
  },
  {
    "date": "19/03",
    "weekday": "Sex",
    "max": 25,
    "min": 18,
    "description": "Tempestades",
    "condition": "storm"
  },
  {
    "date": "20/03",
    "weekday": "Sáb",
    "max": 27,
    "min": 20,
    "description": "Tempestades",
    "condition": "storm"
  },
  {
    "date": "21/03",
    "weekday": "Dom",
    "max": 28,
    "min": 18,
    "description": "Tempestades isoladas",
    "condition": "storm"
  },
  {
    "date": "22/03",
    "weekday": "Seg",
    "max": 28,
    "min": 20,
    "description": "Tempo nublado",
    "condition": "cloud"
  },
  {
    "date": "23/03",
    "weekday": "Ter",
    "max": 23,
    "min": 18,
    "description": "Tempestades isoladas",
    "condition": "storm"
  }
];

export default function Home(){
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState([]);
  const [icon, setIcon] = useState({name: 'cloud', color: '#FFF'});
  const [background, setBackground] = useState(['#1ED6FF', '#97C1FF']);

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permissão negada para acessar sua localização.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();

      //https://api.hgbrasil.com/weather?key=ba513b07&lat=-23.682&lon=-46.875
      const response = await api.get(`/weather?key=${key}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);

      setWeather(response.data);

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
      setLoading(false);
    })();
  }, [])

  if (loading) {
    return(
      <View style={styles.containerLoading}>
        <Text style={styles.textLoading}>Carregando dados...</Text>
      </View>
    )
  }

  return(
    <SafeAreaView style={styles.container}>
      <Menu/>
      <Header background={background} weather={weather} icon={icon}/>
      <Condition weather={weather}/>
      <FlatList
        style={styles.list} 
        data={weather.results.forecast} 
        keyExtractor={item => item.date} 
        renderItem={({item}) => <Forecast data={item}/>}
        horizontal={true}
        contentContainerStyle={{paddingBottom: '5%'}}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F0FF',
    paddingTop: '5%'
  },
  list: {
    marginTop: 10,
    marginLeft: 10
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F0FF',
    paddingTop: '5%'
  },
  textLoading: {
    fontSize: 17,
    fontStyle: 'italic'
  }
})