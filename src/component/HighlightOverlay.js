import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HighlightOverlay = ({ x, y, width, height }) => {
  return (
    <View style={styles.overlay}>
      <View style={[styles.highlight, { top: y, left: x, width, height }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 0, // Ensure the overlay is behind the modal
  },
  highlight: {
    position: 'absolute',
    borderColor: '#FFB8BE',
    borderWidth: 5,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
});

export default HighlightOverlay;
