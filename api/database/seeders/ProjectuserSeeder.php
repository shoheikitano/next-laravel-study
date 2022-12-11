<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectuserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('projectuser')->insert([
            [
                'projid' => '1',
                'userid' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
