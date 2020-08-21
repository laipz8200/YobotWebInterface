var vm = new Vue({
  el: '#q-app',
  data: {
    groupData: [],
    columns: [
      { name: 'id', label: '群号', field: 'group_id', align: 'center' },
      { name: 'name', label: '群名称', field: 'group_name', align: 'center' },
      { name: 'area', label: '游戏区', field: 'game_server', align: 'center' },
      { name: 'detail', label: '详情页', align: 'center' },
      { name: 'delete', label: '删除', align: 'center' },
    ],
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh: function (event) {
      var thisvue = this;
      axios.post(api_path, {
        action: 'get_data',
        csrf_token: csrf_token,
      }).then(function (res) {
        if (res.data.code == 0) {
          thisvue.groupData = res.data.data;
        } else {
          thisvue.$alert(res.data.message, '加载数据错误');
        }
      }).catch(function (error) {
        thisvue.$alert(error, '加载数据错误');
      });
    },
    delete_group: function (scope) {
      var thisvue = this;
      thisvue.$q.dialog({
        title: '删除确认',
        message: '是否删除' + scope.row.group_name,
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
          action: 'drop_group',
          csrf_token: csrf_token,
          group_id: scope.row.group_id,
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