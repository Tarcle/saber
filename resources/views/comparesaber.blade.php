<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=840">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ScoreSaber pp 비교</title>

    <script data-ad-client="ca-pub-3631610053339651" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

    <link rel="stylesheet" href="/nanumsquare/nanumsquare.css">
    <link rel="stylesheet" href="/css/comparesaber.css">
</head>
<body>
    <app></app>
    <script type="text/template" id="template">
        <div id="app" :class="{ result: load_count>=load_page*2 }">
            <div id="toggle-box">
                <div id="players" v-if="opened">
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
                {{-- <button id="toggle" @click="opened = !opened"><span v-if="opened">△</span><span v-else>▽</span></button> --}}
            </div>
            <div id="result">
                <table v-if="load_count >= load_page*2">
                    <div class="result_bg"></div>
                    <tbody>
                        <tr v-for="data in player1data">
                            {{-- <td class="player1pp" v-html="data.pp_html" :class="{ win: getWinner(data)==1 }"></td>
                            <td class="song" v-html="data.name_html"></td>
                            <td class="player2pp" v-html="(tmp=player2pp(data))?tmp.pp_html:'-'" :class="{ win: getWinner(data)==2 }"></td> --}}
                            <td class="player1pp" v-html="data.pp" :class="{ win: getWinner(data)==1 }"></td>
                            <td class="song" v-html="data.name"></td>
                            <td class="player2pp" v-html="(tmp=player2pp(data))?tmp.pp:'-'" :class="{ win: getWinner(data)==2 }"></td>
                        </tr>
                    </tbody>
                </table>
                <div id="progress-bar" v-else>
                    
                    <p class="progress-bar" :style="progressbar"><span class="progress-text">@{{ progress.toFixed(1) }}%</span></p>
                </div>
            </div>
        </div>
    </script>
    <script src="/js/vue.min.js"></script>
    <script src="/js/compare.js"></script>
</body>
</html>