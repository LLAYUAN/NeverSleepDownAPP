import React, { useState,useEffect} from 'react';
import { View, TouchableOpacity, Text, StyleSheet,Image} from 'react-native';

const TopBar = ({navigation,active}) => {
  // State to manage which button is active

const handleRenderPress = (index) => {
    if (index === 2) {
            navigation.navigate('Month');
        } else if (index === 3) {
            navigation.navigate('Week');
        } else if (index === 4) {
            navigation.navigate('Day');
        }
};
  // Function to render a button
  const renderButton = (text, index) => {
    return (
      <TouchableOpacity
        style={[styles.button, active === index ? styles.active : styles.inactive]}
        onPress={() => handleRenderPress(index)}
      >
        <Text style={active === index ? styles.textActive : styles.textInactive}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.squareStyle}
          >
          <Image source={require('../image/menu-burger.png')} style={styles.icon}/>
        </TouchableOpacity>
        <View style={{flexDirection:'row',justifyContent:'space-between',width:200}}>
            {renderButton('月', 2)}
            {renderButton('周', 3)}
            {renderButton('日', 4)}
        </View>

        <TouchableOpacity
          style={styles.squareStyle}
            onPress={() => navigation.navigate('Add')}
        >
           <Image source={require('../image/add.png')} style={styles.icon}/>
        </TouchableOpacity>

    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    height: 60, // Adjust the height as needed
  },
  button: {
    height:40,
    width:60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#002FA7',
  },
  inactive: {
    backgroundColor: '#FFFFFF',
  },
  textActive: {
    color: '#FFFFFF',
  },
  textInactive: {
      color: '#000000',
    },

  squareStyle: {
    width: 30,
    height: 30,
    backgroundColor: '#002FA7',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon:{
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});

export default TopBar;
