/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, ImageBackground, ActivityIndicator, StatusBar} from 'react-native';

import {fetchLocationId, fetchWeather} from './utils/api'
import getImageForWeather from './utils/getImageForWeather';
import SearchInput from './components/SearchInput';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      location: '',
      temperature: 0,
      weather: '',
    };
  }

  handleUpdateLocation = city => {
    if (!city) return;
    this.setState( { loading: true }, async ()=>{
      try{
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(locationId);

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
        });
      }catch(e) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };

  componentDidMount() {
    this.handleUpdateLocation('San Francisco');
  }

  render() {
    const {loading, error, location, weather, temperature} = this.state;
    return (
      <View style={styles.container} behavior="padding">
      <StatusBar barStyle="light-content" backgroundColor="transparent"/>
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}>
            <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" style="large"/>

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try a different city
                  </Text>
                )}

                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
                    <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                    <Text style={[styles.largeText, styles.textStyle]}>{`${Math.round(temperature)}°
`}</Text>
                  </View>
                )}
                  <SearchInput placeholder="Search any city" onSubmit={this.handleUpdateLocation}/>
              </View>
            )}
               
              
            </View>
          </ImageBackground>
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//   },
//   textStyle: {
//     textAlign: 'center',
//     fontFamily: Platform.OS=='ios' ? 'AvenirNext-Regular' : 'Roboto'
//   },
//   largeText: {
//     fontSize: 44,
//   },
//   smallText: {
//     fontSize: 18,
//   }
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  textStyle: {
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'AvenirNext-Regular'
      },
      android: {
        fontFamily: 'Roboto'
      }
    }),
    color: 'white'
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  textInput: {
    backgroundColor: "#666",
    color: "white",
    height: 40,
    width: 300,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    alignSelf: 'center'
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: null,
    height: null,
    resizeMode: "cover",
    flex: 1
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  }
});
