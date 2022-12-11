import { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/useAuth';
import { axiosApi } from '../../lib/axios';
import React from 'react';
import { useUserState } from '../../atoms/userAtom';
import { Header } from '../../components/Header';
import { SideMenu } from '../../components/SideMenu';

type Memo = {
  title: string;
  key:string;
  body: string;
  status:string;
  username:string;
  exeusername:string;
  priority:string;
  category:string;
  start_dt:string;
  dead_dt:string;
  schedule:string;
  achievement:string;
  difficult:string;
};

// POSTデータの型
type ProjectForm = {
  id:string;
  pjname: string;
  pjnamefull: string;
};

const View: NextPage = () => {
  // ルーター定義
  const router = useRouter();
  // state定義
  const { checkLoggedIn } = useAuth();
  let memoDefault:Memo = {
    title:"",
    key:"",
    body:"",
    status:"",
    username:"",
    exeusername:"",
    priority:"",
    category:"",
    start_dt:"",
    dead_dt:"",
    schedule:"",
    achievement:"",
    difficult:"",
  }
  const [memo, setMemo] = useState<Memo>(memoDefault);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useUserState();
  let projDefault:ProjectForm = {
    id:"",
    pjname:"",
    pjnamefull:"",
  }
  const [project, setProject] = useState<ProjectForm>(projDefault);

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
        .get('/api/memo?key='+router.query.key)
        .then((response: AxiosResponse) => {
          setMemo(response.data.memo);
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
              <div className='dashKey'>{memo.key}</div>
              <div className='searchCondition'>
                <div className='dashTitle'>{memo.title}</div>
                <button
                  className='addButton'
                  onClick={() => router.push("/memos/edit?key=" + memo.key)}
                >
                  編集
                </button>
              </div>
              <div className='insDetail'>
                <div className='insDetailUser'>{memo.username}</div>
                <div className='insDetailContent'>{memo.body}</div>
                  <div className='insDetailStatus'>
                    <div className='statusContent'>
                      <div className='keywordDiv3'>状態</div>
                      <div className='keywordDiv2'>{memo.status}</div>
                    </div>
                    <div className='statusContent'>
                      <div className='keywordDiv'>担当者</div>
                      <div className='keywordDiv2'>{memo.exeusername}</div>
                    </div>
                  </div>
                  <div className='insDetailStatus'>
                    <div className='statusContent'>
                      <div className='keywordDiv'>優先度　</div>
                      <div className='keywordDiv2'>{memo.priority}</div>
                    </div>
                    <div className='statusContent'>
                      <div className='keywordDiv'>難しさ</div>
                      <div className='keywordDiv2'>{memo.difficult}</div>
                    </div>
                  </div>
                  <div className='insDetailStatus'>
                    <div className='statusContent'>
                      <div className='keywordDiv'>開始日　</div>
                      <div className='keywordDiv2'>{memo.start_dt}</div>
                    </div>
                    <div className='statusContent'>
                      <div className='keywordDiv'>期限日</div>
                      <div className='keywordDiv2'>{memo.dead_dt}</div>
                    </div>
                  </div>
                  <div className='insDetailStatus'>
                    <div className='statusContent'>
                      <div className='keywordDiv'>予定　　</div>
                      <div className='keywordDiv2'>{memo.schedule}</div>
                    </div>
                    <div className='statusContent'>
                      <div className='keywordDiv'>実績　</div>
                      <div className='keywordDiv2'>{memo.achievement}</div>
                    </div>
                  </div>
              </div>
              <div style={{height:'50px'}}></div>
            </div>
          </div>
        </div>
        <style>
          {`
          .insDetailUser {
            padding-top:20px;
            padding-left:30px;
          }
          .insDetailContent {
            padding-top:20px;
            padding-left:40px;
            padding-bottom:30px;
            font-size:14px;
          }
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
            margin-top:10px;
            margin-left:32px;
            font-weight:bold;
          }
          .dashKey {
            margin-top:32px;
            margin-left:32px;
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
            margin-top:10px;
            margin-left:0px;
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

export default View;
