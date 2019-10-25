var app = new Vue({
    el: 'app',
    template: '#template',
    data: {
        load_page: 15, //불러올 페이지 수 (한 페이지 8곡)
        
        opened: true, //검색칸 토글
        url1: 'http://scoresaber.com/u/76561198053868259', //왼쪽 주소
        url2: 'http://scoresaber.com/u/76561198298645747', //오른쪽 주소
        player1name: 'Player 1', //왼쪽 이름
        player2name: 'Player 2', //오른쪽 이름
        player1data: [], //왼쪽 데이터
        player2data: [], //오른쪽 데이터
        load_count: 0, //불러온 페이지 개수
    },
    methods: {
        compare: function () {
            this.player1data = [];
            this.player2data = [];
            this.getSongs();
        },
        getSongs: function () {
            app.name = []; //렌더링 전 이름 저장
            app.result = [[], []]; //렌더링 전 결과 저장

            app.load_count = 0;
            for(i=1; i<=app.load_page; i++) {
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
                            if(++app.load_count >= app.load_page*2) {
                                app.player1name = app.name.shift();
                                app.player2name = app.name.shift();
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
            }
        },
        player2pp: function (data) {
            return this.player2data.filter(data2 => data.name_html == data2.name_html)[0];
        },
        getWinner: function (data) {
            return data.pp >= ((tmp=this.player2pp(data))?tmp.pp:0) ? 1 : 2
        },
    },
    computed: {
        progress: function () {
            return this.load_count/this.load_page/2 * 100;
        }
    }
})