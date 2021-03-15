import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { condition } from '../../utils/condition';

export default function Forecast({data}) {

  let icon = condition(data.condition);

  return(
    <View style={styles.container}>
      <Text style={styles.date}>{data.date}</Text>
      <Ionicons name={icon.name} size={25} color={icon.color}/>
      <View style={styles.temp}>
        <Text style={styles.tempMin}>{data.min}º</Text>
        <Text style={styles.tempMax}>{data.max}º</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    marginLeft: 12,
    borderRadius: 8,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  date: {
    fontSize: 14
  },
  temp: {
    alignItems: 'center',
  },
  tempMin: {

  },
  tempMax: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})