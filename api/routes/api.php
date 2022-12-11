<?php

use App\Http\Controllers\MemoController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// メモ全件取得
Route::get('/memos', [MemoController::class, 'fetch']);

// メモ全件取得
Route::get('/projects', [MemoController::class, 'fetchProj']);

// メモ全件取得
Route::get('/users', [MemoController::class, 'fetchUsers']);

// メモ詳細取得
Route::get('/memo', [MemoController::class, 'fetchMemo']);

// メモ詳細取得
Route::get('/memoEdit', [MemoController::class, 'fetchMemoEdit']);

// メモ登録
Route::post('/memos', [MemoController::class, 'create']);

// メモ登録
Route::post('/project', [MemoController::class, 'createProj']);

// メモ更新
Route::post('/edit', [MemoController::class, 'edit']);

// メモ更新
Route::post('/editUser', [MemoController::class, 'editUser']);

// ログインユーザー取得
Route::get('/user', function() {
    $user = Auth::user();
    return $user ? new UserResource($user) : null;
});
