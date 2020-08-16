var gs_offset = { jp: 4, tw: 5, kr: 4, cn: 5 };
function pad2(num) {
  return String(num).padStart(2, '0');
}
function ts2ds(timestamp) {
  var d = new Date();
  d.setTime(timestamp * 1000);
  return d.getFullYear() + '/' + pad2(d.getMonth() + 1) + '/' + pad2(d.getDate());
}
var vm = new Vue({
  el: '#q-app',
  data: {
    isLoading: true,
    challengeData: [],
    activeIndex: '5',
    qqid: 0,
    nickname: '',
    columns: [
      { name: 'time', label: '出刀日期', field: 'pcrdate', align: 'center', sortable: true },
      { name: 'damage', label: '造成伤害', field: 'detail', align: 'center', sortable: true },
      { name: 'progress', label: '出刀数', field: 'finished', format: val => `${val}`, align: 'center', sortable: true },
      { name: 'details', label: '详细信息', style: 'max-width: 1rem', align: 'center' },
    ],
  },
  mounted() {
    var thisvue = this;
    var pathname = window.location.pathname.split('/');
    thisvue.qqid = parseInt(pathname[pathname.length - 2]);
    axios.post('../api/', {
      action: 'get_user_challenge',
      csrf_token: csrf_token,
      qqid: thisvue.qqid,
    }).then(function (res) {
      if (res.data.code != 0) {
        thisvue.$q.notify(res.data.message + '获取记录失败');
        return;
      }
      thisvue.nickname = res.data.user_info.nickname;
      thisvue.refresh(res.data.challenges, res.data.game_server);
      thisvue.isLoading = false;
    }).catch(function (error) {
      thisvue.$q.notify(error + '获取数据失败');
    });
  },
  methods: {
    totalDamage (data) {
      var damage = 0;
      data.forEach(item => {
        damage += item.damage;
      })
      return damage
    },
    cellColor (val) {
      if (val === 3) { return 'bg-green-2' }
      return 'bg-red-2'
    },
    csummary: function (cha) {
      if (cha == undefined) {
        return '-';
      }
      return `(${cha.cycle}-${cha.boss_num}) ${cha.damage}`;
    },
    cdetail: function (cha) {
      if (cha == undefined) {
        return '';
      }
      var nd = new Date();
      nd.setTime(cha.challenge_time * 1000);
      var detailstr = nd.toLocaleString('chinese', { hour12: false, timeZone: 'asia/shanghai' }) + '\n';
      detailstr += cha.cycle + '周目' + cha.boss_num + '号boss\n';
      detailstr += (cha.health_ramain + cha.damage).toLocaleString(options = { timeZone: 'asia/shanghai' }) + '→' + cha.health_ramain.toLocaleString(options = { timeZone: 'asia/shanghai' });
      if (cha.message) {
        detailstr += '\n留言：' + cha.message;
      }
      return detailstr;
    },
    arraySpanMethod: function ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 2) {
        if (columnIndex % 2 == 0) {
          var detail = row.detail[columnIndex - 2];
          if (detail != undefined && detail.health_ramain != 0) {
            return [1, 2];
          }
        } else {
          var detail = row.detail[columnIndex - 3];
          if (detail != undefined && detail.health_ramain != 0) {
            return [0, 0];
          }
        }
      }
    },
    refresh: function (challenges, game_server) {
      var thisvue = this;
      var m = { pcrdate: -1 };
      for (c of challenges) {
        var pcrdate = ts2ds(c.challenge_time - (gs_offset[game_server] * 3600));
        if (m.pcrdate != pcrdate) {
          if (m.pcrdate != -1) {
            thisvue.challengeData.push(m);
          }
          m = {
            pcrdate: pcrdate,
            finished: 0,
            detail: [],
          }
        }
        m.detail[2 * m.finished] = c;
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
      if (m.pcrdate != -1) {
        thisvue.challengeData.push(m);
      }
    },
    viewInExcel: function () {
      var icons = document.getElementsByTagName('span');
      while (icons[0]) {
        icons[0].remove();
      }
      var uri = 'data:application/vnd.ms-excel;base64,';
      var ctx = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>' + document.getElementsByTagName('thead')[0].innerHTML + document.getElementsByTagName('tbody')[0].innerHTML + '</table></body></html>';
      window.location.href = uri + window.btoa(unescape(encodeURIComponent(ctx)));
      document.documentElement.innerHTML = '请在Excel中查看（如果无法打开，请安装最新版本Excel）\n或者将整个表格复制，粘贴到Excel中使用';
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