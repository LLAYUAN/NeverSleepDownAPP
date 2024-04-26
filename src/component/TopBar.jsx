import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TopBar = () => {
  // State to manage which button is active
  const [active, setActive] = useState(null);

  // Function to render a button
  const renderButton = (text, index) => {
    return (
      <TouchableOpacity
        style={[styles.button, active === index ? styles.active : styles.inactive]}
        onPress={() => setActive(index)}
      >
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderButton('按钮1', 1)}
      {renderButton('按钮2', 2)}
      {renderButton('按钮3', 3)}
      {renderButton('按钮4', 4)}
      {renderButton('按钮5', 5)}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    height: 60, // Adjust the height as needed
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  active: {
    backgroundColor: '#007AFF',
  },
  inactive: {
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#000000',
  }
});

export default TopBar;

// import React from 'react';
// import { StyleSheet, Text, View, Button,TouchableOpacity } from 'react-native';
//
// export default function TopBar({ navigation }){
// const [isDay,setIsDay] = React.useState(true);
// const [isWeek,setIsWeek] = React.useState(false);
// const [isMonth,setIsMonth] = React.useState(false);
// return(
// <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 20}}>
//     <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
//        <Text style={styles.buttontext}>登 录</Text>
//     </TouchableOpacity>
// </View>
// )
// }
//
// const styles = StyleSheet.create({
// squareButton: {
//     backgroundColor: 'red',
//     padding: 20,
//     borderRadius: 5,
//     margin: 10,
//     width: 200,
//     alignItems: 'center',
// },
// button: {
//     backgroundColor: '#002FA7', // 按钮背景颜色
//     width: '90%', // 按钮宽度
//     height: 40, // 按钮高度
//     borderRadius: 10, // 设置圆角
//     justifyContent: 'center',
//     alignItems: 'center',
//     underlayColor: '#000F37',
//   },
//   buttontext: {
//     color: '#FFFFFF', // 文本颜色
//     fontSize: 16, // 文本大小
//     fontWeight: 'bold',
//   },
// })