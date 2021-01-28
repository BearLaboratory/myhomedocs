# 开源硬件

MyHome从建立伊始就秉持开放的原则，任何接入MyHome的硬件设备只要符合既定的通讯协议即可方便快捷的接入系统。在DIY硬件设备的时候有如下价格流程：

1. 后台申请成为开发者
2. 提交设备的基本信息等待审核（审核的原因为当前提供服务的服务器性能限制，重复的设备将不会通过审核，如果社区发展良好这步将会省略）
3. 硬件设备的开发固件的编写
4. 设备接入系统
5. APP版本升级
6. 正常使用

> 为了保证系统的健壮性，任何DIY设备必须开源，经历使用者的检验以及正常的升级

**为了促进社区的发展，DIY的硬件设备请从社区购买，收益部分将由社区和开发者共享！**

## 推荐硬件开发工具及固件编程框架选型及依据
### 1. 硬件开发工具
推荐硬件开发工具为**Kicad**,原因如下：
1. [kicad](https://kicad.org)作为开源pcb设计工具，开源属性直接导致你不用再去破解使用盗版软件，MyHome作为开源软件，深刻理解开源的含义。我不想也不愿意看到任何使用盗版软件进行社区建设的行为。
2. [kicad](https://kicad.org)目前5版本已经十分完善，性能也很强悍，非常适合开源项目的使用。
3. [kicad](https://kicad.org)有专门的转换工具可以将AD开发的工程转换成kicad工程

> 开源需要大家的支持，开源更是一种信念，请尊重知识产权

### 2. 软件方面
考虑到物联网应用都需要连接上网络，目前我推荐使用ESP8266及ESP32两类芯片进行硬件的开发。同时也考虑到有很多小伙伴（包括我自己）并不是专业硬件工程师出生，对于c语言的陌生，因此我推荐使用nodemcu的lua语言进行固件开发，目前我正在考察microPython的适应性，后期将再做处理。

[lua](https://www.runoob.com/lua/lua-tutorial.html)语法上类似于nodejs，这将大大加快非专业嵌入式开发人员上手，同时[nodemcu](https://nodemcu.readthedocs.io/en/release/)官方的文档写的也十分详细，我想这对于我们使用高级语言开发的小伙伴将是很大的福音。

此外，也推荐使用Arduino进行硬件固件的开发，Arduino使用面非常广，网络上教程也非常多，非常方便大家学习。

### 3. PCB打板商家
对于我们DIY玩家而言，我推荐PCB生产商家为深圳嘉立创，质量可以同时实验性的打板价格也非常公道。
## 硬件设备接入MyHome示例代码

### 1. nodemcu（ESP8266）使用LUA进行开发示例
```lua
-- init mqtt client without logins, keepalive timer 120s
m = mqtt.Client("clientid", 120)

-- init mqtt client with logins, keepalive timer 120sec
m = mqtt.Client("clientid", 120, "user", "password")

-- setup Last Will and Testament (optional)
-- Broker will publish a message with qos = 0, retain = 0, data = "offline"
-- to topic "/lwt" if client don't send keepalive packet
m:lwt("/lwt", "offline", 0, 0)

m:on("connect", function(client) print ("connected") end)
m:on("connfail", function(client, reason) print ("connection failed", reason) end)
m:on("offline", function(client) print ("offline") end)

-- on publish message receive event
m:on("message", function(client, topic, data)
  print(topic .. ":" )
  if data ~= nil then
    print(data)
  end
end)

-- on publish overflow receive event
m:on("overflow", function(client, topic, data)
  print(topic .. " partial overflowed message: " .. data )
end)

-- for TLS: m:connect("192.168.11.118", secure-port, 1)
m:connect("192.168.11.118", 1883, false, function(client)
  print("connected")
  -- Calling subscribe/publish only makes sense once the connection
  -- was successfully established. You can do that either here in the
  -- 'connect' callback or you need to otherwise make sure the
  -- connection was established (e.g. tracking connection status or in
  -- m:on("connect", function)).

  -- subscribe topic with qos = 0
  client:subscribe("/topic", 0, function(client) print("subscribe success") end)
  -- publish a message with data = hello, QoS = 0, retain = 0
  client:publish("/topic", "hello", 0, 0, function(client) print("sent") end)
end,
function(client, reason)
  print("failed reason: " .. reason)
end)

m:close();
-- you can call m:connect again

```

### 2. ESP8266使用Arduino开发代码示例

```c
// 引入 wifi 模块，并实例化，不同的芯片这里的依赖可能不同
#include <ESP8266WiFi.h>
static WiFiClient espClient;

// 引入阿里云 IoT SDK
#include <AliyunIoTSDK.h>

// 设置产品和设备的信息，从阿里云设备信息里查看
#define PRODUCT_KEY "a1tyxCVnHzi"
#define DEVICE_NAME "kaiguan"
#define DEVICE_SECRET "b11f5533feb0483783b8b23ab41e4e1d"
#define REGION_ID "cn-shanghai"

// 设置 wifi 信息
#define WIFI_SSID "Xiaomi_F631"
#define WIFI_PASSWD "20200403a."

void setup()
{
    Serial.begin(115200);
    
    // 初始化 wifi
    wifiInit(WIFI_SSID, WIFI_PASSWD);
    
    // 初始化 iot，需传入 wifi 的 client，和设备产品信息
    AliyunIoTSDK::begin(espClient, PRODUCT_KEY, DEVICE_NAME, DEVICE_SECRET, REGION_ID);
    
    // 绑定一个设备属性回调，当远程修改此属性，会触发 powerCallback
    // PowerSwitch 是在设备产品中定义的物联网模型的 id
    AliyunIoTSDK::bindData("PowerSwitch", powerCallback);
    
    // 发送一个数据到云平台，LightLuminance 是在设备产品中定义的物联网模型的 id
    AliyunIoTSDK::send("LightLuminance", 100);
}

void loop()
{
    AliyunIoTSDK::loop();
}

// 初始化 wifi 连接
void wifiInit(const char *ssid, const char *passphrase)
{
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, passphrase);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("WiFi not Connect");
    }
    Serial.println("Connected to AP");
}

// 电源属性修改的回调函数
void powerCallback(JsonVariant p)
{
    int PowerSwitch = p["PowerSwitch"];
    if (PowerSwitch == 1)
    {
        // 启动设备
    } 
}

```