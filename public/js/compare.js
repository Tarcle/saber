var app = new Vue({
    el: 'app',
    template: '#template',
    data: {
        load_page: 15, //불러올 페이지 수 (한 페이지 8곡)
        
        toggle: false,
        url1: 'http://scoresaber.com/u/76561198053868259', //왼쪽 주소
        url2: '', //오른쪽 주소
        player1name: '', //왼쪽 이름
        player2name: '', //오른쪽 이름
        player1data: [], //왼쪽 데이터
        player2data: [], //오른쪽 데이터
        load_count: 0, //불러온 페이지 개수
        failed: false, //데이터 로드 실패했는지
    },
    mounted: function () {
        with(this) {
            url1 = getCookie('player1url') ? getCookie('player1url') : url1;
            url2 = getCookie('player2url') ? getCookie('player2url') : url2;
            player1name = getCookie('player1name') ? getCookie('player1name') : player1name;
            player2name = getCookie('player2name') ? getCookie('player2name') : player2name;
        }

        window.onscroll = function () {
            if(window.scrollY >= 120) app.toggle = true;
            else app.toggle = false;
        }
    },
    methods: {
        compare: function () {
            with(this) {
                failed = false;
                player1name = '';
                player2name = '';
                player1data = [];
                player2data = [];
                getSongs();
                setCookie('player1url', url1);
                setCookie('player2url', url2);
            }
        },
        getSongs: function () {
            app.name = []; //렌더링 전 이름 저장
            app.result = [[], []]; //렌더링 전 결과 저장

            app.load_count = 0;

            url1 = this.url1.slice(-17).replace('/', '');
            url2 = this.url2.slice(-17).replace('/', '');
            loadName(url1, 1);
            loadName(url2, 2);
            for(i=1; i<=app.load_page; i++) {
                loadData(url1+'/'+i, 1);
                loadData(url2+'/'+i, 2);
            }

            function loadName(url, player) {
                xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.onreadystatechange = function () {
                    if(this.readyState == 4) {
                        if(!app.failed) {
                            if(this.status == 200) {
                                app['player'+player+'name'] = JSON.parse(this.response)['name'];
                                app.setCookie('player'+player+'name', app['player'+player+'name'])
                            } else with(app) {
                                failed = true;
                                player1name = '';
                                player2name = '';
                                player1data = [];
                                player2data = [];
                                load_count = 0;
                                alert("데이터 로드에 실패했습니다.");
                            }
                        }
                    }
                }
                xhr.open("GET", '/api/profile/'+url, true);
                xhr.send();
            }
            function loadData(url, player) {
                var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.onreadystatechange = function () {
                    if(this.readyState == 4 && !app.failed) {
                        if(this.status == 200) {
                            app['player'+player+'data'] = app['player'+player+'data'].concat(JSON.parse(this.response));
                            if(++app.load_count >= app.load_page*2) {
                                app.player1data.sort(function(a,b){return b.pp - a.pp});
                                app.player2data.sort(function(a,b){return b.pp - a.pp});
                            }
                        } else {
                            with(app) {
                                failed = true;
                                player1name = '';
                                player2name = '';
                                player1data = [];
                                player2data = [];
                                load_count = 0;
                            }
                            alert("데이터 로드에 실패했습니다.");
                        }
                    }
                }
                xhr.open("GET", '/api/topscore/'+url, true);
                xhr.send();
            }
        },
        match_p2_data: function (data) {
            return this.player2data.filter(function(data2){return data.name==data2.name && data.difficult==data2.difficult && data.mapper==data2.mapper})[0];
        },
        getWinner: function (data) {
            return data.pp >= ((tmp=this.match_p2_data(data))?tmp.pp:0) ? 1 : 2;
        },
        song_html: function (data) {
            return '<span>'+data.name+'</span>' + ' <span class="'+data.difficult.replace('+','plus').toLowerCase()+'">'+data.difficult
                +'</span><br>'+data.mapper;
        },
        player_html: function (player, data) {
            if(player==2) {
                data = (tmp=this.match_p2_data(data))?tmp:0;
                if(!data) return '-';
            }
            return data.pp+' ( '+data.pp_weight+' )<br>'+(data.score?'점수: '+data.score:'정확도: '+data.accuracy);
        },

        setCookie: function (cookie_name, value, days) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + days);
            // 설정 일수만큼 현재시간에 만료값으로 지정
          
            var cookie_value = escape(value) + ((days == null) ? '' : ';    expires=' + exdate.toUTCString());
            document.cookie = cookie_name + '=' + cookie_value;
        },
        getCookie: function (cookie_name) {
            var x, y;
            var val = document.cookie.split(';');
          
            for (var i = 0; i < val.length; i++) {
                x = val[i].substr(0, val[i].indexOf('='));
                y = val[i].substr(val[i].indexOf('=') + 1);
                x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
                if (x == cookie_name) {
                    return unescape(y); // unescape로 디코딩 후 값 리턴
                }
            }
        }
    },
    computed: {
        progress: function () {
            return this.load_count/this.load_page/2 * 100;
        },
        progressbar: function () {
            with(this) {
                deg = progress * .9;
                if(progress<50) {
                    res = 'background: linear-gradient('+(deg*4-90)+'deg, #000 50%, rgba(0,0,0,0) 0),linear-gradient(-90deg, #fff425 50%, #000 0)';
                } else {
                    res = 'background: linear-gradient(-90deg, #fff425 50%, rgba(0,0,0,0) 0),linear-gradient('+((deg-45)*4-90)+'deg, #fff425 50%, #000 0)';
                }
                return res;
            }
        }
    }
})