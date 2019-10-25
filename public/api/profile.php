<?
$id = $_GET['id'];
if(!count($id)) return false;
if($fp = fopen("http://scoresaber.com/u/$id", 'r')) {
    $content = '';
    while($line = fread($fp, 1024)) $content .= $line;

    preg_match('/title>(.+)\'/', $content, $name);
    preg_match('/avatar">\n\s+<img.*?src="(.*?)"/', $content, $avatar);
    preg_match('/global">.*#([0-9,]+).*#([0-9,]+)<\/a>/', $content, $rank);
    preg_match('/([0-9,.]+)pp/', $content, $pp);
    preg_match('/Play Count.*\s([0-9,]+)/', $content, $playcount);
    preg_match('/Total Score.*\s([0-9,]+)/', $content, $totalscore);
    preg_match('/Replays.*\s([0-9,]+)/', $content, $replay);

    $data = [
        'name' => $name[1],
        'avatar' => (preg_match('/^https?/', $avatar[1]) ? '' : "http://scoresaber.com").$avatar[1],
        'rank_global' => (int)str_replace(',', '', $rank[1]),
        'rank_country' => (int)str_replace(',', '', $rank[2]),
        'pp' => (float)str_replace(',', '', $pp[1]),
        'playcount' => (int)str_replace(',', '', $playcount[1]),
        'totalscore' => (int)str_replace(',', '', $totalscore[1]),
        'replays' => (int)str_replace(',', '', $replay[1]),
    ];
    echo json_encode($data);
} else {
    echo json_encode('접속 실패', JSON_UNESCAPED_UNICODE);
}