import { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/useAuth';
import { axiosApi } from '../../lib/axios';
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import Pagination from '@etchteam/next-pagination';
import { useForm } from 'react-hook-form';
import { useUserState } from '../../atoms/userAtom';
import { Header } from '../../components/Header';
import { SideMenu } from '../../components/SideMenu';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
      'margin-left':'32px'
    },
    inline: {
      display: 'inline',
    },
  }),
);

let total = 0;

const Memo: NextPage = () => {
  const classes = useStyles();
  const router = useRouter();
  let memoDefault:ProjectForm = {
    id:"",
    pjname:"",
    pjnamefull:"",
  }
  const [project, setProject] = useState<ProjectForm>(memoDefault);
  // state定義
  const [memos, setMemos] = useState<Memo[]>([]);
  const [projects, setProjects] = useState<ProjectForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectIns, setIsProjectIns] = useState(false);
  const [isProjectList, setIsProjectList] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const { checkLoggedIn } = useAuth();
  const { user, setUser } = useUserState();
  const [selectTask, setSelectTask] = useState<String>("0");
  const [selectStatus, setSelectStatus] = useState<String>("0");
  const [keyword, setKeyword] = useState<string>("");
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
  useEffect(() => {
    const init = async () => {
      // ログイン中か判定
      const res: boolean = await checkLoggedIn();
      if (!res || user == null) {
        router.push('/');
        return;
      }
      axiosApi
        .get('/api/memos?projid=' + user.projid +'&page=1')
        .then((response: AxiosResponse) => {
          total = response.data.total;
          setMemos(response.data.memos);
          axiosApi
            .get('/api/projects')
            .then((response: AxiosResponse) => {
              setProjects(response.data.projects);
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

  useEffect(() => {
    const init = async () => {
      // ログイン中か判定
      const res: boolean = await checkLoggedIn();
      if (!res) {
        router.push('/');
        return;
      }
      const page = {page:router.query.page}
      axiosApi
        .get('/api/memos?projid=' + user.projid +'&page=' + router.query.page)
        .then((response: AxiosResponse) => {
          total = response.data.total;
          setMemos(response.data.memos);
          axiosApi
            .get('/api/projects')
            .then((response: AxiosResponse) => {
              setProjects(response.data.projects);
            })
            .catch((err: AxiosError) => console.log(err.response))
            .finally(() => setIsLoading(false));
          })
        .catch((err: AxiosError) => console.log(err.response))
        .finally(() => setIsLoading(false));
    };
    init();
  }, [router.query.page]);
  // メモの登録
  const createProject = (data: ProjectForm) => {
    // バリデーションメッセージの初期化
    setIsLoading(true);
    axiosApi
      // CSRF保護の初期化
      .get('/sanctum/csrf-cookie')
      .then((res) => {
        // APIへのリクエスト
        axiosApi
          .post('/api/project', data)
          .then((response: AxiosResponse) => {
            setIsLoading(false);
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

  // メモの登録
  const search = () => {
    console.log(selectTask)
    console.log(selectStatus)
    console.log(keyword)
    axiosApi
        .get('/api/memos?projid=' + user.projid +'&task=' + selectTask +'&status=' + selectStatus +'&keyword=' + keyword +'&page=' + router.query.page)
        .then((response: AxiosResponse) => {
          total = response.data.total;
          setMemos(response.data.memos);
        })
        .catch((err: AxiosError) => console.log(err.response))
        .finally(() => setIsLoading(false));
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
              <div className='dashTitle'>検索条件</div>
              <div className='searchCondition'>
                <div className="selectdiv">
                  <label className='keywordLabel'>種別</label><br/>
                  <label>
                    <select onChange={e => setSelectTask(e.target.value)}>
                        <option selected value='0'> 未選択 </option>
                        <option value='1'>タスク</option>
                        <option value='2'>要望</option>
                        <option value='3'>不具合</option>
                        <option value='4'>その他</option>
                    </select>
                  </label>
                </div>
                <div className="selectdiv">
                  <label className='keywordLabel'>状態</label><br/>
                  <label>
                    <select onChange={e => setSelectStatus(e.target.value)}>
                        <option selected value='0'> 未選択 </option>
                        <option value='1'>未対応</option>
                        <option value='2'>処理中</option>
                        <option value='3'>処理済み</option>
                        <option value='4'>完了</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className='keywordLabel' style={{paddingTop:'3px', display:'block'}}>キーワード</label>
                  <input type='text' className='keyword' placeholder='キーワードを入力してください' value={keyword} onChange={(event) => setKeyword(event.target.value)} />
                </div>
                <div>
                  <button
                    className='addButton'
                    onClick={() => search()}
                    style={{marginTop:'31px',marginLeft:'20px'}}
                  >
                    追加
                  </button>
                </div>
              </div>
              <div className='pageCondition'>
                <div className="totalCount">
                  全{total}件　　　
                        {total > 10 && router.query.page != undefined
                          ? (Number(router.query.page)*10-9) + "件 〜 "
                          : ""
                        }
                        {total > 10 && router.query.page == undefined
                          ? "1件 〜 10件を表示"
                          : ""
                        }
                        {total > 10 && total >= Number(router.query.page)*10
                          ? (Number(router.query.page)*10) + "件を表示"
                          : ""
                        }
                        {total > 10 && total <= Number(router.query.page)*10
                          ? (total) + "件を表示"
                          : ""
                        }
                </div>
                {memos && total > 10 ? (
                <Pagination
                  sizes={[10]}
                  perPageText=""
                  total={total}
                />
              ): null}
              </div>
              <table className='taskTable'>
                <thead className='taskHeader'>
                  <tr>
                    <th className='taskHeaderCategory'>種別</th>
                    <th className='taskHeaderKey'>キー</th>
                    <th className='taskHeaderContent'>件名</th>
                    <th className='taskHeaderKey'>担当者</th>
                    <th className='taskHeaderCategory'>状態</th>
                    <th className='taskHeaderCategory'>開始日</th>
                    <th className='taskHeaderCategory'>期限日</th>
                  </tr>
                </thead>
                <tbody>
                {memos.map((memo: Memo, index) => {
                  return (
                    <tr className='tableData' key={index}>
                      <td className='tdCenter'>
                        {memo.category == "タスク"
                          ? <div className='categoryIcon' style={{backgroundColor:'#A1AF2F'}}>{memo.category}</div>
                          : ""
                        }
                        {memo.category == "要望"
                          ? <div className='categoryIcon' style={{backgroundColor:'#DC9925'}}>{memo.category}</div>
                          : ""
                        }
                        {memo.category == "不具合"
                          ? <div className='categoryIcon' style={{backgroundColor:'#EA2C00'}}>{memo.category}</div>
                          : ""
                        }
                        {memo.category == "その他"
                          ? <div className='categoryIcon' style={{backgroundColor:'#3B9DBD'}}>{memo.category}</div>
                          : ""
                        }
                      </td>
                      <td className='tdCenter'><Link  href={{ pathname: "/memos/view", query: {key: memo.key} }}>{memo.key}</Link></td>
                      <td className='tdPadding'>{memo.title}</td>
                      <td className='tdCenter'>{memo.username}</td>
                      <td className='tdCenter'>
                        {memo.status == "未対応"
                          ? <div className='categoryIcon' style={{backgroundColor:'#ED8077'}}>{memo.status}</div>
                          : ""
                        }
                        {memo.status == "処理中"
                          ? <div className='categoryIcon' style={{backgroundColor:'#4488C5'}}>{memo.status}</div>
                          : ""
                        }
                        {memo.status == "処理済み"
                          ? <div className='categoryIcon' style={{backgroundColor:'#5EB5A6'}}>{memo.status}</div>
                          : ""
                        }
                        {memo.status == "完了"
                          ? <div className='categoryIcon' style={{backgroundColor:'#A1AF2F'}}>{memo.status}</div>
                          : ""
                        }
                      </td>
                      <td className='tdCenter'>{memo.start_dt}</td>
                      <td className='tdCenter'>{memo.dead_dt}</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
              {memos && total > 10 ? (
                <Pagination
                  sizes={[10]}
                  perPageText=""
                  total={total}
                />
              ): null}
              <div style={{height:'50px'}}></div>
            </div>
          </div>
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
    </div>
  )
};

export default Memo;
