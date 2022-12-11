<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemoPostRequest;
use App\Http\Requests\MemoGetRequest;
use App\Http\Resources\MemoResource;
use App\Models\Memo;
use App\Models\User;
use App\Models\Keynumber;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MemoController extends Controller
{
    /**
     * メモの全件取得
     * @return JsonResponse
     */
    public function fetch(Request $request): JsonResponse
    {
        // ログインユーザーのID取得
        $id = Auth::id();
        if (!$id) {
            throw new Exception('未ログインです。');
        }

        try {
            // $memos = Memo::where('user_id', $id)->offset($request->page*10 - 10)
            // ->limit(10)->get();

            $memosQuery = DB::table('memos')
                ->leftjoin('classification AS ca_1', function ($join) {
                    $join->on('ca_1.class', '=', 'memos.status')
                      ->where('ca_1.classid', '=', 'ST');
                    })
                ->leftjoin('classification AS ca_2', function ($join) {
                    $join->on('ca_2.class', '=', 'memos.category')
                      ->where('ca_2.classid', '=', 'CA');
                    })
                ->leftjoin('users', 'memos.exe_user_id', '=', 'users.id')
                ->select('ca_2.classname AS category', 'memos.key', 'memos.title', 'users.name AS username', 'ca_1.classname AS status'
                , 'memos.start_dt', 'memos.dead_dt')
                ->where('memos.projid', $request->projid);
            if ($request->task != null && $request->task != "0") {
                $memosQuery->where('memos.category', $request->task);
            }
            if ($request->status != null && $request->status != "0") {
                $memosQuery->where('memos.status', $request->status);
            }
            if ($request->keyword != "" && $request->keyword != null) {
                $memosQuery->where('memos.title', $request->keyword);
            }
            $memos = $memosQuery->offset($request->page*10 - 10)->limit(10)->get();
            $countQuery = DB::table('memos')->where('projid', $request->projid);
            if ($request->task != null && $request->task != "0") {
                $countQuery->where('category', $request->task);
            }
            if ($request->status != null && $request->status != "0") {
                $countQuery->where('status', $request->status);
            }
            if ($request->keyword != "" && $request->keyword != null) {
                $countQuery->where('title', $request->keyword);
            }
            $count = $countQuery->count();
        } catch (Exception $e) {
            throw $e;
        }
        return response()->json([
            'total' => $count,
            'memos' => $memos
        ], 200);
    }

    /**
     * メモの詳細取得
     * @return JsonResponse
     */
    public function fetchMemo(Request $request): JsonResponse
    {
        // ログインユーザーのID取得
        $id = Auth::id();
        if (!$id) {
            throw new Exception('未ログインです。');
        }

        try {
            $memo = DB::table('memos')
                ->leftjoin('classification AS ca_1', function ($join) {
                    $join->on('ca_1.class', '=', 'memos.status')
                    ->where('ca_1.classid', '=', 'ST');
                    })
                ->leftjoin('classification AS ca_2', function ($join) {
                    $join->on('ca_2.class', '=', 'memos.category')
                    ->where('ca_2.classid', '=', 'CA');
                    })
                ->leftjoin('classification AS ca_3', function ($join) {
                    $join->on('ca_3.class', '=', 'memos.priority')
                    ->where('ca_3.classid', '=', 'PR');
                    })
                ->leftjoin('classification AS ca_4', function ($join) {
                    $join->on('ca_4.class', '=', 'memos.difficult')
                    ->where('ca_4.classid', '=', 'DI');
                    })
                ->leftjoin('users AS us_1', 'memos.exe_user_id', '=', 'us_1.id')
                ->leftjoin('users AS us_2', 'memos.user_id', '=', 'us_2.id')
                ->select('ca_2.classname AS category', 'memos.key', 'memos.title','memos.body', 'us_2.name AS username', 'ca_1.classname AS status', 'ca_4.classname AS difficult'
                , 'memos.start_dt', 'memos.dead_dt', 'memos.schedule', 'memos.achievement', 'ca_3.classname AS priority', 'us_1.name AS exeusername')
                ->where('key', $request->key)->first();
        } catch (Exception $e) {
            throw $e;
        }
        return response()->json([
            'memo' => $memo
        ], 200);
    }

        /**
     * メモの詳細取得
     * @return JsonResponse
     */
    public function fetchMemoEdit(Request $request): JsonResponse
    {
        // ログインユーザーのID取得
        $id = Auth::id();
        if (!$id) {
            throw new Exception('未ログインです。');
        }

        try {
            $memo = DB::table('memos')
                ->leftjoin('users AS us_2', 'memos.user_id', '=', 'us_2.id')
                ->select('memos.category', 'memos.key', 'memos.title','memos.body', 'us_2.name AS username', 'memos.status', 'memos.difficult'
                , 'memos.start_dt', 'memos.dead_dt', 'memos.schedule', 'memos.achievement', 'memos.priority', 'memos.exe_user_id', 'memos.id')
                ->where('key', $request->key)->first();
        } catch (Exception $e) {
            throw $e;
        }
        return response()->json([
            'memo' => $memo
        ], 200);
    }

    /**
     * ユーザー情報取得
     * @return JsonResponse
     */
    public function fetchUsers(Request $request): JsonResponse
    {
        // ログインユーザーのID取得
        $id = Auth::id();
        if (!$id) {
            throw new Exception('未ログインです。');
        }

        try {
            $users = DB::table('users')->get();
        } catch (Exception $e) {
            throw $e;
        }
        return response()->json([
            'users' => $users
        ], 200);
    }

    /**
     * ユーザー情報取得
     * @return JsonResponse
     */
    public function fetchProj(Request $request): JsonResponse
    {
        // ログインユーザーのID取得
        $id = Auth::id();
        if (!$id) {
            throw new Exception('未ログインです。');
        }

        try {
            $project = DB::table('projectuser')->leftjoin('project', 'project.id', '=', 'projectuser.projid')
                ->select('projectuser.projid AS id', 'project.pjname', 'project.pjnamefull')
                ->where('projectuser.userid', $id)->get();
        } catch (Exception $e) {
            throw $e;
        }
        return response()->json([
            'projects' => $project
        ], 200);
    }

    /**
     * メモの登録
     * @param MemoPostRequest $request
     * @return JsonResponse
     */
    public function create(MemoPostRequest $request): JsonResponse
    {
        // ログインユーザーのID取得
        $id = Auth::id();
        if (!$id) {
            throw new Exception('未ログインです。');
        }
        try {
            $project = DB::table('users')->leftjoin('project', 'project.id', '=', 'users.projid')
                ->select('users.projid', 'project.pjname')
                ->where('users.id', $id)->first();
            $keynumberexist = DB::table('keynumber')->where('pjid', $project->projid)->exists();
            $numKey = '0';
            if(!$keynumberexist) {
                DB::table('keynumber')->insert([
                    'pjid' => $project->projid,
                    'keynum' => '1'
                ]);
                $numKey = '1';
            } else {
                $keynumber = DB::table('keynumber')->where('pjid', $project->projid)->first();
                // DB::table('keynumber')
                //     ->where('pjid', $project->projid)
                //     ->update([
                //         'keynumber->keynum' => "".((int)$keynumber->keynum + 1)
                //     ]);
                Keynumber::where('pjid', $project->projid)->update([
                    'keynum' => "".((int)$keynumber->keynum + 1)
                ]);
                $numKey = $keynumber->keynum + 1;
            }
            // モデルクラスのインスタンス化
            $memo = new Memo();
            // パラメータのセット
            $memo->user_id = Auth::id();
            $memo->title = $request->title;
            $memo->key = $project->pjname . '-' . $numKey;
            $memo->body = $request->body;
            $memo->status = '1';
            $memo->exe_user_id = $request->exe_user_id;
            $memo->category = $request->category;
            $memo->start_dt = $request->start_dt;
            $memo->dead_dt = $request->dead_dt;
            $memo->schedule = $request->schedule;
            $memo->achievement = $request->achievement;
            $memo->priority = $request->priority;
            $memo->difficult = $request->difficult;
            $memo->projid = $request->projid;
            // モデルの保存
            $memo->save();

        } catch (Exception $e) {
            throw $e;
        }

        return response()->json([
            'message' => 'メモの登録に成功しました。'
        ], 201);
    }

    /**
     * メモの更新
     * @param MemoPostRequest $request
     * @return JsonResponse
     */
    public function edit(MemoPostRequest $request): JsonResponse
    {
        try {
            // モデルクラスのインスタンス化
            $memo = Memo::find($request->id);
            // パラメータのセット
            $memo->title = $request->title;
            $memo->body = $request->body;
            $memo->status = $request->status;
            $memo->exe_user_id = $request->exe_user_id;
            $memo->category = $request->category;
            $memo->start_dt = $request->start_dt;
            $memo->dead_dt = $request->dead_dt;
            $memo->schedule = $request->schedule;
            $memo->achievement = $request->achievement;
            $memo->priority = $request->priority;
            $memo->difficult = $request->difficult;
            $memo->projid = $request->projid;
            // モデルの保存
            $memo->save();

        } catch (Exception $e) {
            throw $e;
        }

        return response()->json([
            'message' => 'メモの更新に成功しました。'
        ], 201);
    }

        /**
     * メモの更新
     * @param MemoPostRequest $request
     * @return JsonResponse
     */
    public function editUser(Request $request): JsonResponse
    {
        try {
            User::where('userid', $request->userid)->update([
                'userid' => $request->userid,
                'name' => $request->name,
                'email' => $request->email,
            ]);

        } catch (Exception $e) {
            throw $e;
        }

        return response()->json([
            'message' => $request
        ], 201);
    }

        /**
     * メモの登録
     * @param Request $request
     * @return JsonResponse
     */
    public function createProj(Request $request): JsonResponse
    {
        // ログインユーザーのID取得
        $id = Auth::id();
        if (!$id) {
            throw new Exception('未ログインです。');
        }
        try {
            DB::table('project')->insert([
                'pjname' => $request->pjname,
                'pjnamefull' => $request->pjnamefull,
            ]);
        } catch (Exception $e) {
            throw $e;
        }

        return response()->json([
            'message' => 'メモの登録に成功しました。'
        ], 201);
    }
}
