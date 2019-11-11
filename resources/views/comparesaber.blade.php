<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=840">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ScoreSaber pp 비교</title>

    {{-- <script data-ad-client="ca-pub-3631610053339651" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> --}}

    <link rel="stylesheet" href="/nanumsquare/nanumsquare.css">
    <link rel="stylesheet" href="/css/comparesaber.css">
</head>
<body>
    <app></app>
    <script type="text/template" id="template">
        <div id="app">
            <div id="search-box">
                <div id="players">
                    <div id="player1">
                        <p class="name">@{{ player1name }}</p>
                        <input type="text" class="url" v-model="url1">
                    </div>
                    <div id="player2">
                        <p class="name">@{{ player2name }}</p>
                        <input type="text" class="url" v-model="url2">
                    </div>
                    <button id="compare" @click="compare"></button>
                </div>
            </div>
            <div id="result" v-if="load_count >= load_page*2">
                <div class="head" v-if="toggle">
                    <p>@{{ player1name }}</p>
                    <p>@{{ player2name }}</p>
                </div>
                <div class="result_bg"></div>
                <table>
                    <tbody>
                        <tr v-for="data in player1data">
                            <td class="player1pp" v-html="player_html(1,data)" :class="{ win: getWinner(data)==1 }"></td>
                            <td class="song" v-html="song_html(data)"></td>
                            <td class="player2pp" v-html="player_html(2,data)" :class="{ win: getWinner(data)==2 }"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="progress-bar" v-else>
                <p class="progress-bar" :style="progressbar"><span class="progress-text">@{{ progress.toFixed(1) }}%</span></p>
            </div>
        </div>
    </script>
    <script src="/js/vue.min.js"></script>
    <script src="/js/data.js"></script>
    <script src="/js/compare.js"></script>
    {{-- <script>
        function test() {
            app.player1data = JSON.parse(p1d);
            app.player2data = JSON.parse(p2d);
            app.load_count = 30;
        }
        test()
    </script> --}}
</body>
</html>