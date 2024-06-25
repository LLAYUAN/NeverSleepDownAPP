import React, {useEffect} from 'react';
import { View, Text, Button ,TextInput,TouchableOpacity,Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import { check, request, PERMISSIONS, RESULTS,checkNotifications, } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import axios from 'axios';
import {response} from "../../.yarn/releases/yarn-1.22.22";


const NoteDetailScreen = ({ route,navigation}) => {
    const courseCode = route.params?.courseCode;
    const courseName = route.params?.courseName;
    const eventID = route.params?.eventID;
    console.log("NoteDetailScreen:courseCode:",courseCode);
    console.log("NoteDetailScreen:courseName:",courseName);
    console.log("NoteDetailScreen:eventID:",eventID);

    const [isLoading, setIsLoading] = useState(true);
    const [initText, setInitText] = useState( "<div>default从后端拿来的笔记\</div>");
    const [text, setText] = useState("<div>default从后端拿来的笔记\</div>");
    const richText = React.useRef();
    useEffect(() => {
        const getDetailedNote = async () => {
            await axios({
                method: 'post',
                url: 'http://192.168.116.144:8080/getOneCourseNote',
                data: {
                    courseCode: courseCode,
                    eventID: eventID
                }
            }).then(response => {
                console.log("NoteDetailScreen:response.data:");
                console.log(response.data);
                setInitText(response.data.note);
                setIsLoading(false);
            }).catch(error => {
                console.error('Error fetching data:', error);
            })
        }
        getDetailedNote();
    }, []);

//todo:但凡change就要去存到后端（自动保存嗯嗯
    const handleTextChange = (text) => {
        console.log(text);
        setText(text);
    };

    useEffect(() => {
        console.log("NoteDetailScreen:text:");
        console.log(text);
    }, [text]);

//       const selectImage = () => {
//         launchImageLibrary({}, (response) => {
//           if (response.assets) {
//             const imageUri = response.assets[0].uri;
//             setContent((prevContent) => `${prevContent}\n![Image](${imageUri})\n`);
//           }
//         });
//       };

    const requestPermission = async (permission) => {
        const result = await request(permission);
        return result === RESULTS.GRANTED;
    };

    const checkAndRequestPermissions = async () => {
        //const cameraPermission = await requestPermission(PERMISSIONS.ANDROID.CAMERA);
        const resultImages = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        const resultVideos = await request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);

        if (!resultImages) {
            Alert.alert('Permission Denied', 'We need your permission to access your camera and photo library.');
            return false;
        }
        return true;
    };

    const handleImageUpload = async () => {
        const hasPermission = await checkAndRequestPermissions();
        if (!hasPermission) {
            return;
        }

        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
            });

            if (result.didCancel) {
                console.log('User cancelled image picker');
            } else if (result.errorCode) {
                console.error('ImagePicker Error: ', result.errorCode);
            } else {
                const imageUri = result.assets[0].uri;

                // Log the image URI to debug the issue
                console.log('Image URI:', imageUri);

                // Convert image to base64
                const base64Image = await RNFS.readFile(imageUri, 'base64');
                const imageTag = `<img src="data:image/jpeg;base64,${base64Image}" style="max-width: 100%;height: auto;" />`;

                // Insert the base64 image into the RichEditor
                richText.current.insertHTML(imageTag);
                richText.current.insertHTML('<div><br></div>');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDone = async ()=> {
        await axios({
            method: 'post',
            url: 'http://192.168.116.144:8080/saveOneCourseNote',
            data: {
                text: text,
                eventID: eventID
            }
        }).then(response => {
            navigation.reset({
                index: 1,
                routes: [{ name: 'Home' }, { name: 'Notes' }],
            })
        }).catch(error => {
            console.error('Error fetching data:', error);
        })
    }

    if (isLoading) return <Text>Loading...</Text>
    //todo: save note
    // const richText = React.useRef();
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.Button} onPress={() => navigation.reset({
                    index: 1,
                    routes: [{ name: 'Home' }, { name: 'Notes' }],
                })
                }>
                    <Text style={{fontSize:12,color:'white',fontWeight:'bold'}}>所有笔记</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{courseName}</Text>
                <TouchableOpacity style={styles.Button} onPress={handleDone}>
                    <Text style={{fontSize:12,color:'white',fontWeight:'bold'}}>完  成</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>

                <RichEditor
                    ref={richText}
                    initialContentHTML={initText}
                    onChange={ descriptionText => {
                        handleTextChange(descriptionText);
                    }}
                />
            </ScrollView>

            <RichToolbar
                getEditor={() => richText.current}
                actions={[
                    actions.keyboard,
                    actions.heading1,

                    actions.setBold,
                    actions.setItalic,
                    actions.setStrikethrough,
                    actions.setUnderline,

                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.checkboxList,
                    actions.insertImage,
                    actions.insertLink,

                    actions.code,
                    actions.blockquote,

                    actions.alignLeft,
                    actions.alignCenter,
                    actions.alignRight,

                    actions.line,

                    actions.undo,
                    actions.redo,
                ]}
                iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>),
                }}
                onPressAddImage={handleImageUpload}
                x/>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        itemAlign: 'center',
    },

    title:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#002FA7',
    },
    Button:{
        backgroundColor: '#002FA7', // 按钮背景颜色
        width: 60, // 按钮宽度
        height: 30, // 按钮高度
        borderRadius: 5, // 设置圆角
        justifyContent: 'center',
        alignItems: 'center',
        underlayColor: '#000F37',
    },
    topContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
    },
});

export default NoteDetailScreen;