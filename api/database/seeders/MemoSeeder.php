<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('memos')->insert([
            [
                'user_id' => 1,
                'title' => 'タイトル1',
                'key' => 'SK-1',
                'body' => 'サンプルメモ1',
                'status' => '1',
                'exe_user_id' => '1',
                'category' => '1',
                'priority' => '1',
                'start_dt' => '2022-12-01',
                'dead_dt' => '2022-12-02',
                'schedule' => '1',
                'achievement' => '2',
                'created_at' => now(),
                'updated_at' => now(),
                'difficult' => '1',
                'projid' => '1',
            ],
            [
                'user_id' => 1,
                'title' => 'タイトル2',
                'key' => 'SK-2',
                'body' => 'サンプルメモ2',
                'status' => '1',
                'exe_user_id' => '1',
                'category' => '1',
                'priority' => '1',
                'start_dt' => '2022-12-01',
                'dead_dt' => '2022-12-02',
                'schedule' => '1',
                'achievement' => '2',
                'created_at' => now(),
                'updated_at' => now(),
                'difficult' => '1',
                'projid' => '1',
            ],
            [
                'user_id' => 1,
                'title' => 'タイトル3',
                'key' => 'SK-3',
                'body' => 'サンプルメモ3',
                'status' => '1',
                'exe_user_id' => '1',
                'category' => '1',
                'priority' => '1',
                'start_dt' => '2022-12-01',
                'dead_dt' => '2022-12-02',
                'schedule' => '1',
                'achievement' => '2',
                'created_at' => now(),
                'updated_at' => now(),
                'difficult' => '1',
                'projid' => '1',
            ]
        ]);
    }
}
