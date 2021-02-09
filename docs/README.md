# 最具极客范的开源智能家居系统

> MyHome是由BLab大熊实验室开源的智能家居控制系统，包含软件硬件等诸多方面。致力于构建一套完全开源的智能家居解决方案，让一切能为你掌握，MyHome不会收集任何你的隐私数据保证你的隐私安全。

## 特性

- 全开源，社区维护免费试用
- 室内精确定位，位置推送至APP
- 可扩展通讯协议，方便DIY硬件接入

## 文档

[MyHome文档](https://github.com/BearLaboratory/myhomedocs)使用[vuepress](https://vuepress.vuejs.org/zh/)自动生成，同时我部署了CI整个部署过程不需要人工干预。但是个人精力有限，如果文档有遗漏的地方欢迎大家补充。千里之行始于足下，我将持续完善文档，立志使MyHome称为全球最好用的开源智能家居控制系统。

## 源码
1. 手机APP： 

手机APP目前使用uniapp进行跨端开发，进行源码开发阅读请使用HbuilderX。

[源码地址](https://github.com/BearLaboratory/myhomeapp
)：https://github.com/BearLaboratory/myhomeapp

2. 开发者后台前端：
开发者后台前端使用VUE+ELEMENTUI开发

[源码地址](https://github.com/BearLaboratory/myhomeadminui)：https://github.com/BearLaboratory/myhomeadminui

3. 后台系统
现整个MyHome后台系统均使用Java进行开发且Java版本为1.8，springboot版本为2.3.3

[源码地址](https://github.com/BearLaboratory/myhome)：https://github.com/BearLaboratory/myhome
## 捐助
MyHome由BLab大熊实验室出于爱好开发，本身不是商业项目，因此项目本身无任何资金支持。同时物联网项目需要大量高性能服务器支持，目前服务器使用的是一台性能比较弱的个人服务器对外提供网络服务，因此在服务器的响应方面会有很大的限制。如果你觉得MyHome帮助到了你，我们也非常乐意收到来自于您的捐助。

### 1.您的捐助将用于
- MyHome的APP及服务端持续开发
- 文档、社区的建设
- 租用更好的服务器及开发更多的功能
- 资助设备开发者持久优化或者开发设备
### 2.捐助方式

<div style="display:flex;justify-content: space-between;margin-top:10px;">
    <div>
        <div style="margin-bottom:5px;">支付宝捐助</div>
        <img :src="$withBase('/alipay-pay.jpg')" alt="foo" >
    </div>
    <div>
        <div style="margin-bottom:5px;">微信捐助</div>
        <img :src="$withBase('/weixin-pay.png')" alt="foo" >
    </div>
</div>

#### 其他捐助方式
社区开源产品购买或关注BLab大熊实验室
### 3.捐助列表
> 手动更新，可能存在延迟

暂无


## 作者与开发组

### 作者

<div style="margin-top:20px;padding:20px;display:flex;width:100%">
    <div style="width:20%;display: flex;justify-content: center;" >
        <img :src="$withBase('/dengyi.jpg')" alt="邓艺" height="130px">
    </div>
    <div style="width:80%;margin-left:20px;display:flex;flex-direction: column;">
        <span style="font-size: 18px;font-weight: bold;">大熊</span>
        <span style="color: #909399;margin-top:5px">全栈开发-浙江嘉兴</span>
        <span style="color: #909399;margin-top:5px">职责：负责MyHome核心开发以及统筹MyHome规划</span>
        <span style="color: #909399;margin-top:5px">介绍：丰富的后端开发经验，参与过多种类型项目开发。兴趣广泛，涉猎领域比较多也比较杂，MyHome项目发起人。</span>
    </div>
</div>

### 开发组

暂无
 