module.exports = {
    title: 'MyHome',
    description: '最具极客范的开源智能家居控制系统',
    head: [
        ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
    ],
    themeConfig: {
        nav: [
            { text: '设计理念', link: '/idea/' },
            { text: '开源硬件', link: '/hardware/' },
            { text: '手机APP', link: '/app/' },
            { text: '后台系统', link: '/backend/' },
            { text: 'BLab大熊实验室开源组织', link: 'https://github.com/BearLaboratory' },
        ],
        // 侧边栏配置
        sidebar: {
            '/hardware/': [
                {
                    title: '通讯协议',
                    path: 'protocol'
                },
                {
                    title: '智能开关',
                    path: 'smartswitch'
                }
            ],
            '/backend/': [
                {
                    title: '数据库模型',
                    path: 'databasemodel'
                }
            ]
        }
    }
}