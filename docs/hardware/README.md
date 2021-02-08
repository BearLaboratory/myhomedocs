# 开源硬件

MyHome从建立伊始就秉持开放的原则，任何接入MyHome的硬件设备只要符合既定的通讯协议即可方便快捷的接入系统。在DIY硬件设备的时候有如下流程：

1. [开发者后台](http://myhomeadmin.pro.dengyi)申请成为开发者
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

### 2. 固件开发方式
考虑到物联网应用都需要连接上网络，目前我推荐使用ESP8266及ESP32两类芯片进行硬件的开发。同时也考虑到有很多小伙伴（包括我自己）并不是专业硬件工程师出生，对于c语言的陌生，因此我推荐使用nodemcu的lua语言进行固件开发，目前我正在考察microPython的适应性，后期将再做处理。

[lua](https://www.runoob.com/lua/lua-tutorial.html)语法上类似于nodejs，这将大大加快非专业嵌入式开发人员上手，同时[nodemcu](https://nodemcu.readthedocs.io/en/release/)官方的文档写的也十分详细，我想这对于我们使用高级语言开发的小伙伴将是很大的福音。

此外，也推荐使用Arduino进行硬件固件的开发，Arduino使用面非常广，网络上教程也非常多，非常方便大家学习。

## 硬件固件代码参考

为了兼容MyHome社区APP，以及简化大家开发，我将基本通用代码进行了抽取，方便大家日常DIY过程中使用。抽取的公共代码只需要下载下来上传至硬件即可配合APP进行使用

### 1. nodemcu（ESP8266）使用LUA进行开发参考

#### 1.1 基础代码，开启smartconfig使用MyHome APP配网
```lua
-- global flags
deviceConfiged = false
statusLedState = false
wifiConnected = false
-- global params
deviceConfigParams = {}
statusLedTimmer = tmr.create()
stateLed = 4
gpio.mode(stateLed, gpio.OUTPUT)

-- not config and not connected to the wifi state led 
wifiConnected:register(1000, tmr.ALARM_AUTO, function()
    if (not deviceConfiged) then
        if (statusLedState) then
            gpio.write(stateLed, gpio.HIGH)
            statusLedState = false
        else
            gpio.write(stateLed, gpio.LOW)
            statusLedState = true
        end
    end
end)
-- function connect wifi
function connectWifi()
    wifi.setmode(wifi.STATION)
    wifi.sta.config(deviceConfigParams)
    wifi.sta.connect()
    wifi.eventmon.register(wifi.eventmon.STA_GOT_IP, function(T)
        wifiConnected = true
        gpio.write(stateLed, gpio.LOW)
        print("wifi connected, IP is " .. wifi.sta.getip())
        -- load logic and run
        dofile("smartswitchlogic.lua")
    end)

    wifi.eventmon.register(wifi.eventmon.STA_DISCONNECTED, function(T)
        wifiConnected = false
        print("wifi disconnect")
    end)
end
-- function start smartconfig 
function startSmartConfig()
    wifi.setmode(wifi.STATION)
    wifi.startsmart(0, function(ssid, password)
        deviceConfigParams.ssid = ssid
        deviceConfigParams.pwd = password
        -- save to file cconfig.json 
        fd = file.open("config.json", "a+")
        if fd then
            ok, json = pcall(sjson.encode, deviceConfigParams)
            if ok then
                fd:write(json)
                fd:close()
                deviceConfiged = true
            else
                print("not enough space to save config file")
            end
        end
        connectWifi()
    end)
end

-- check config
if file.exists("config.json") then
    deviceConfiged = true
    statusLedTimmer:unregister()
    print("device configed")
    -- decode config params 
    if file.open("config.json", "r") then
        deviceConfigParams = sjson.decode(file.readline())
        file.close()
        connectWifi()
    end
else
    print("device not config")
    statusLedTimmer:start()
    startSmartConfig()
end


```

#### 1.2 功能代码（以智能开关为例）

```lua
-- global flag
mqttConnected = false

-- global virables
mqttClient = nil
heartbeatTimmer = tmr.create()
mqttConnectTimmer = tmr.create()
switchTimmer = tmr.create()

checkIo = 1
gpio.mode(checkIo, gpio.INPUT)
controlIo = 7
gpio.mode(controlIo, gpio.OUTPUT)

oldSwitchState = 1

-- myhome connect params,you just need modify deviceId and productKey and deviceSecret
myhomeParams = {}
myhomeParams.deviceId = ""
myhomeParams.productKey = ""
myhomeParams.clientId = myhomeParams.deviceId ..
                            "|securemode=3,signmethod=hmacsha1,timestamp=6666|"
myhomeParams.deviceName = myhomeParams.deviceId
myhomeParams.deviceSecret = ""
myhomeParams.regionId = "cn-shanghai"
myhomeParams.mqttPort = 1883
myhomeParams.mqttHost = myhomeParams.productKey .. ".iot-as-mqtt." ..
                            myhomeParams.regionId .. ".aliyuncs.com"
myhomeParams.userName = myhomeParams.deviceName .. "&" ..
                            myhomeParams.productKey
myhomeParams.password = encoder.toHex(crypto.hmac("sha1",
                                                  "clientId" ..
                                                      myhomeParams.deviceId ..
                                                      "deviceName" ..
                                                      myhomeParams.deviceName ..
                                                      "productKey" ..
                                                      myhomeParams.productKey ..
                                                      "timestamp6666",
                                                  myhomeParams.deviceSecret))
myhomeParams.topicHartbeat = myhomeParams.productKey .. "/" ..
                                 myhomeParams.deviceName .. "/heartbeat"
myhomeParams.topicControled = myhomeParams.productKey .. "/" ..
                                  myhomeParams.deviceName .. "/controled"
myhomeParams.topicReport = myhomeParams.productKey .. "/" ..
                               myhomeParams.deviceName .. "/report"
reportParam = {}
reportParam.deviceId = myhomeParams.deviceId

controledParam = {}
-- init mqtt
mqttClient = mqtt.Client(myhomeParams.clientId, 120, myhomeParams.userName,
                         myhomeParams.password)
-- connect mqtt server
mqttConnectTimmer:register(5000, tmr.ALARM_AUTO, function()
    if (not mqttConnected) then
        mqttClient:connect(myhomeParams.mqttHost, myhomeParams.mqttPort, false,
                           mqttConnectSuccess, mqttConnectFailed)
    end
end)
mqttConnectTimmer:start()

mqttClient:on("offline", function(client)
    mqttConnected = false
    heartbeatTimmer:stop()
    switchTimmer:stop()
    print("mqtt offline")
end)
mqttClient:on("message", function(client, topic, data)
    if data ~= nil then
        print('get control', data)
        controledParam = sjson.decode(data)
        if (controledParam.deviceId == myhomeParams.deviceId) then
            if (controledParam.open) then
                gpio.write(controlIo, gpio.HIGH)
            else
                gpio.write(controlIo, gpio.LOW)
            end
        end
    end
end)

-- functions
function mqttConnectSuccess(client)
    mqttConnected = true
    mqttConnectTimmer:stop()
    heartbeatTimmer:start()
    switchTimmer:start()
    client:subscribe(myhomeParams.topicControled, 0, function(client)
        print("subscribe topic controled success")
    end)
end
--  heartbeat timmer ,every 30s upload status
heartbeatTimmer:register(30000, tmr.ALARM_AUTO, function()
    if (wifiConnected and mqttConnected) then
        mqttClient:publish(myhomeParams.topicHartbeat,
                           "{status:true,deviceId:" .. myhomeParams.deviceId ..
                               "}", 0, 0,
                           function(client) print("heartbeat published") end)
    end
end)

function mqttConnectFailed(client)
    mqttConnected = false
    print("mqtt connect faild")
end
-- switch check timmer
switchTimmer:register(100, tmr.ALARM_AUTO, function()
    if (mqttConnected) then
        if (gpio.read(checkIo) == 0 and oldSwitchState == 1) then
            oldSwitchState = 0
            reportParam.open = true
            mqttClient:publish(myhomeParams.topicReport,
                               sjson.encode(reportParam), 0, 0, function(client)
                gpio.write(controlIo, gpio.HIGH)
                print("switch on reported")
            end)
        elseif (gpio.read(checkIo) == 1 and oldSwitchState == 0) then
            oldSwitchState = 1
            reportParam.open = false
            mqttClient:publish(myhomeParams.topicReport,
                               sjson.encode(reportParam), 0, 0, function(client)
                gpio.write(controlIo, gpio.LOW)
                print("switch off reported")
            end)
        end
    end
end)

```

### 2. ESP8266使用Arduino开发代码示例

待完善