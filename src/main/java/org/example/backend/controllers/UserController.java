package org.example.backend.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.example.backend.model.*;
import org.example.backend.service.EventTableService;
import org.example.backend.service.*;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.AuthenticationException;

import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

@RestController
//@CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
public class UserController {
    /*
    处理所有登录、密码修改相关的请求
    TODO：
        isPasswordCorrect 去数据库中检查密码是否正确，done,需要找到默认的table，如果没有coursetimetable要给他创建一个
        addUserToDatabase 进行注册时，将用户信息添加到数据库,done
        addUserInfo 用户信息界面，点击保存后对于非用户名、密码的用户信息直接进行修改,done
        modifyPassword 用户信息界面支持修改密码的操作 done
        getUserInfo 显示个人信息页面的内容返回 done
    */

    @Autowired
    private UserService userService;

    @Autowired
    private EventTableService eventTableService;

    @Autowired
    private CourseTimeTableService courseTimeTableService;

    @PostMapping("/isPasswordCorrect")
    public ResponsetoisPasswordCorrect isPasswordCorrect(@RequestBody Map<String,Object> userData) {
        final Logger log = Logger.getLogger(UserController.class.getName());
//        log.info("receive isPasswordCorrect");
        String userID = (String) userData.get("userID");
        String password = (String) userData.get("password");
        int tableID = 0;
        ResponsetoisPasswordCorrect response = new ResponsetoisPasswordCorrect();
        response.setCode(1);
        User user = userService.isPasswardCorrect(userID, password);
        EventTable defaulteventTable = null;
//        log.info("to here");
        if(user!=null){//如果正确
            Set<EventTable> eventTables = userService.getEventTablesByuserID(userID);
            if(eventTables.isEmpty()) {//如果user下面一张表都没有
//                log.info("no table");
                defaulteventTable = new EventTable();
                defaulteventTable.setUser(user);
                defaulteventTable.setDefaultTable(true);
                eventTableService.saveEventTable(defaulteventTable);
                tableID = defaulteventTable.getTableID();
                //courseTimeTable和eventTable一一对应，所以eventtable的创建、删除要与courseTimeTable绑定
                CourseTimeTable courseTimeTable = new CourseTimeTable();
                courseTimeTable.setEventTable(defaulteventTable);
                courseTimeTableService.save(courseTimeTable);
            }
            else {
                //找到第一个default值为true的表
                for(EventTable eventTable : eventTables) {
                    if(eventTable.getDefaultTable()) {
                        tableID = eventTable.getTableID();
                        defaulteventTable = eventTable;
                        break;
                    }
                }
            }

            String cookieValue = "userID="+ userID + ";tableID=" + tableID; // 将 userID 和 tableID 拼接成一个字符串
            response.setData(true, user.getIsFirstLogin(),tableID,cookieValue,defaulteventTable.getTableName(),defaulteventTable.getBackground(),defaulteventTable.getFont(),defaulteventTable.getCourseColor(),defaulteventTable.getEventColor(),MyUtils.dateToString(defaulteventTable.getFirstDayDate()),defaulteventTable.getWeekAmount(),defaulteventTable.getCourseTimeTable());
            if(user.getIsFirstLogin()){
                user.setIsFirstLogin(false);
                userService.saveUser(user);
            }
        }
        else {
            response.setFailureData(false, 0,null);
        }
        return response;
//        return "passwordCorrect";
    }

    @PostMapping("/addUsertoDatabase")
    public ResponsetoaddUsertoDatabase addUserToDatabase(@RequestBody Map<String,Object> userData) {
        //先搜索username在数据库中是否存在，如果存在则返回错误信息
        final Logger log = Logger.getLogger(UserController.class.getName());
        String userID = (String) userData.get("userID");
        String password = (String) userData.get("password");

        User user = new User();
        user.setUserID(userID);
        user.setPassword(password);
        ResponsetoaddUsertoDatabase response = new ResponsetoaddUsertoDatabase();
        log.info("to here 0");
        if(userService.saveUser(user)) {
            response.setData(true);
            response.setCode(1);
            EventTable eventTable = new EventTable();
            eventTable.setTableName("工作表1");
            eventTable.setUser(user);
            eventTable.setDefaultTable(true);
            eventTableService.saveEventTable(eventTable);
            //courseTimeTable和eventTable一一对应，所以eventtable的创建、删除要与courseTimeTable绑定
            CourseTimeTable courseTimeTable = new CourseTimeTable();
            courseTimeTable.setEventTable(eventTable);
            courseTimeTableService.save(courseTimeTable);
        }
        else {
            response.setData(false);
        }
        return response;
    }

