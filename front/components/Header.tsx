import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { axiosApi } from '../lib/axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useUserState } from '../atoms/userAtom';
import Link from 'next/link';
import Image from 'next/image'

// POSTデータの型
type ProjectForm = {
  id:string;
  pjname: string;
  pjnamefull: string;
};

type Memo = {
  title: string;
  key:string;
  body: string;
  status:string;
  username:string;
  category:string;
  start_dt:string;
  dead_dt:string;
  schedule:string;
  achievement:string;
};

type Page = {
  page: number;
};

let total = 0;

export const Header = () => {
  const router = useRouter();
  let memoDefault:ProjectForm = {
    id:"",
    pjname:"",
    pjnamefull:"",
  }
  const [project, setProject] = useState<ProjectForm>(memoDefault);
  // state定義
  const [projects, setProjects] = useState<ProjectForm[]>([]);
  const [isProjectIns, setIsProjectIns] = useState(false);
  const [isProjectList, setIsProjectList] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const { user, setUser } = useUserState();
  const { checkLoggedIn } = useAuth();
  const closeWithClickOutSideMethod = (e, setter) => {
    if (e.target === e.currentTarget) {
      setter(false);
    }
  };
  // React-Hook-Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectForm>();

  // 初回レンダリング時にAPIリクエスト
    // 初回レンダリング時にAPIリクエスト
    useEffect(() => {
      const init = async () => {
        // ログイン中か判定
        const res: boolean = await checkLoggedIn();
        if (!res || user == null) {
          router.push('/');
          return;
        }
        axiosApi
          .get('/api/projects')
          .then((response: AxiosResponse) => {
            setProjects(response.data.projects);
          })
          .catch((err: AxiosError) => console.log(err.response))
          .finally();
      };
      init();
    }, []);

  // メモの登録
  const createProject = (data: ProjectForm) => {
    // バリデーションメッセージの初期化
    axiosApi
      // CSRF保護の初期化
      .get('/sanctum/csrf-cookie')
      .then((res) => {
        // APIへのリクエスト
        axiosApi
          .post('/api/project', data)
          .then((response: AxiosResponse) => {
            setIsProjectIns(false);
          })
          .catch((err: AxiosError) => {
            if (err.response?.status === 500) {
              alert('システムエラーです！！');
            }
          });
      });
  };

  // メモの登録
  const changeProject = (projid: string) => {
    // バリデーションメッセージの初期化
    const userForProject = {
      id: user.id,
      userid: user.userid,
      projid: projid,
      iconpath: user.iconpath,
      email: user.email,
      password: user.password,
      name: user.name
    }
    setUser(userForProject)
    setIsProjectList(false)
    router.push('/memos/?projid=' + user.projid +'&page=1');
  };

  return (
    <div>
      {isProjectIns
          ?<div className="overlay" onClick={(e) => {closeWithClickOutSideMethod(e, setIsProjectIns);}}>
              <div className="content">
                <div className='projectInsTitle'>プロジェクトの追加</div>
                <div className="projectNameinput">
                  <label className='keywordLabel'>プロジェクト名</label><br/>
                  <input type='text' className='keyword' style={{width:'40vw'}} placeholder='プロジェクト名を入力してください' id = 'pjnamefull' {...register('pjnamefull', {})}/>
                </div>
                <div className="projectNameinput"  style={{marginBottom:'40px'}}>
                  <label className='keywordLabel'>プロジェクトキー</label><br/>
                  <input type='text' className='keyword' style={{width:'40vw'}} placeholder='プロジェクトキーを入力してください'  id = 'pjname' {...register('pjname', {})}/><br/>
                  <p style={{fontSize:'12px', color:'#F42858'}}>プロジェクトキーはプロジェクトのコードネームです。短い略称がいいでしょう。</p>
                  <p style={{fontSize:'12px', color:'#CBCBCB'}}>例：プロジェクト名がバックログ→キーは「BLG＿2」</p>
                </div>
                <button
                  className='addButton'
                  onClick={handleSubmit(createProject)}
                >
                  追加
                </button>
              </div>
            </div>
        : null
      }
      {isProjectList
          ?<div className="overlay" onClick={(e) => {closeWithClickOutSideMethod(e, setIsProjectList);}}>
              <div className="contentProjectList">
                <div className='projectListTitle'>プロジェクト</div>
                {projects.map((project: ProjectForm, index) => {
                  return <div className="projectListName" style={{fontSize:'14px'}} onClick={() => changeProject(project.id)} key={index}>{project.pjnamefull}</div>
                })}
              </div>
            </div>
        : null
      }
      {isUser
          ?<div className="overlay" onClick={(e) => {closeWithClickOutSideMethod(e, setIsUser);}}>
              <div className="contentUserList">
                <div className="projectListName" style={{fontSize:'14px'}}><Link href="/user/edit">個人設定</Link></div>
                <div className="projectListName" style={{fontSize:'14px'}}><Link href="/">ログアウト</Link></div>
              </div>
            </div>
        : null
      }
      <div className="headerSupser">
        <div style={{display:'flex'}}>
          <div>SK backlog</div>
          <div className="headerSuperItem" onClick={() => setIsProjectList(true)}>プロジェクト</div>
          <div className="headerSuperItem" onClick={() => setIsProjectIns(true)}>プロジェクトの追加</div>
        </div>
        <div className="headerSuperItemUser" style={{display:'flex'}}  onClick={() => setIsUser(true)}><Image src="/userIcon.png" alt="Picture of the author" width={34} height={32}/><div style={{fontSize:'16px', paddingRight:'20px', paddingLeft:'10px', paddingTop:'4px'}}>kitano</div></div>
      </div>
        <style>
          {`
          .projectListTitle {
            background-color:#2B9A7A;
            border-radius: 4px 4px 0px 0px;
            color:#ffffff;
            padding-left:10px;
            padding-top:10px;
            padding-bottom:10px;
            font-weight:bold;
          }
          .projectListName {
            padding-top:8px;
            padding-bottom:8px;
            padding-left:12px;
            border-bottom: 1px solid;
            border-color:#C5C5C5;
          }
          .projectNameinput {
            margin-top:24px;
            margin-left:12px;
          }
          .addButton {
            background-color: #4caf93;
            color:#ffffff;
            width:120px;
            height:35px;
            border-radius: 4px;
            float:right;
          }
          .overlay{
            /*　画面全体を覆う設定　*/
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background-color:rgba(0,0,0,0.5);
            z-index:9998;
            /*　画面の中央に要素を表示させる設定　*/
            display: flex;
            align-items: center;
            justify-content: center;
            
          }
          .content{
            z-index:9999;
            width:50%;
            height:60vh;
            padding: 1em;
            background:#fff;
            border-radius:4px;
          }
          .contentProjectList{
            position:absolute;
            top:57px;
            left:145px;
            z-index:9999;
            width:20%;
            background:#fff;
            border-radius:4px;
          }
          .contentUserList {
            position:absolute;
            top:45px;
            right:20px;
            z-index:9999;
            width:15%;
            background:#fff;
          }
          .contentProjectList:after {
            content: '▲';
            font: 16px "Consolas", monospace;
            color: #2B9A7A;
            right: 200px;
            top: -17px;
            position: absolute;
            pointer-events: none;
          }
          .headerSuperItem {
            font-size:14px;
            padding-top:3px;
            padding-left:40px;
          }
          .headerSuperItemUser {
            font-size:14px;
            padding-right:40px;
          }
          .headerSupser {
            color:#222222;
            height:45px;
            padding-left:30px;
            padding-top:10px;
            border-bottom: 1px solid;
            border-color:#C5C5C5;
            position:absolute;
            background-color:#EDF4F0;
            width:100%;
            position: fixed;
            z-index: 9998;
            display:flex;
            justify-content:space-between;
          }
          .totalCount {
            padding-top:10px;
            padding-left:5px;
            font-size:13px;
          }
          .categoryIcon {
            width:76px;
            height:19px;
            background-color:#4caf93;
            margin:0 auto;
            border-radius:8px;
            color:#ffffff;
          }
          ._3q06O {
            color:#4caf93;
          }
          ._2INQH {
            display:none;
          }
          .sidemenu {
            background-color: #4caf93;
            width:200px;
            height:100%;
            position: fixed;
            padding-top:45px;
          }
          .container {
            padding-top:45px;
            display:flex;
            width:100%;
            height:100vh;
            max-width:none;
          }
          body {
            background-color:#f0f0f0;
          }
          .sidemenuListItem {
            color:white;
            height:50px;
            padding-left:16px;
            padding-top:10px;
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
          .projectInsTitle {
            margin-top:20px;
            margin-left:12px;
            font-weight:bold;
          }
          .taskTable {
            margin-left:32px;
            border: 1px solid #C5C5C5;
            border-radius: 4px;
            border-collapse:collapse;
            background-color:#ffffff;
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
            background-color:#f0f0f0;
            height:100%;
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
          .tdCenterIcon {
            margin:0px auto;
          }
          .tdPadding {
            padding-left:10px;
          }
          input[type="text"] {
            width: 210px;
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
          .searchCondition {
            margin-top:20px;
            margin-left:32px;
            color:#222222;
            display:flex;
          }
          .pageCondition {
            margin-top:20px;
            margin-left:32px;
            color:#222222;
            display:flex;
            justify-content:space-between;
          }
          .keywordLabel {
            font-size:13px;
          }
          .linkItem {
            padding-left:10px;
          }
          .selectdiv {
            position: relative;
            /*Don't really need this just for demo styling*/
            margin-top:3px;
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
            
            top: 38px;
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
  )
};
