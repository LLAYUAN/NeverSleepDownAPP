package org.example.backend.controllers;

import jakarta.servlet.http.HttpSession;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import org.example.backend.model.*;
import org.example.backend.service.CourseTimeTableService;
import org.example.backend.service.EventTableService;
import org.example.backend.service.MyUtils;
import org.example.backend.service.UserService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.AuthenticationException;
import java.util.Set;

@RestController
public class AuthController {

    private final String client_id = "ov3SLrO4HyZSELxcHiqS";
    private final String client_secret = "B9919DDA3BD9FBF7ADB9F84F67920D8CB6528620B9586D1C";
    private final String redirect_uri = "myapp://callback";
    private String refreshToken;
    private String accessToken;

    @Autowired
    private UserService userService;

    @Autowired
    private EventTableService eventTableService;

    @Autowired
    private CourseTimeTableService courseTimeTableService;


    public AuthController() {
    }

    @GetMapping("/RequestAccessToken")
    public ResponsetoJaccount requestAccessToken(@RequestParam String code) throws AuthenticationException {
        System.out.println("run RequestAccessToken");
        System.out.println(code);
        Unirest.config().connectTimeout(6000).socketTimeout(6000); // 设置合理的超时
        try {
            HttpResponse<String> response = Unirest.post("https://jaccount.sjtu.edu.cn/oauth2/token")
                    .header("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
                    .header("Accept", "*/* ")
                    .header("Connection", "keep-alive")
                    .header("Host", "jaccount.sjtu.edu.cn")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Authorization","Basic b3YzU0xyTzRIeVpTRUx4Y0hpcVM6Qjk5MTlEREEzQkQ5RkJGN0FEQjlGODRGNjc5MjBEOENCNjUyODYyMEI5NTg2RDFD")
                    .field("grant_type", "authorization_code")
                    .field("code", code)
                    .field("redirect_uri", redirect_uri) // 确保包含重定向URI
                    .field("client_id", client_id)
                    .field("client_secret", client_secret)
                    .asString();

            JSONObject responseBody = new JSONObject(response.getBody());
            // 检查response
            System.out.println(responseBody);
            // 访问令牌码
            accessToken = responseBody.getString("access_token");
            // 刷新令牌码
            refreshToken = responseBody.getString("refresh_token");
            System.out.println(accessToken);
            System.out.println(refreshToken);

            HttpResponse<String> response2 = Unirest.get("https://api.sjtu.edu.cn/v1/me/profile?access_token="+accessToken).asString();
            JSONObject responseBody2 = new JSONObject(response2.getBody());

            // 检查response
//            System.out.println(responseBody2);
//            System.out.println(responseBody2.getJSONArray("entities").get(0));
            // 将学号作为账户名
            String userID = responseBody2.getJSONArray("entities")
                    .getJSONObject(0) // 使用 getJSONObject(0) 而不是 get(0)
                    .getString("code");

            System.out.println(userID);
            System.out.println(accessToken);
            User user = userService.getUserByUserID(userID);
            EventTable defaulteventTable = null;
            int tableID = 0;
            ResponsetoJaccount res = new ResponsetoJaccount();
            if(user == null){
                user = new User();
                user.setUserID(userID);
                user.setIsFirstLogin(false);
                userService.saveUser(user);
                EventTable eventTable = new EventTable();
                eventTable.setTableName("工作表1");
                eventTable.setUser(user);
                eventTable.setDefaultTable(true);
                eventTableService.saveEventTable(eventTable);
                //courseTimeTable和eventTable一一对应，所以eventtable的创建、删除要与courseTimeTable绑定
                CourseTimeTable courseTimeTable = new CourseTimeTable();
                courseTimeTable.setEventTable(eventTable);
                courseTimeTableService.save(courseTimeTable);
                defaulteventTable = eventTable;
                tableID = eventTable.getTableID();
                String cookieValue = "userID="+ userID + ";tableID=" + tableID;
                res.setData(true, true,tableID,cookieValue,defaulteventTable.getTableName(),defaulteventTable.getBackground(),defaulteventTable.getFont(),defaulteventTable.getCourseColor(),defaulteventTable.getEventColor(), MyUtils.dateToString(defaulteventTable.getFirstDayDate()),defaulteventTable.getWeekAmount(),courseTimeTable);
            }
            else{
                Set<EventTable> eventTables = user.getEventTables();
                for(EventTable eventTable : eventTables) {
                    if(eventTable.getDefaultTable()) {
                        tableID = eventTable.getTableID();
                        defaulteventTable = eventTable;
                        break;
                    }
                }
                String cookieValue = "userID="+ userID + ";tableID=" + tableID;
                res.setData(true,user.getIsFirstLogin(),tableID,cookieValue,defaulteventTable.getTableName(),defaulteventTable.getBackground(),defaulteventTable.getFont(),defaulteventTable.getCourseColor(),defaulteventTable.getEventColor(), MyUtils.dateToString(defaulteventTable.getFirstDayDate()),defaulteventTable.getWeekAmount(),defaulteventTable.getCourseTimeTable());
            }
            res.setCode(1);
            res.setToken(accessToken);
            if(user.getIsFirstLogin()){
                user.setIsFirstLogin(false);
                userService.saveUser(user);
            }
            // 前端你们要啥你们自己封装一下
            System.out.println(res.getToken());
            return res;
        } catch (UnirestException | JSONException e) {
            throw new AuthenticationException("Request Access Token failed");
        }
    }

    // 令牌过期要刷新
    @GetMapping("/RefreshToken")
    public String refreshToken() throws AuthenticationException {
//        Unirest.config().connectTimeout(6000).socketTimeout(6000);
        try {
            HttpResponse<String> response = Unirest.post("https://jaccount.sjtu.edu.cn/oauth2/token")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .field("grant_type", "refresh_token")
                    .field("refresh_token", refreshToken)
                    .field("client_id", client_id)
                    .field("client_secret", client_secret)
                    .asString();

            if (response.getStatus() != 200) {
                throw new AuthenticationException("Failed to refresh access token, status: " + response.getStatus());
            }

            JSONObject responseBody = new JSONObject(response.getBody());
            return responseBody.getString("access_token");
        } catch (UnirestException | JSONException e) {
            throw new AuthenticationException("Request access token failed");
        }
    }

//    @GetMapping("/Logout")
//    public String logout(HttpSession session) {
//        session.invalidate();
//        // 重定向地址 post_logout_redirect_uri=http://localhost:3000
//        return "redirect:https://jaccount.sjtu.edu.cn/oauth2/logout?client_id=ov3SLrO4HyZSELxcHiqS&post_logout_redirect_uri=http://localhost:3000";
//    }
}
