<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // 削除する
        // return [parent::toArray($request)];
        return [
            'id' => $this->id,
            'name' => $this->name,
            'userid' => $this->userid,
            'projid' => $this->projid,
            'iconpath' => $this->iconpath,
            'email' => $this->email,
        ];
    }
}
