import { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loading } from '../../components/Loading';
import { Header } from '../../components/Header';
import { SideMenu } from '../../components/SideMenu';
import { useAuth } from '../../hooks/useAuth';
import { axiosApi } from '../../lib/axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useUserState } from '../../atoms/userAtom';

// POSTデータの型
type MemoForm = {
  title: string;
  body: string;
  category: string;
  exe_user_id: string;
  priority: string;
  difficult: string;
  start_dt: string;
  dead_dt: string;
  schedule: string;
  achievement: string;
  projid:string;
};

type User = {
  id: string;
  name:string;
  projid:string;
};

// バリデーションメッセージの型
type Validation = {
  title?: string;
  body?: string;
};

// POSTデータの型
type ProjectForm = {
  id:string;
  pjname: string;
  pjnamefull: string;
};

const Post: NextPage = () => {
  // ルーター定義
  const router = useRouter();
  // state定義
  const [validation, setValidation] = useState<Validation>({});
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { checkLoggedIn } = useAuth();
  const { user, setUser } = useUserState();
  let memoDefault:ProjectForm = {
    id:"",
    pjname:"",
    pjnamefull:"",
  }
  const [project, setProject] = useState<ProjectForm>(memoDefault);

  // React-Hook-Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemoForm>();

  useEffect(() => {
    const init = async () => {
      // ログイン中か判定
      const res: boolean = await checkLoggedIn();
      if (!res || user == null) {
        router.push('/');
        return;
      }
      axiosApi
        .get('/api/users')
        .then((response: AxiosResponse) => {
          setUsers(response.data.users);
          axiosApi
            .get('/api/projects')
            .then((response: AxiosResponse) => {
              const projectUser:ProjectForm[] = response.data.projects.filter((project: ProjectForm) => {
                return project.id == user.projid
              })
              setProject(projectUser[0])
            })
            .catch((err: AxiosError) => console.log(err.response))
            .finally(() => setIsLoading(false));
        })
        .catch((err: AxiosError) => console.log(err.response))
        .finally(() => setIsLoading(false));
    };
    init();
  }, []);

  // メモの登録
  const createMemo = (data: MemoForm) => {
    // バリデーションメッセージの初期化
    setValidation({});
    setIsLoading(true);
    axiosApi
      // CSRF保護の初期化
      .get('/sanctum/csrf-cookie')
      .then((res) => {
        // APIへのリクエスト
        data.projid = user.projid
        axiosApi
          .post('/api/memos', data)
          .then((response: AxiosResponse) => {
            router.push('/memos');
          })
          .catch((err: AxiosError) => {
            // バリデーションエラー
            if (err.response?.status === 422) {
              const errors = err.response?.data.errors;
              // state更新用のオブジェクトを別で定義
              const validationMessages: { [index: string]: string } =
                {} as Validation;
              Object.keys(errors).map((key: string) => {
                validationMessages[key] = errors[key][0];
              });
              // state更新用オブジェクトに更新
              setValidation(validationMessages);
            }
            if (err.response?.status === 500) {
              alert('システムエラーです！！');
            }
          });
      });
  };
  if (isLoading) return <Loading />;
  return (
    <div>
      <Header />
      <div className='container'>
        <SideMenu />
        <div className='home'>
          <div className='header'>{project.pjnamefull}（{project.pjname}）</div>
          <div className='homeContainer'>
            <div className='dashContainer'>
              <div className='dashTitle'>課題の追加</div>
              <div className='searchCondition'>
                <div className="selectdiv">
                  <label>
                    <select
                      id = 'category'
                      {...register('category', {})} >
                        <option value="1">タスク</option>
                        <option value="2">要望</option>
                        <option value="3">不具合</option>
                        <option value="4">その他</option>
                    </select>
                  </label>
                </div>
                <button
                  className='addButton'
                  onClick={handleSubmit(createMemo)}
                >
                  追加
                </button>
              </div>
              <div className='insCondition'>
                  <input
                    type='text' className='keyword' placeholder='件名'
                    {...register('title', { required: '必須入力です。' })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name={'title'}
                    render={({ message }) => (
                      <p className='py-3 text-red-500'>{message}</p>
                    )}
                  />
                  {validation.title && (
                    <p className='py-3 text-red-500'>{validation.title}</p>
                  )}
              </div>
              <div className='insDetail'>
                  <textarea
                    name="" id="" cols = {30} rows = {10} placeholder="課題の詳細"
                    {...register('body', {})}
                  ></textarea>
                  <div className='insDetailStatus'>
                    <div className='statusContent'>
                      <div className='keywordDiv3'>状態</div>
                      <div className='keywordDiv2'>未対応</div>
                    </div>
                    <div className='statusContent'>
                      <div className='keywordDiv'>担当者</div>
                      <div className="selectdiv">
                        <label>
                          <select
                            id = 'exe_user_id'
                            {...register('exe_user_id', {})} >
                              {users.map((user: User, index) => (
                                <option key={index} value={user.id}>{user.name}</option>
                              ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className='insDetailStatus'>
                    <div className='statusContent'>
                      <div className='keywordDiv'>優先度</div>
                      <div className="selectdiv">
                        <label>
                          <select
                            id = 'priority'
                            {...register('priority', {})} >
                              <option value='1'>高</option>
                              <option value='2'>中</option>
                              <option value='3'>低</option>
                          </select>
                        </label>
                      </div>
                    </div>
                    <div className='statusContent'>
                      <div className='keywordDiv'>区分　</div>
                      <div className="selectdiv">
                        <label>
                          <select
                            id = 'difficult'
                            {...register('difficult', {})} >
                              <option value="1">難しい</option>
                              <option value="2">普通</option>
                              <option value="3">簡単</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className='insDetailStatus'>
                    <div className='statusContent'>
                      <div className='keywordDiv'>開始日</div>
                      <div className='keywordDiv2'><input type='date' className='keyword' id = 'start_dt' {...register('start_dt', {})}/></div>
                    </div>
                    <div className='statusContent'>
                      <div className='keywordDiv'>期限日</div>
                      <div className='keywordDiv2'><input type='date' className='keyword' id = 'dead_dt' {...register('dead_dt', {})}/></div>
                    </div>
                  </div>
                  <div className='insDetailStatus'>
                    <div className='statusContent'>
                      <div className='keywordDiv'>予定</div>
                      <div className='time'><input type='text' className='keyword' placeholder='9.0h' id = 'schedule' {...register('schedule', {})}/></div>
                    </div>
                    <div className='statusContent'>
                      <div className='keywordDiv'>実績</div>
                      <div className='time'><input type='text' className='keyword' placeholder='8.0h' id = 'achievement' {...register('achievement', {})}/></div>
                    </div>
                  </div>
              </div>
              <div style={{width:'100%', textAlign:'right'}}>
                <button
                  className='addButton'
                  onClick={handleSubmit(createMemo)}
                  style={{marginTop:'30px'}}
                >
                  追加
                </button>
              </div>
              <div style={{height:'50px'}}></div>
            </div>
          </div>
        </div>
        <style>
          {`
          .addButton {
            background-color: #4caf93;
            color:#ffffff;
            width:120px;
            height:35px;
            border-radius: 4px;
          }
          .sidemenu {
            background-color: #4caf93;
            width:200px;
            height:100%;
            position: fixed;
          }
          .container {
            display:flex;
            width:100%;
            height:100vh;
            max-width:none;
          }
          .sidemenuListItem {
            color:white;
            height:50px;
            padding-left:16px;
            padding-top:14px;
            display:flex;
          }
          .header {
            color:#222222;
            height:50px;
            padding-left:30px;
            padding-top:12px;
            border-bottom: 1px solid;
            border-color:#C5C5C5;
            position:absolute;
            background-color:#ffffff;
            width:100%;
            position: absolute;
          }
          .home {
            width:100%;
            height:100vh;
            position:relative;
            margin-left:200px;
          }
          .memo {
            background-color:#f0f0f0;
          }
          .dashTitle {
            margin-top:32px;
            margin-left:32px;
            font-weight:bold;
          }
          .taskTable {
            margin-top:32px;
            margin-left:32px;
            border: 1px solid #C5C5C5;
            border-radius: 4px;
            border-collapse:collapse;
            background-color:#ffffff;
          }
          .insDetail {
            background-color:#ffffff;
            width:70vw;
            border: 1px solid #C5C5C5;
            border-radius: 4px;
            margin-top:7px;
            margin-left:32px;
            padding-bottom:20px;
          }
          .taskHeader {
            font-weight:medium;
            height:37px;
            font-size:12px;
            color:#00836b;
            border-bottom: 2px solid #C5C5C5;
          }
          .homeContainer {
            padding-top:50px;
            display:flex;
            height:100%;
          }
          body {
            background-color:#f0f0f0;
          }
          .tableData {
            height:47px;
            font-size:12px;
            border: 1px solid #C5C5C5;
          }
          .taskHeaderCategory {
            width:106px;
          }
          .taskHeaderKey {
            width:123px;
          }
          .taskHeaderContent {
            width:300px;
          }
          .tdCenter {
            text-align:center;
          }
          .tdPadding {
            padding-left:10px;
          }
          textarea {
            border: 1px solid #aaa;
            border-radius: 4px;
            margin: 15px 27px;
            height:300px;
            outline: none;
            padding: 8px;
            box-sizing: border-box;
            transition: 0.3s;
            font-size:13px;
            width:65vw;
          }
          textarea:focus {
            border-color: #00836b;
            box-shadow: 0 0 3px 0 #00836b;
          }
          input[type="text"] {
            width: 100%;
            border: 1px solid #aaa;
            border-radius: 4px;
            margin: 8px 0;
            outline: none;
            padding: 8px;
            box-sizing: border-box;
            transition: 0.3s;
            font-size:13px;
          }
          input[type="text"]:focus {
            border-color: #00836b;
            box-shadow: 0 0 3px 0 #00836b;
          }
          input[type="date"] {
            width: 13vw;
            border: 1px solid #aaa;
            border-radius: 4px;
            outline: none;
            padding: 8px;
            box-sizing: border-box;
            transition: 0.3s;
            margin-top:-9px;
            font-size:13px;
          }
          input[type="date"]:focus {
            border-color: #00836b;
            box-shadow: 0 0 3px 0 #00836b;
          }
          .searchCondition {
            margin-top:34px;
            margin-left:32px;
            color:#222222;
            display:flex;
            justify-content: space-between;
          }
          .insCondition {
            margin-left:32px;
            width:70vw;
            color:#222222;
            display:flex;
          }
          .insDetailStatus {
            display:flex;
          }
          .keywordLabel {
            font-size:13px;
            color:#aaa;
          }
          .keywordDiv {
            font-size:13px;
            color:#aaa;
            margin-right:8vw;
          }
          .keywordDiv2 {
            font-size:13px;
            color:#222222;
          }
          .keywordDiv3 {
            font-size:13px;
            color:#aaa;
            margin-right:10vw;
          }
          .time {
            margin-top:-17px;
            margin-left:13px;
          }
          .statusContent {
            height:55px;
            padding-top:17px;
            padding-left:10px;
            width:31vw;
            display:flex;
            margin-left:30px;
            border-top: 1px solid #aaa;
          }
          .linkItem {
            padding-left:10px;
          }
          .selectdiv {
            position: relative;
            /*Don't really need this just for demo styling*/
            margin-top:-13px;
            margin-right:20px;
            float: left;
          }
          
          /* IE11 hide native button (thanks Matt!) */
          select::-ms-expand {
          display: none;
          }
          
          .selectdiv:after {
            content: '▼';
            font: 13px "Consolas", monospace;
            color: #4caf93;
            right: 11px;
            /*Adjust for position however you want*/
            
            top: 14px;
            /*left line */
            
            position: absolute;
            pointer-events: none;
          }
          
          .selectdiv select {
            transition: 0.3s;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            /* Add some styling */
            
            display: block;
            width: 210px;
            max-width: 320px;
            height: 37px;
            float: right;
            margin: 5px 0px;
            padding: 0px 24px;
            font-size: 13px;
            line-height: 1.75;
            color: #333;
            background-color: #ffffff;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #aaa;
            -ms-word-break: normal;
            word-break: normal;
          }
          select:focus {
            border-color: #00836b;
            box-shadow: 0 0 3px 0 #00836b;
          }
          select:focus-visible {
            border-color: #00836b;
            box-shadow: 0 0 3px 0 #00836b;
            outline: 0px solid black;
          }
          `}
        </style>
      </div>
    </div>
  )
};

export default Post;
