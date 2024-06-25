import PushNotification from "react-native-push-notification";
import axios from 'axios';
import AsyncStorage from "@react-native-community/async-storage";
import {Alert} from "react-native";

const scheduleNotifications = (notifications) => {
    //先清空所有的通知
    PushNotification.cancelAllLocalNotifications();

    const currentTime = new Date(); // 获取当前时间
    currentTime.setMinutes(currentTime.getMinutes() - 10);
    if (notifications) {
        notifications.forEach(notification => {
            const { notificationName, notificationTime } = notification;
            const notificationDate = new Date(notificationTime);

            // 将通知时间提前10分钟
            notificationDate.setMinutes(notificationDate.getMinutes() - 10);

            // 重新安排通知
            if (notificationDate > currentTime) {
                PushNotification.localNotificationSchedule({
                    channelId: "default-channel-id",
                    title: "NSD日程小助手",
                    message: notificationName + "即将开始", // 使用名字作为消息内容
                    date: notificationDate, // 设置提前10分钟的通知时间
                    allowWhileIdle: true, // 允许在休眠时触发
                });
            }
        });
    }


    PushNotification.getScheduledLocalNotifications((notifications) => {
        console.log('ALL Scheduled Notifications:', notifications);
    });
};

const getAndscheduleNotifications = async () => {
    let notificationArr = [];
    await axios({
        method: 'get',
        url: 'http://192.168.116.144:8080/loadNotification',
    }).then(response => {
        console.log("getAndscheduleNotifications:response:");
        console.log(response.data);
        notificationArr = response.data.notifications;
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
    Alert
    scheduleNotifications(notificationArr);
}

export default getAndscheduleNotifications;