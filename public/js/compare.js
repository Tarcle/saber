var app = new Vue({
    el: 'app',
    template: '#template',
    data: {
        load_page: 15, //불러올 페이지 수 (한 페이지 8곡)
        
        opened: true, //검색칸 토글
        url1: 'http://scoresaber.com/u/76561198053868259', //왼쪽 주소
        url2: 'http://scoresaber.com/u/76561198298645747', //오른쪽 주소
        player1name: '', //왼쪽 이름
        player2name: '', //오른쪽 이름
        player1data: [], //왼쪽 데이터
        player2data: [], //오른쪽 데이터
        load_count: 0, //불러온 페이지 개수
    },
    mounted: function () {
        with(this) {
            url1 = getCookie('url1') ? getCookie('url1') : url1;
            url2 = getCookie('url2') ? getCookie('url2') : url2;
            player1name = getCookie('player1name') ? getCookie('player1name') : player1name;
            player2name = getCookie('player2name') ? getCookie('player2name') : player2name;
        }
    },
    methods: {
        compare: function () {
            with(this) {
                player1name = '';
                player2name = '';
                player1data = [];
                player2data = [];
                getSongs();
            }
        },
        getSongs: function () {
            app.name = []; //렌더링 전 이름 저장
            app.result = [[], []]; //렌더링 전 결과 저장

            app.load_count = 0;
            for(i=1; i<=app.load_page; i++) {
                url = this.url1.slice(-17).replace('/', '');
                loadData('/api/topscore/'+url+'/'+i, 0);
                url = this.url2.slice(-17).replace('/', '');
                loadData('/api/topscore/'+url+'/'+i, 1);
            }

            function loadData(url, player) {
                var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.onreadystatechange = function () {
                    if(this.readyState == 4) {
                        if(this.status == 200) {
                            app['player'+(player+1)+'data'] = app['player'+(player+1)+'data'].concat(JSON.parse(this.response));
                            if(++app.load_count >= app.load_page*2) {
                                app.player1data.sort((a,b) => b.pp - a.pp);
                                app.player2data.sort((a,b) => b.pp - a.pp);
                            }
                        } else alert("데이터 로드에 실패했습니다.");
                    }
                }
                xhr.open("GET", url, true);
                xhr.send();
            }

            /* for(i=1; i<=app.load_page; i++) {
                loadData('http://cors-anywhere.herokuapp.com/'+this.url1+'&page='+i+'&sort=1', 0);
                loadData('http://cors-anywhere.herokuapp.com/'+this.url2+'&page='+i+'&sort=1', 1);
            }
            function loadData(url, player) {
                var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.onreadystatechange = function () {
                    if(this.readyState == 4) {
                        if(this.status == 200) {
                            text = this.response.replace(/<IMG(.*?)>/gi, "");
                            html = document.createElement('div');
                            html.innerHTML = text;
                            if(!app.name[player]) app.name[player] = html.querySelector('.title').innerText.trim();
                            songs = html.querySelectorAll("table.ranking.songs>tbody>tr");
                            for(i=0; i<songs.length; i++) {
                                song = songs[i];
                                name_html = song.querySelector("th.song a").innerHTML;
                                pp = song.querySelector("th.score .ppValue").innerText;
                                pp_html = song.querySelector("th.score").innerHTML;
                                data = {name_html: name_html.trim(), pp: parseFloat(pp), pp_html: pp_html.trim()};
                                // app.result[player].push(data);
                                app['player'+(player+1)+'data'].push(data);
                            }
                            if(!app.player1name || !app.player2name) {
                                app.player1name = app.name[0];
                                app.player2name = app.name[1];
                            }
                            if(++app.load_count >= app.load_page*2) {
                                app.player1data.sort((a,b) => b.pp - a.pp);
                                app.player2data.sort((a,b) => b.pp - a.pp);
                                // app.player1data = app.result.shift();
                                // app.player2data = app.result.shift();
                            }
                        } else alert("데이터 로드에 실패했습니다.");
                    }
                }
                xhr.open("GET", url, true);
                xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
                xhr.send();
            } */
        },
        player2pp: function (data) {
            return this.player2data.filter(data2 => data.name_html == data2.name_html)[0];
        },
        getWinner: function (data) {
            return data.pp >= ((tmp=this.player2pp(data))?tmp.pp:0) ? 1 : 2
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