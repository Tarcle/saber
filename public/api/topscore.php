<?
$id = $_GET['id'];
$page = $_GET['page'];
$list = [];

$i = !!$page ? $page : 1;
if($fp = fopen("http://scoresaber.com/u/$id?sort=1&page=$i", 'r')) {
    $content = '';
    while($line = fread($fp, 1024)) $content .= $line;

    $tbody = explode('</tbody>', explode('<tbody>', $content)[1])[0];

    preg_match_all('/rank">\n\s+#([0-9,]+)/', $tbody, $res);
    $rank = $res[1];
    preg_match_all('/pp">(.*?)<span/', $tbody, $res);
    $name = $res[1];
    preg_match_all('/#[0-9a-z]{6};">(.*?)<\/span/', $tbody, $res);
    $difficult = $res[1];
    preg_match_all('/mapper">(.*?)<\/span/', $tbody, $res);
    $mapper = $res[1];
    preg_match_all('/time">(.*?)<\/span/', $tbody, $res);
    $time = $res[1];
    preg_match_all('/ppValue">([0-9,.]+)<\/span/', $tbody, $res);
    $pp = $res[1];
    preg_match_all('/ppWeightedValue">\(([0-9,.]+)<span/', $tbody, $res);
    $pp_weight = $res[1];
    preg_match_all('/accuracy: ([0-9,.]+%(\s\([A-Z,]+\))?)<\/span/', $tbody, $res);
    $accuracy = $res[1];

    for($j=0; $j<count($name); $j++) {
        array_push($list, [
            'name' => $name[$j],
            'difficult' => $difficult[$j],
            'mapper' => $mapper[$j],
            'rank' => (int)str_replace(',', '', $rank[$j]),
            'pp' => (float)str_replace(',', '', $pp[$j]),
            'pp_weight' => (float)str_replace(',', '', $pp_weight[$j]),
            'accuracy' => $accuracy[$j],
            'time' => $time[$j],
        ]);
    }
}
echo json_encode($list, JSON_UNESCAPED_UNICODE);