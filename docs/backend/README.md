# 后台系统

对于每个系统，系统后台都是至关重要的存在。
不论是商业项目还是像MyHome这样的开源项目，都是需要一个功能齐全的系统后台的存在。这里所说的系统后台其实指的是两个后台系统，一个是我们开发者接触的后台系统，另一个是手机APP所请求的后台系统。因为MyHome是开源性的非盈利项目，所以基本不需要搜集用户信息（不收集用户信息，不代表APP不需要权限，基本的权限还是需要开放给APP否则将无法正常使用APP），同时我们也不会给用户推送广告等商业性质的内容。因此，对于我们开发者来说开发后台看似很简陋。手机APP后台，因为不需要普通开发者维护，所以对于普通用户以及普通开发者来说也是透明的。

## 系统所使用技术栈
1. [springboot](https://spring.io/projects/spring-boot) 如今的商业或非商业项目中作为Java技术的主流框架springboot是方便我们开发的不二选择。
2. [mybatis-plus](https://mp.baomidou.com/)mybatis-plus在原mybatis的基础上做了很多增强，使我们既可以手写SQL又能利用其提供的强大功能，是非常不错的持久层框架。
3. [redis](https://redis.io/)对于物联网项目来说，数据的并发量比较大，如果我们将大量数据直接写入关系数据库，很容易导致数据库崩溃，使用redis是必须的。
4. [MySQL](https://www.mysql.com/)使用最广的关系型数据库
5. [maven](https://maven.apache.org)Java项目的最经典项目构建工具
6. [jenkins](https://www.jenkins.io/)久经考验的项目持续构建工具
7. [centos](https://www.centos.org/)稳定且广泛使用商业Linux操作系统
## 系统项目架构
由于MyHome的开源属性，鉴于前期项目伊始资金有限，项目均采用单体应用的形式进行开发和部署。但是正因为单体项目部署，可能导致用户基数增加后整个系统反应缓慢，这个问题将会在社区成长以后根据社区收入情况处理。

## 开发团队成员
一个项目的持续迭代更新离不开团队的参与，目前MyHome后台开发团队成员如下：

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