import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Cookies } from 'react-native-cookies';
import CookieManager from 'react-native-cookies';
import {response} from "../../.yarn/releases/yarn-1.22.22";
import getAndscheduleNotifications from "../service/getAndscheduleNotifications";


const WebViewScreen = ({ route }) => {
    const { url } = route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleOpenURL = async (event) => {
            const { url } = event;
            console.log('Received URL:', url); // 添加日志
            if (url.startsWith('myapp://callback')) {
                console.log('Handling callback URL'); // 添加日志
                //const code = new URLSearchParams(url.split('?')[1]).get('code');
                const codeMatch = url.match(/code=([^&]*)/);
                const code = codeMatch ? codeMatch[1] : null;
                console.log('Code:', code); // 添加日志
                if (code) {
                    try {
                        /*const response = await axios.get(`http://192.168.116.144:8080/RequestAccessToken?code=${code}`);
                        const accessToken = response.data;
                        console.log('Access Token:', accessToken);
                        await AsyncStorage.setItem('accessToken', accessToken);
                        console.log('Access Token saved to AsyncStorage'); // 添加日志*/
                        await axios({
                            method: 'get',
                            url: `http://192.168.116.144:8080/RequestAccessToken?code=${code}`,
                        }).then(response => {
                            console.log("response.data:");
                            console.log(response.data);
                            //console.log(JSON.stringify(response.data));
                            if (response.data.code && response.data.data) {
                                if (response.data.data.isLogin) {
                                    console.log("cookies:");
                                    console.log(response.data.data.cookie);
                                    AsyncStorage.setItem('cookie', response.data.data.cookie);
                                    console.log("tabledata:");
                                    console.log(response.data.data);
                                    AsyncStorage.setItem('tabledata', JSON.stringify(response.data.data));
                                    AsyncStorage.setItem('isFirstLogin', JSON.stringify(response.data.data.isFirstLogin));
                                    AsyncStorage.setItem('course',JSON.stringify(false));
                                    AsyncStorage.setItem('accessToken',JSON.stringify(response.data.token));
                                    navigation.navigate('Home');
                                } else {
                                    console.log("isLogin = false!!!");
                                    Alert.alert(
                                        '登录失败', // 标题
                                        '用户名或密码错误，请重试', // 内容
                                        [
                                            {
                                                text: '确定', // 按钮文本
                                                onPress: () => {
                                                    // 用户点击确定后执行的操作
                                                    setUsername(''); // 重置用户名输入框
                                                    setPassword(''); // 重置密码输入框
                                                }
                                            },
                                        ],
                                        { cancelable: false } // 禁止通过按返回键或点击遮罩来取消
                                    );
                                }
                            } else {
                                console.error("Error: code is 0!");
                            }
                        }).catch(error => {
                            console.error('Error fetching data:', error);
                        });
                        //设置提醒
                        getAndscheduleNotifications();
                        // 成功后导航到Home页面或其他页面
                        //navigation.navigate('Home');
                    } catch (error) {
                        console.error('Error fetching access token:', error);
                        Alert.alert('Error', 'Error fetching access token. Please try again.');
                    }
                }
            }
        };

        Linking.addEventListener('url', handleOpenURL);

        return () => {
            Linking.removeEventListener('url', handleOpenURL);
        };
    }, [navigation]);

    // 使用 Linking.getInitialURL() 来处理应用启动时的 URL
    useEffect(() => {
        const getInitialURL = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                handleOpenURL({ url: initialUrl });
            }
        };

        getInitialURL();
    }, []);

    // const clearAllCookies = async () => {
    //     try {
    //         await Cookies.clearAll();
    //         console.log('Cookies cleared');
    //     } catch (error) {
    //         console.error('Failed to clear cookies:', error);
    //     }
    // };

    const clearAllCookies = async () => {
        try {
            await CookieManager.clearAll();
            console.log('Cookies cleared');
        } catch (error) {
            console.error('Failed to clear cookies:', error);
        }
    };

    useEffect(() => {
        console.log("clearAllCookies");
        clearAllCookies();
    }, [url]);

    return (
        <View style={{ flex: 1 }}>
            {loading && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={{ position: 'absolute', top: '50%', left: '50%' }}
                />
            )}
            <WebView
                source={{ uri: url }}
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
            />
        </View>
    );
};

export default WebViewScreen;
