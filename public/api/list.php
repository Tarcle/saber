<?
$flag = explode('/', $_SERVER['REQUEST_URI'])[1];
if($flag == "search") {
    $url = "http://scoresaber.com/global?search={$_GET['search']}";
} elseif($flag == "rank") {
    $country = str_replace('/', ',', $_GET['country']);
    $url = "http://scoresaber.com/global";
    if($country) $url .= "?country=$country";
}
if($fp = fopen($url, 'r')) {
    $content = '';
    while($line = fread($fp, 1024)) $content .= $line;

    $tbody = explode('</tbody>', explode('<tbody>', $content)[1])[0];

    preg_match_all('/picture">(.|\n)*?src="(.*?)"/', $tbody, $res);
    $avatar = $res[2];
    preg_match_all('/flags\/(.*?)\.png/', $tbody, $res);
    $country = $res[1];
    preg_match_all('/700">(.+)<\/span/', $tbody, $res);
    $name = $res[1];
    preg_match_all('/ppValue">([0-9,.]+)/', $tbody, $res);
    $pp = $res[1];
    preg_match_all('/rank">\n\s+#([0-9,]+)/', $tbody, $res);
    $rank = $res[1];
    preg_match_all('/href="\/u\/([0-9]+)/', $tbody, $res);
    $url = $res[1];
    $list = [];
    for($i=0; $i<count($name); $i++) {
        array_push($list, [
            'name' => $name[$i],
            'avatar' => (preg_match('/^https?/', $avatar[1]) ? '' : "http://scoresaber.com").$avatar[$i],
            'country' => $country[$i],
            'pp' => (float)str_replace(',', '', $pp[$i]),
            'rank' => (int)str_replace(',', '', $rank[$i]),
            'url' => $url[$i],
        ]);
    }
    echo json_encode($list, JSON_UNESCAPED_UNICODE);
}