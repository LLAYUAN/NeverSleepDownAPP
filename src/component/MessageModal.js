import React, { useState } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity  } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

const MessageModal = ({ title,message,isVisible, onClose,onOk }) => {

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={0.7}
      style={styles.modal}
    >
      <LinearGradient colors={['#FF9E9E20', '#FF9E9E60']} style={styles.modalContent}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>

        <View style={{width:'90%',flexDirection: 'row',justifyContent:'space-between'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>
            取消
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={onOk}
        >
          <Text style={styles.buttonText}>
            确定
          </Text>
        </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject, // Ensure the modal covers the whole screen
  },
  modalContent: {
    width: '80%',
//    height: '20%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1, // Ensure the modal content is above the highlight overlay
    justifyContent: 'center',

  },
  messageText: {
    marginBottom: 20,
    fontSize: 18,

  },
    button: {
      backgroundColor: '#002FA7', // Set your desired button color here
       marginTop: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    buttonText: {
        fontWeight:'bold',
        color: 'white',
        fontSize: 16,
    },
    titleText: {
        color: '#002FA7',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default MessageModal;
