<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('project')->insert([
            [
                'pjname' => 'SA',
                'pjnamefull' => 'テストプロジェクト',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
