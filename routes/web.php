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
    return "<h1>준비중입니다.</h1>";
});

Route::get('/api/{param}/{value}', 'Api@list')->where(['param' => '(search|rank)']);
Route::get('/api/profile/{id}', 'Api@profile')->where(['id' => '[0-9]+']);
Route::get('/api/{param}/{id}/{page?}', 'Api@score')->where(['param' => '(top|recent)score', 'id' => '[0-9]+', 'page' => '[0-9]+']);

Route::get('/comparesaber', function() {
    return view('comparesaber');
});
Route::post('/comparesaber', function() {

});