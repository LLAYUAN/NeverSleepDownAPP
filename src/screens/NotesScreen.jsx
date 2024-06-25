import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,FlatList, } from 'react-native';
import axios from 'axios';

const NotesScreen=({navigation})=>{
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        console.log("NoteScreen:第一次挂载");
        const getAllCourseinNote = async () => {
            await axios({
                method: 'get',
                url: 'http://192.168.116.144:8080/getAllCourseinNote'
            }).then(response => {
                console.log("NotesScreen:response.data:");
                console.log(response.data);
                if(response.data.courseInfoinNote.length === 0) {
                    setSubjects([]);
                    setIsLoading(false);
                } else {
                    const formattedSubjects = response.data.courseInfoinNote.map(course => ({
                        id: course.id, // 假设eventID是ID，转换为字符串
                        courseCode: course.courseCode,
                        courseName: course.courseName
                    }));
                    setSubjects(formattedSubjects);
                    setIsLoading(false);
                }
            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        getAllCourseinNote();
    }, []);
//todo: 从后端中获取课程数据
/*const subjects = [
  { id:'1',courseCode:'SE12321',courseName:'软件工程原理与实践'},
    { id:'2',courseCode:'SE12322',courseName:'软件需求工程'},
    { id:'3',courseCode:'SE12323',courseName:'软件设计与架构'},
    { id:'4',courseCode:'SE12324',courseName:'软件测试与质量保证'},
    { id:'5',courseCode:'SE12325',courseName:'软件项目管理'},
    { id:'6',courseCode:'SE12326',courseName:'软件工程实践'},
    { id:'7',courseCode:'SE12327',courseName:'软件工程'},
    { id:'8',courseCode:'SE12328',courseName:'软件工程专题'},
    { id:'9',courseCode:'SE12329',courseName:'软件工程专题'},
    { id:'10',courseCode:'SE12330',courseName:'软件专题'},
    { id:'11',courseCode:'SE12331',courseName:'软件工程专题'},
    { id:'12',courseCode:'SE12332',courseName:'软件工程题'},
    { id:'13',courseCode:'SE12333',courseName:'软件工程专'},
    { id:'14',courseCode:'SE12334',courseName:'软件工程专题'},
    {id:'15',courseCode:'SE12335',courseName:'软件工程专题'},
  // 可以添加更多科目
];*/
    if (isLoading) return <Text>Loading...</Text>
    return(
        <LinearGradient colors={['#72C4FF50', '#FF9E9E50']} style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={{fontSize:12,color:'white'}}>返回</Text>
                </TouchableOpacity>
                <Text style={[styles.bigText,{fontSize:24}]}>课程笔记</Text>
            </View>
            <FlatList
                    data={subjects}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => navigation.navigate('NoteDetail', { courseCode:item.courseCode,courseName:item.courseName,eventID:item.id})}
                      >
                        <View style={styles.itemContent}>
                          <Text style={styles.bigText}>{item.courseName}</Text>
                          <Text style={styles.smallText}>{item.courseCode}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
  item: {
    margin: 5,
    height: 150,
    width: 170,
    backgroundColor: '#ffffff90',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  itemContent: {
    margin: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bigText: {
    marginTop: 10,
    fontSize:18,
    color:'#002FA7',
    fontWeight: 'bold',
  },
  smallText: {
    marginTop: 10,
    fontSize: 15,
  },
  topContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton:{
    backgroundColor: '#002FA7', // 按钮背景颜色
    width: 50, // 按钮宽度
    height: 30, // 按钮高度
    borderRadius: 5, // 设置圆角
    justifyContent: 'center',
    alignItems: 'center',
    underlayColor: '#000F37',
    position: 'absolute',
    left: 30,
    top: 23,
  },
});

export default NotesScreen;