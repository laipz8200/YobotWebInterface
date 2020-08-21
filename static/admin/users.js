var vm = new Vue({
  el: '#q-app',
  data: {
    isLoading: true,
    moreLoading: false,
    userData: [],
    querys: {
      page: 1,
      page_size: 50,
      qqid: null,
      clan_group_id: null,
      authority_group: null,
    },
    query_input: {
      qqid: null,
      clan_group_id: null,
      authority_group: null,
    },
    has_more: true,
    authtype: [{
      value: 100,
      label: '成员',
    }, {
      value: 10,
      label: '公会战管理员',
    }, {
      value: 1,
      label: '主人',
    }],
    columns: [
      { name: 'avatar', label: '头像', field: 'qqid', align: 'center' },
      { name: 'nickname', label: '昵称', field: 'nickname', align: 'center' },
      { name: 'qqid', label: 'QQ', field: 'qqid', align: 'center' },
      { name: 'group_id', label: '公会群', field: 'clan_group_id', align: 'center', sortable: true },
      { name: 'groups', label: '权限', field: 'authority_group', align: 'center' },
      { name: 'last_seen', label: '上次登录', field: 'last_login_time', align: 'center', sortable: true },
      { name: 'ip', label: '登录IP', field: 'last_login_ipaddr', align: 'center' },
      { name: 'delete', label: '删除', align: 'center' },
    ],
    options: [
      { label: '不限', value: '' },
      { label: '主人', value: '1' },
      { label: '公会战管理员', value: '10' },
      { label: '成员', value: '100' },
    ],
  },
  mounted() {
    this.load_more();
  },
  methods: {
    datestr: function (ts) {
      if (ts == 0) {
        return null;
      }
      var nd = new Date();
      nd.setTime(ts * 1000);
      return nd.toLocaleString('chinese', { hour12: false, timeZone: 'asia/shanghai' });
    },
    search: function (event) {
      Object.assign(this.querys, this.query_input);
      this.querys.page = 1;
      // this.isLoading = true;
      this.userData = [];
      this.load_more();
    },
    load_more: function (event) {
      // this.moreLoading = true;
      var thisvue = this;
      axios.post(api_path, {
        action: 'get_data',
        querys: thisvue.querys,
        csrf_token: csrf_token,
      }).then(function (res) {
        if (res.data.code == 0) {
          thisvue.userData.push(...res.data.data);
          // thisvue.isLoading = false;
          // thisvue.moreLoading = false;
          if (res.data.data.length < thisvue.querys.page_size) {
            thisvue.has_more = false;
          } else {
            thisvue.querys.page += 1;
          }
        } else {
          thisvue.$q.notify(res.data.message + '加载数据错误');
        }
      }).catch(function (error) {
        thisvue.$q.notify(error + '加载数据错误');
      });
    },
    modify: function (scope) {
      var thisvue = this;
      axios.post(api_path, {
        action: 'modify_user',
        csrf_token: csrf_token,
        data: {
          qqid: scope.row.qqid,
          authority_group: scope.row.authority_group,
        },
      }).then(function (res) {
        if (res.data.code == 0) {
          thisvue.$q.notify('修改成功');
        } else {
          thisvue.$q.notify('修改失败' + res.data.message);
        }
      }).catch(function (error) {
        thisvue.$q.notify(error);
      });
    },
    delete_user: function (scope) {
      var thisvue = this;
      thisvue.$q.dialog({
        title: '删除确认',
        message: '是否删除' + scope.row.nickname,
        cancel: {
          label: '不删除',
          flat: true
        },
        ok: {
          label: '删除',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        axios.post(api_path, {
          action: 'delete_user',
          csrf_token: csrf_token,
          data: {
            qqid: scope.row.qqid,
          },
        }).then(function (res) {
          if (res.data.code == 0) {
            thisvue.$q.notify('删除成功');
          } else {
            thisvue.$q.notify('删除失败' + res.data.message);
          }
        }).catch(function (error) {
          thisvue.$q.notify(error);
        });
      }).onCancel(() => {
        thisvue.$q.notify('已取消删除');
      })
    },
  },
  delimiters: ['[[', ']]'],
})