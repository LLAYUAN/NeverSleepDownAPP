import React, { useState,useEffect} from 'react';
import { View, TouchableOpacity, Text, StyleSheet,Image} from 'react-native';
import MenuModal from './MenuModal';
import AiModal from './AiModal';
import MenuHelpModal from '../component/MenuHelpModal';
import AsyncStorage from "@react-native-community/async-storage";

const TopBar = ({navigation,active}) => {
    const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
    const [shouldHelpModalVisible, setShouldHelpModalVisible] = useState(false);
    useEffect(() => {
        const fetchisFirstLogin = async () => {
            await AsyncStorage.getItem('isFirstLogin', (error, result) => {
                if (error) {
                    console.error('Error reading from AsyncStorage:', error);
                } else {
                    const isFirstLogin = JSON.parse(result);
                    console.log("TopBar:isFirstOpenMenu loaded from AsyncStorage:", isFirstLogin);
                    if (isFirstLogin) {
                        setShouldHelpModalVisible(true);
                    }
                }
            });
        };
        fetchisFirstLogin();
    }, []);

    const toggleHelpModal = async () => {
        setShouldHelpModalVisible(false);
        setIsHelpModalVisible(false);
        console.log("toggleHelpModal");
        await AsyncStorage.setItem('isFirstLogin', JSON.stringify(false));
    };
  // State to manage which button is active
  const [modalVisible, setModalVisible] = useState(false);

    const [isAiModalVisible, setAiModalVisible] = useState(false);
    const toggleAiModal = () => {
        setAiModalVisible(!isAiModalVisible);
    };


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
        {/*<TouchableOpacity*/}
        {/*    onPress={() => setModalVisible(true)}*/}
        {/*    style={styles.squareStyle}*/}
        {/*  >*/}
        {/*  <Image source={require('../image/menu-burger.png')} style={styles.icon}/>*/}
        {/*</TouchableOpacity>*/}

        <AiModal isVisible={isAiModalVisible} onClose={toggleAiModal} />
        {/*         update */}
        <TouchableOpacity
            onPress={() =>{
                setModalVisible(true);
                //todo:判断用户是不是第一次点击这个的按钮，是的话设置为true
                //setIsHelpModalVisible(true);
                console.log("shouldHelpModalVisible",shouldHelpModalVisible);
                if (shouldHelpModalVisible) setIsHelpModalVisible(true);
            } }
            style={styles.squareStyle}
        >
            <Image source={require('../image/menu-burger.png')} style={styles.icon}/>
        </TouchableOpacity>

          <MenuModal
            navigation={navigation}
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
          />

        <View style={{flexDirection:'row',justifyContent:'space-between',width:200}}>
            {renderButton('月', 2)}
            {renderButton('周', 3)}
            {renderButton('日', 4)}
        </View>

{/*UPDATE*/}
        <TouchableOpacity
            style={styles.ai}
            onPress={() => setAiModalVisible(true)}
        >
            <Image source={require('../image/cloud-question.png')} style={styles.icon}/>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.squareStyle}
            onPress={() => navigation.reset({
                    index: 1,
                    routes: [{ name: 'Home' }, { name: 'Add' }],
                })
            }
        >
           <Image source={require('../image/add.png')} style={styles.icon}/>
        </TouchableOpacity>

        {/*     update */}
        <MenuHelpModal isVisible={isHelpModalVisible} onClose={toggleHelpModal} />

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
    ai:{
        position: 'absolute',
        left: 40,
        top: 15,
        width: 30,
        height: 30,
        backgroundColor: '#002FA7',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TopBar;
