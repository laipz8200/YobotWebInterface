new Vue({
    el: '#q-app',
    data: {
        bosstag: ['挂树', '一王', '二王', '三王', '四王', '五王'],
        subscribers: [
            [], [], [], [], [], [],
        ],
        tab: '挂树',
        members: [],
        group_name: null,
        activeIndex: '2',
    },
    mounted() {
        var thisvue = this;
        axios.post('../api/', {
            action: 'get_subscribers',
            csrf_token: csrf_token,
        }).then(function (res) {
            if (res.data.code == 0) {
                for (sub of res.data.subscribers) {
                    thisvue.subscribers[sub.boss].push(sub);
                }
                thisvue.group_name = res.data.group_name;
                document.title = res.data.group_name + ' - 预约管理';
            } else {
                thisvue.$q.notify(res.data.message, '获取数据失败');
            }
        }).catch(function (error) {
            thisvue.$q.notify(error, '获取数据失败');
        });
        axios.post('../api/', {
            action: 'get_member_list',
            csrf_token: csrf_token,
        }).then(function (res) {
            if (res.data.code == 0) {
                thisvue.members = res.data.members;
            } else {
                thisvue.$q.notify(res.data.message, '获取成员失败');
            }
        }).catch(function (error) {
            thisvue.$q.notify(error, '获取成员失败');
        });
    },
    methods: {
        find_name: function (qqid) {
            for (m of this.members) {
                if (m.qqid == qqid) {
                    return m.nickname;
                }
            };
            return qqid;
        },
        handleSelect(key, keyPath) {
            switch (key) {
                case '1':
                    window.location = '../';
                    break;
                case '2':
                    window.location = '../subscribers/';
                    break;
                case '3':
                    window.location = '../progress/';
                    break;
                case '4':
                    window.location = '../statistics/';
                    break;
                case '5':
                    window.location = `../my/`;
                    break;
            }
        },
    },
    delimiters: ['[[', ']]'],
})