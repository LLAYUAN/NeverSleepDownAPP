package org.example.backend.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.io.JsonEOFException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.example.backend.model.ResponseAI;
import org.example.backend.model.User;
import org.example.backend.service.AIService;
import org.example.backend.service.EventTableService;
import org.example.backend.service.MyUtils;
import org.example.backend.service.UserService;
import org.slf4j.Logger;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import reactor.core.publisher.Flux;

@RestController
public class AIController {


    private String head = "提取信息,如果无法识别则为设置为\"\"空字符串，一定按照json格式返回。每天是每周加上星期1、星期2、星期3、星期4、星期5、星期6、星期7全都要。\n" +
            "\"type\"（数字，新建课程为0，新建日程为1，切换工作表为2，工作表创建为3，删除课程或日程为4，删除工作表为5，没有匹配上为-1），\n" +
            "\"eventName\"（字符串）、\"eventLocation\"（字符串）、\"weekRepeat\"（字符串，仅为\"每周\"、\"单周\"、\"双周\"、\"本周\"、\"下周\"、\"\",优先\"\"）、\"week\"（数字的List，表示第几周有课）、\"date\"（1-7数字，星期1-星期7）、\"startTime\"（字符串\"xx:xx:xx\",时分秒，开始时间，如果没有提到就为空字符串）、\"endTime\"（字符串\"xx:xx:xx\",时分秒，结束时间，如果没有提到就为空字符串）、\"startTimeNumber\"（数字，开始节课）、\"endTimeNumber\"（数字，结束节课），\n" +
            "\"tableName\"（工作表名）、\"font\"（字符串，仅为\"楷体\"、\"宋体\"、\"幼圆\"、\"\"）、\"weekAmount\"（数字，这个工作表有几周）\n" +
            "如果没有匹配上，按照如下json格式返回。\n" +
            "{\n" +
            "    \"type\": -1\n" +
            "}\n" +
            "如果是新建课程，按照如下json格式返回。\n" +
            "{\n" +
            "    \"type\": 0,\n" +
            "    \"event\": {\n" +
            "        \"eventName\": \"课程名字\",\n" +
            "        \"eventLocation\": \"课程地点\",\n" +
            "        \"weekRepeat\": \"双周\",\n" +
            "        \"week\": [8，9],\n" +
            "        \"dayRepeat\": [\n" +
            "            {\n" +
            "                \"date\": 1,\n" +
            "                \"startTimeNumber\": 3,\n" +
            "                \"endTimeNumber\": 5\n" +
            "            },\n" +
            "            {\n" +
            "                \"date\": 3,\n" +
            "                \"startTimeNumber\": 8,\n" +
            "                \"endTimeNumber\": 9\n" +
            "            }\n" +
            "        ]\n" +
            "    }\n" +
            "}\n" +
            "如果是新建日程，按照如下json格式返回。\n" +
            "{\n" +
            "    \"type\": 1,\n" +
            "    \"event\": {\n" +
            "        \"eventName\": \"日程名字\",\n" +
            "        \"eventLocation\": \"日程地点\",\n" +
            "        \"weekRepeat\": \"单周\",\n" +
            "        \"week\": [8，9],\n" +
            "        \"dayRepeat\": [\n" +
            "            {\n" +
            "                \"date\": 1,\n" +
            "                \"startTime\": \"08:00:00\",\n" +
            "                \"endTime\": \"10:00:00\"\n" +
            "            },\n" +
            "            {\n" +
            "                \"date\": 3,\n" +
            "                \"startTime\": \"15:00:00\",\n" +
            "                \"endTime\": \"18:30:00\"\n" +
            "            }\n" +
            "        ]\n" +
            "    }\n" +
            "}\n" +
            "如果是切换工作表，按照如下json格式返回。\n" +
            "{\n" +
            "    \"type\": 2,\n" +
            "    \"tableName\": \"工作表名字\"\n" +
            "}\n" +
            "如果是创建工作表，按照如下json格式返回。\n" +
            "{\n" +
            "    \"type\": 3，\n" +
            "    \"tableName\": \"工作表名字\",\n" +
            "    \"font\": \"字体\",\n" +
            "    \"weekAmount\": 18\n" +
            "}\n" +
            "如果是删除课程或日程，按照如下json格式返回。\n" +
            "{\n" +
            "    \"type\": 4，\n" +
            "    \"eventName\": \"课程或者日程名字\"\n" +
            "}\n" +
            "如果是删除工作表，按照如下json格式返回。\n" +
            "{\n" +
            "    \"type\": 5，\n" +
            "    \"tableName\": \"工作表名字\"\n" +
            "}\n\n";
    @Resource
    private OpenAiChatModel openAiChatModel;
    @Resource
    private ObjectMapper objectMapper;
    @Autowired
    private AIService aiService;
    @Autowired
    private UserService userService;
    @Autowired
    private EventTableService eventTableService;