    @PostMapping("/addUserInfo")
    public void addUserInfo(@RequestHeader(value="Cookie") String cookie,
                              @RequestBody Map<String,Object> requestBody) {
        String userID = null;
//        Integer tableID = 0;
        String userName = (String) requestBody.get("userName");
        boolean userGender = (boolean) requestBody.get("userGender");//0为男，1为女
        String userLocation = (String) requestBody.get("userLocation");
        String AvatarURL = (String) requestBody.get("AvatarURL");
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        userID = cookieInfo[0];
//        tableID = Integer.parseInt(cookieInfo[1]);
        User user = userService.getUserByUserID(userID);
        user.setUserName(userName);
        user.setUserGender(userGender);
        user.setUserLocation(userLocation);
        user.setAvatarURL(AvatarURL);
        userService.updateUser(user);
//        return "addUserInfo";
    }

    @PostMapping("/modifyPassword")
    public ResponsetomodifyPassword modifyPassword(@RequestHeader(value="Cookie") String cookie,
                                                   @RequestBody Map<String,Object> requestBody) {
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        String oldPassword = (String) requestBody.get("oldPassword");
        String newPassword = (String) requestBody.get("newPassword");
        User user = userService.isPasswardCorrect(userID, oldPassword);
        ResponsetomodifyPassword response = new ResponsetomodifyPassword();
        response.setCode(1);
        //先检查该用户的用户名和密码是否正确
        if(user!=null){
            if(oldPassword.equals(newPassword)) {
                response.setData(1);
            }
            else {
                user.setPassword(newPassword);
                userService.updateUser(user);
                response.setData(2);
            }
        }
        else{
            response.setData(0);
        }
        return response;
    }

    @GetMapping("/getUserInfo")
    public ResponsetogetUserInfo getUserInfo(@RequestHeader(value="Cookie") String cookie) {
        String userID = null;
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        userID = cookieInfo[0];
        User user = userService.getUserByUserID(userID);
        ResponsetogetUserInfo response = new ResponsetogetUserInfo();
        response.setCode(1);
        response.setData(user.getUserID(), user.getUserName(), user.getUserGender(), user.getUserLocation());
//        response.setCode(1);
//        response.setData(user.getUserName(), user.getUserGender(), user.getUserLocation(), user.getAvatarURL());
        return response;
    }

//    private final String client_id = "ov3SLrO4HyZSELxcHiqS";
//    private final String client_secret = "B9919DDA3BD9FBF7ADB9F84F67920D8CB6528620B9586D1C";
//    private final String redirect_uri = "http://localhost:3000/callback";
//    private String refreshToken;
//    private String accessToken;
//
//    @GetMapping("/RequestAccessToken")
//    public String requestAccessToken(@RequestParam String code) throws AuthenticationException {
//        System.out.println(code);
//        Unirest.config().connectTimeout(6000).socketTimeout(6000); // 设置合理的超时
//        try {
//            HttpResponse<String> response = Unirest.post("https://jaccount.sjtu.edu.cn/oauth2/token")
//                    .header("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
//                    .header("Accept", "*/* ")
//                    .header("Connection", "keep-alive")
//                    .header("Host", "jaccount.sjtu.edu.cn")
//                    .header("Content-Type", "application/x-www-form-urlencoded")
//                    .header("Authorization","Basic b3YzU0xyTzRIeVpTRUx4Y0hpcVM6Qjk5MTlEREEzQkQ5RkJGN0FEQjlGODRGNjc5MjBEOENCNjUyODYyMEI5NTg2RDFD")
//                    .field("grant_type", "authorization_code")
//                    .field("code", code)
//                    .field("redirect_uri", redirect_uri) // 确保包含重定向URI
//                    .field("client_id", client_id)
//                    .field("client_secret", client_secret)
//                    .asString();
//
//            JSONObject responseBody = new JSONObject(response.getBody());
//            // 检查response
//            System.out.println(responseBody);
//            // 访问令牌码
//            accessToken = responseBody.getString("access_token");
//            // 刷新令牌码
//            refreshToken = responseBody.getString("refresh_token");
//            System.out.println(accessToken);
//            System.out.println(refreshToken);
//
//            HttpResponse<String> response2 = Unirest.get("https://api.sjtu.edu.cn/v1/me/profile?access_token="+accessToken).asString();
//            JSONObject responseBody2 = new JSONObject(response2.getBody());
//
//            // 检查response
////            System.out.println(responseBody2);
////            System.out.println(responseBody2.getJSONArray("entities").get(0));
//            // 学号
//            String codeValue = responseBody2.getJSONArray("entities")
//                    .getJSONObject(0) // 使用 getJSONObject(0) 而不是 get(0)
//                    .getString("code");
//            System.out.println(codeValue);
//            //拿到学号之后在寻找数据库中是否有这个学号，如果有则不创建对应新用户，如果没有则创建
//            User user = userService.getUserByUserID(codeValue);
//            if(user == null) {
//                user = new User();
//                user.setUserID(codeValue);
//            }
//            // 前端你们要啥你们自己封装一下
//            return accessToken;
//        } catch (UnirestException | JSONException e) {
//            throw new AuthenticationException("Request access token failed");
//        }
//    }
}
