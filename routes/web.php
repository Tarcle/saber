<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return "<h1>준비중입니다.</h1><a href='comparesaber'>ScoreSaber 전적 비교</a>";
});

Route::get('/api/{param}/{value?}', 'Api@list')->where(['param' => 'search|rank'])->middleware(\App\Http\Middleware\checkApi::class);
Route::get('/api/profile/{id}', 'Api@profile')->where(['id' => '[0-9]+'])->middleware(\App\Http\Middleware\checkApi::class);
Route::get('/api/{param}/{id}/{page?}', 'Api@score')->where(['param' => '(top|recent)score', 'id' => '[0-9]+', 'page' => '[0-9]+'])->middleware(\App\Http\Middleware\checkApi::class);

Route::get('/comparesaber', function() {
    return view('comparesaber');
});