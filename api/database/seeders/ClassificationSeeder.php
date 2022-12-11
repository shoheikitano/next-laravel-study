<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('classification')->insert([
            [
                'classid' => 'ST',
                'class' => '1',
                'classname' => '未対応',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'ST',
                'class' => '2',
                'classname' => '処理中',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'ST',
                'class' => '3',
                'classname' => '処理済み',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'ST',
                'class' => '4',
                'classname' => '完了',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'PR',
                'class' => '1',
                'classname' => '高',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'PR',
                'class' => '2',
                'classname' => '中',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'PR',
                'class' => '3',
                'classname' => '低',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'CA',
                'class' => '1',
                'classname' => 'タスク',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'CA',
                'class' => '2',
                'classname' => '要望',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'CA',
                'class' => '3',
                'classname' => '不具合',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'CA',
                'class' => '4',
                'classname' => 'その他',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'DI',
                'class' => '1',
                'classname' => '難しい',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'DI',
                'class' => '2',
                'classname' => '普通',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'classid' => 'DI',
                'class' => '3',
                'classname' => '簡単',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
