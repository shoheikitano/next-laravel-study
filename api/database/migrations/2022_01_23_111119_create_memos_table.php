<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMemosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('memos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade')
                ->comment('ユーザーID');
            $table->string('key', 50)->comment('キー');
            $table->string('title', 50)->comment('タイトル');
            $table->string('body', 255)->comment('タスクの内容');
            $table->string('status', 1)->comment('状態');
            $table->string('exe_user_id', 100)->comment('担当者');
            $table->string('category', 1)->comment('区分');
            $table->string('start_dt', 200)->comment('開始日');
            $table->string('dead_dt', 200)->comment('期限日');
            $table->string('schedule', 200)->comment('予定工数');
            $table->string('achievement', 200)->comment('実績時間');
            $table->string('priority', 1)->comment('優先度');
            $table->string('difficult', 1)->comment('難しさ');
            $table->string('projid', 500)->comment('プロジェクトID');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('memos');
    }
}