    @PostMapping("/Ai/chat1")
    public ResponseAI chat1(@RequestHeader(value = "Cookie") String cookie,
                            @RequestBody String str) throws JsonProcessingException
    {
        Logger log = org.slf4j.LoggerFactory.getLogger(AIController.class);
        String[] cookieInfo = MyUtils.getCookieInfo(cookie);
        String userID = cookieInfo[0];
        Integer tableID = Integer.parseInt(cookieInfo[1]);
        User user = userService.getUserByUserID(userID);
        System.out.println(str);
        try {
            String called = openAiChatModel.call(head + str);
            log.info(called);
            JsonNode jsonNode = objectMapper.readTree(called);
            log.info("type" + jsonNode.get("type"));
            if (jsonNode.has("type")) {
                int type = jsonNode.get("type").asInt();
                if(type == -1)
                    return new ResponseAI(-1, "无法识别");
                JsonNode data;
                switch (type) {
                    case 0:
                        System.out.println("新建课程");
                        data = jsonNode.get("event");
                        return aiService.newCourse(data, tableID);
                    case 1:
                        System.out.println("新建日程");
                        data = jsonNode.get("event");
                        return aiService.newSchedule(data, tableID);
                    case 2:
                        System.out.println("切换工作表");
                        String tableName = jsonNode.get("tableName").asText();
                        return aiService.switchTable(tableName,user);
                    case 3:
                        System.out.println("工作表创建");
                        return aiService.createTable(jsonNode,user);
                    case 4:
                        System.out.println("删除课程或日程");
                        return aiService.deleteEvent(jsonNode,eventTableService.getByTableID(tableID));
                    case 5:
                        System.out.println("删除工作表");
                        return aiService.deleteTable(jsonNode,user);
                    default:
                        System.out.println("无法识别");
                        return aiService.defaultSetting();
                }
            }
        } catch (JsonEOFException e) {
            e.printStackTrace();
            // 返回适当的响应，例如：
            return new ResponseAI(-1, "无法识别");
        }
//        return called;
        return aiService.defaultSetting();
    }
//    不满意默认配置那么自己配一个
//    OpenAiChatOptions openAiChatOptions = OpenAiChatOptions.builder()
//            .withModel("gpt-3.5-turbo")
//            .withTemperature(0.4F)
//            .withMaxTokens(200)
//            .build();
//    ChatResponse chatResponse = openAiChatModel.call(new Prompt(str, openAiChatOptions));

    @RequestMapping(value = "/Ai/Chat2")
    public Object chat2(String str) {
        System.out.println(str);
        ChatResponse chatResponse = openAiChatModel.call(new Prompt(str));
        return chatResponse.getResult().getOutput().getContent();
    }

    // 一个一个数据返回,ChatResponse的List
    @RequestMapping(value = "/Ai/Chat3")
    public Object chat3(String str) {
        Flux<ChatResponse> flux = openAiChatModel.stream(new Prompt(str,OpenAiChatOptions.builder()
                .withModel("gpt-3.5-turbo")
                .withTemperature(0.4F)
                .withMaxTokens(200)
                .build()));
        flux.toStream().forEach(chatResponse -> {
            System.out.println(chatResponse.getResult().getOutput().getContent());
        });
        return flux.collectList();
    }
}
