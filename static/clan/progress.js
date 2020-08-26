if (!Object.defineProperty) {
  alert('浏览器版本过低');
}
var vm = new Vue({
  el: '#q-app',
  data: {
    progressData: [],
    members: [],
    tailsData: [],
    tailsDataVisible: false,
    group_name: null,
    reportDate: null,
    date: '',
    activeIndex: '3',
    selected: [],
    sendRemindVisible: false,
    send_via_private: false,
    dropMemberVisible: false,
    today: 0,
    columns_desktop: [
      { name: 'avatar', label: '成员', field: 'qqid', format: val => `${val}`, align: 'center' },
      { name: 'nickname', label: '昵称', field: 'nickname', align: 'center' },
      { name: 'first', label: '第一刀', field: 'detail', align: 'center', sortable: true },
      { name: 'second', label: '第二刀', field: 'detail', align: 'center', sortable: true },
      { name: 'third', label: '第三刀', field: 'detail', align: 'center', sortable: true },
      { name: 'progress', label: '出刀', field: 'finished', format: val => `${val}`, align: 'center', sortable: true },
      { name: 'damage', label: '造成伤害', field: 'detail', align: 'center', sortable: true },
      { name: 'details', label: '详细', align: 'center' },
    ],
    columns: [
      { name: 'avatar', label: '成员', field: 'qqid', format: val => `${val}`, align: 'center' },
      { name: 'nickname', label: '昵称', field: 'nickname', align: 'center' },
      { name: 'progress', label: '出刀', field: 'finished', format: val => `${val}`, align: 'center', sortable: true },
      { name: 'damage', label: '造成伤害', field: 'detail', align: 'center', sortable: true },
      { name: 'details', label: '详细', align: 'center' },
    ],
    tailColumns: [
      { name: 'qqid', label: 'QQ', field: 'qqid', align: 'center' },
      { name: 'nickname', label: '昵称', field: 'nickname', align: 'center' },
      { name: 'boss', label: '头目', field: 'boss', align: 'center' },
      { name: 'damage', label: '尾刀伤害', field: 'damage', align: 'center' },
      { name: 'message', label: '留言', field: 'message', align: 'center' },
    ],
  },
  mounted() {
    var thisvue = this;
    axios.all([
      axios.post('../api/', {
        action: 'get_challenge',
        csrf_token: csrf_token,
        ts: (thisvue.get_today() / 1000) + 43200,
      }),
      axios.post('../api/', {
        action: 'get_member_list',
        csrf_token: csrf_token,
      }),
    ]).then(axios.spread(function (res, memres) {
      if (res.data.code != 0) {
        thisvue.$q.notify(res.data.message + '获取记录失败');
        return;
      }
      if (memres.data.code != 0) {
        thisvue.$q.notify(memres.data.message + '获取成员失败');
        return;
      }
      thisvue.members = memres.data.members;
      for (m of thisvue.members) {
        m.finished = 0;
        m.detail = [];
      }
      thisvue.today = res.data.today;
      thisvue.reportDate = thisvue.get_today();
      thisvue.date = new Date(thisvue.reportDate).toLocaleDateString()
      thisvue.refresh(res.data.challenges);
    })).catch(function (error) {
      thisvue.$q.notify(error + '获取数据失败');
    });
  },
  methods: {
    calc_damage(data, num) {
      if (data[num]) {
        if (data[num + 1]) {
          return data[num].damage + data[num + 1].damage
        }
        else {
          return data[num].damage
        }
      }
      else {
        return 0
      }
    },
    customSort(rows, sortBy, descending) {
      const data = [...rows]

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b

          if (sortBy === 'damage') {
            return this.totalDamage(x.detail) - this.totalDamage(y.detail)
          }
          else if (sortBy === 'first') {
            return this.calc_damage(x.detail, 0) - this.calc_damage(y.detail, 0)
          }
          else if (sortBy === 'second') {
            return this.calc_damage(x.detail, 2) - this.calc_damage(y.detail, 2)
          }
          else if (sortBy === 'third') {
            return this.calc_damage(x.detail, 4) - this.calc_damage(y.detail, 4)
          }
          else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }
      return data
    },
    totalDamage(data) {
      var damage = 0;
      data.forEach(item => {
        damage += item.damage;
      })
      return damage
    },
    cellColor(val) {
      if (val === 3) { return 'bg-green-2' }
      else if (val === 0) { return 'bg-red-2' }
      return ''
    },
    getSelectedString() {
      return this.selected.length === 0 ? '' : `选中了 ${this.selected.length} 位成员`
    },
    get_today: function () {
      let d = new Date();
      d -= 18000000;
      d = new Date(d).setHours(0, 0, 0, 0);
      return d;
    },
    csummary: function (cha) {
      if (cha == undefined) {
        return '';
      }
      return `(${cha.cycle}-${cha.boss_num}) ${cha.damage}`;
    },
    cdetail: function (cha) {
      if (cha == undefined) {
        return '';
      }
      var nd = new Date();
      nd.setTime(cha.challenge_time * 1000);
      var detailstr = nd.toLocaleString('chinese', { hour12: false, timeZone: 'asia/shanghai' }) + '<br>';
      detailstr += cha.cycle + '周目' + cha.boss_num + '号boss<br>';
      detailstr += (cha.health_ramain + cha.damage).toLocaleString(options = { timeZone: 'asia/shanghai' }) + '→' + cha.health_ramain.toLocaleString(options = { timeZone: 'asia/shanghai' });
      if (cha.message) {
        detailstr += '<br>留言：' + cha.message;
      }
      return detailstr;
    },
    arraySpanMethod: function ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 4) {
        if (columnIndex % 2 == 0) {
          var detail = row.detail[columnIndex - 4];
          if (detail != undefined && detail.health_ramain != 0) {
            return [1, 2];
          }
        } else {
          var detail = row.detail[columnIndex - 5];
          if (detail != undefined && detail.health_ramain != 0) {
            return [0, 0];
          }
        }
      }
    },
    report_day: function () {
      var thisvue = this;
      axios.post('../api/', {
        action: 'get_challenge',
        csrf_token: csrf_token,
        ts: (new Date(thisvue.date).getTime() / 1000) + 43200,
      }).then(function (res) {
        if (res.data.code != 0) {
          thisvue.$q.notify(res.data.message + '获取记录失败');
        } else {
          thisvue.refresh(res.data.challenges);
        }
      }).catch(function (error) {
        thisvue.$q.notify(error + '获取记录失败');
      })
      this.today = -1;
    },
    refresh: function (challenges) {
      challenges.sort((a, b) => a.qqid - b.qqid);
      this.progressData = [...this.members];
      // for (m of this.progressData) m.today_total_damage = 0;
      var thisvue = this;
      var m = { qqid: -1 };
      for (c of challenges) {
        if (m.qqid != c.qqid) {
          thisvue.update_member_info(m);
          m = {
            qqid: c.qqid,
            finished: 0,
            detail: [],
            // today_total_damage: 0,
          }
        }
        m.detail[2 * m.finished] = c;
        // m.today_total_damage += c.damage;
        if (c.is_continue) {
          m.finished += 0.5;
        } else {
          if (c.health_ramain != 0) {
            m.finished += 1;
          } else {
            m.finished += 0.5;
          }
        }
      }
      thisvue.update_member_info(m);
    },
    viewTails: function () {
      this.tailsData = [];
      for (const m of this.progressData) {
        if (m.finished % 1 != 0) {
          let c = m.detail[m.finished * 2 - 1];
          this.tailsData.push({
            qqid: m.qqid,
            nickname: m.nickname,
            boss: c.cycle + '-' + c.boss_num,
            damage: c.damage,
            message: c.message,
          });
        }
      }
      this.tailsDataVisible = true;
    },
    update_member_info: function (m) {
      if (m.qqid == -1) {
        return
      }
      for (let index = 0; index < this.progressData.length; index++) {
        if (m.qqid == this.progressData[index].qqid) {
          m.nickname = this.progressData[index].nickname;
          m.sl = this.progressData[index].sl;
          this.progressData[index] = m;
          return
        }
      }
      m.nickname = '（未加入）';
      this.progressData.push(m);
    },
    find_name: function (qqid) {
      for (m of this.members) {
        if (m.qqid == qqid) {
          return m.nickname;
        }
      };
      return qqid;
    },
    viewInExcel: function () {
      var icons = document.getElementsByTagName('span');
      while (icons[0]) {
        icons[0].remove();
      }
      var uri = 'data:application/vnd.ms-excel;base64,';
      var ctx = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>' + document.getElementsByTagName('thead')[0].innerHTML + document.getElementsByTagName('tbody')[0].innerHTML + '</table></body></html>';
      window.location.href = uri + window.btoa(unescape(encodeURIComponent(ctx)));
      document.documentElement.innerHTML = "请在Excel中查看（如果无法打开，请安装最新版本Excel）\n或者将整个表格复制，粘贴到Excel中使用";
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
    handleSelectionChange(val) {
      this.selected = val;
    },
    selectUnfinished() {
      this.selected = []
      this.progressData.forEach(item => {
        if (item.finished < 3) {
          this.selected.push(item)
        }
      })
    },
    sendRequest(action) {
      if (this.selected.length === 0) {
        this.$q.notify('请先勾选成员');
      }
      var memberlist = [];
      this.selected.forEach(row => {
        memberlist.push(row.qqid);
      });
      var thisvue = this;
      var payload = {
        action: action,
        csrf_token: csrf_token,
        memberlist: memberlist,
      };
      if (action === 'send_remind') {
        payload.send_private_msg = thisvue.send_via_private;
      }
      axios.post('../api/', payload).then(function (res) {
        if (res.data.code != 0) {
          if (res.data.code == 11) {
            res.data.message = '你的权限不足';
          }
          thisvue.$q.notify(res.data.message);
        } else {
          thisvue.$q.notify(res.data.notice);
        }
      }).catch(function (error) {
        thisvue.$q.notify(error);
      })
    },
  },
  delimiters: ['[[', ']]'],
})