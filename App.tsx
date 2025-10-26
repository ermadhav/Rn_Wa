import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getCoordinates, getForecast } from './weatherApi';

export default function App() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) {
      Alert.alert('Please enter a city name');
      return;
    }
    setLoading(true);
    setForecast(null);

    const coords = await getCoordinates(city);
    if (coords) {
      const data = await getForecast(coords.lat, coords.lon);
      if (data) {
        setForecast(data);
      } else {
        Alert.alert('Error', 'Could not fetch weather data.');
      }
    } else {
      Alert.alert('City not found', 'Please check the city name.');
    }
    setLoading(false);
  };

  const renderDay = ({ item }) => {
    const date = new Date(item.date);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    return (
      <View style={styles.card}>
        <Text style={styles.day}>{day}</Text>
        <Image
          source={{ uri: `https:${item.day.condition.icon}` }}
          style={styles.icon}
        />
        <Text style={styles.temp}>{Math.round(item.day.maxtemp_c)}°C</Text>
        <Text style={styles.desc}>{item.day.condition.text}</Text>
      </View>
    );
  };

  const isDay = forecast?.current?.is_day === 1;
  const bgGradient = isDay
    ? ['#89f7fe', '#66a6ff'] // Day Gradient
    : ['#0f2027', '#203a43', '#2c5364']; // Night Gradient

  return (
    <LinearGradient colors={bgGradient} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.title}>🌦️ Weather Forecast</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search city..."
            placeholderTextColor="#cfd8dc"
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity style={styles.button} onPress={fetchWeather}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
        )}

        {forecast?.current && forecast?.forecast?.forecastday && (
          <View style={styles.weatherContainer}>
            <Text style={styles.location}>
              {forecast.location?.name}, {forecast.location?.country}
            </Text>

            <Image
              source={{ uri: `https:${forecast.current.condition.icon}` }}
              style={styles.bigIcon}
            />
            <Text style={styles.currentTemp}>
              {Math.round(forecast.current.temp_c)}°C
            </Text>
            <Text style={styles.description}>
              {forecast.current.condition.text}
            </Text>

            <View style={styles.extraInfo}>
              <Text style={styles.infoText}>💧 {forecast.current.humidity}%</Text>
              <Text style={styles.infoText}>💨 {forecast.current.wind_kph} km/h</Text>
              <Text style={styles.infoText}>☁️ {forecast.current.cloud}%</Text>
            </View>

            <Text style={styles.weekHeader}>7-Day Forecast</Text>

            <FlatList
              data={forecast.forecast.forecastday.slice(0, 7)} // 7 days
              renderItem={renderDay}
              keyExtractor={(item) => item.date}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    marginVertical: 15,
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  weatherContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  location: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  bigIcon: {
    width: 120,
    height: 120,
    marginVertical: 8,
  },
  currentTemp: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    color: '#f1f1f1',
    fontSize: 20,
    textTransform: 'capitalize',
  },
  extraInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
  },
  weekHeader: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 6,
    alignItems: 'center',
    width: 95,
    backdropFilter: 'blur(10px)',
  },
  day: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  icon: {
    width: 50,
    height: 50,
    marginVertical: 6,
  },
  temp: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  desc: {
    color: '#e0e0e0',
    fontSize: 13,
    textAlign: 'center',
  },
});
