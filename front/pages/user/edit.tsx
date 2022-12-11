import { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/useAuth';
import { axiosApi } from '../../lib/axios';
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import Link from 'next/link';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useUserState } from '../../atoms/userAtom';

type User = {
  name:string;
  projid:string;
  userid:string;
  iconpath:string;
  email:string;
  password:string;
  file:File;
};

// バリデーションメッセージの型
type Validation = {
  title?: string;
  body?: string;
};

const Edit: NextPage = () => {
  // ルーター定義
  const router = useRouter();
  // state定義
  const [validation, setValidation] = useState<Validation>({});
  const { checkLoggedIn } = useAuth();
  const { user, setUser } = useUserState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // ログイン中か判定
      const res: boolean = await checkLoggedIn();
      if (!res || user == null) {
        router.push('/');
      }
    };
    init();
    setIsLoading(false);
  }, []);

  // メモの登録
  const createMemo = (data: User) => {
    // バリデーションメッセージの初期化
    setValidation({});
    console.log(data);
    axiosApi
      // CSRF保護の初期化
      .get('/sanctum/csrf-cookie')
      .then((res) => {
        axiosApi
          .post('/api/editUser', data)
          .then((response: AxiosResponse) => {
            router.push('/');
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
    <div className='container'>
      <div className="sidemenu">
        <ul className="sidemenuList">
          <li className="sidemenuListItem" style={{color:'#222222'}}></li>
          <li className="sidemenuListItem" style={{color:'#808080'}}><SettingsIcon />　個人設定</li>
          <li className="sidemenuListItem" style={{color:'#222222', fontSize:'14px'}}><div className='linkItem'><Link href="/user/edit">　　　ユーザー情報</Link></div></li>
          <li className="sidemenuListItem" style={{color:'#222222', fontSize:'14px'}}><div className='linkItem'><Link href="/memos">　　　パスワード</Link></div></li>
        </ul>
      </div>
      <div className='home'>
        <div className='header'>SKbacklog</div>
        <div className='homeContainer'>
          <div className='dashContainer'>
            <div className='dashTitle'>ユーザー情報</div>
            <div className='insCondition' style={{marginTop:'30px'}}>
                <label className='keywordLabel'>ユーザーID</label><br/>
                <input
                  type='text' className='keyword' placeholder='件名' defaultValue={user.userid}
                  style={{width:'40vw'}}
                  {...register('userid', { required: '必須入力です。' })}
                />
            </div>
            <div className='insCondition'>
                <label className='keywordLabel'>ハンドルネーム</label><br/>
                <input
                  type='text' className='keyword' placeholder='件名' defaultValue={user.name}
                  style={{width:'40vw'}}
                  {...register('name', { required: '必須入力です。' })}
                />
            </div>
            <div className='insCondition'>
                <label className='keywordLabel'>メールアドレス</label><br/>
                <input
                  type='text' className='keyword' placeholder='件名' defaultValue={user.email}
                  style={{width:'40vw'}}
                  {...register('email', { required: '必須入力です。' })}
                />
            </div>
            {/* <div className='insCondition'>
                <label className='keywordLabel'>アイコン</label><br/>
                <input
                  type='file' className='keyword' placeholder='件名'
                  style={{width:'40vw', color:'#222222'}}
                  {...register('file', { required: '必須入力です。' })}
                />
            </div> */}
            <div style={{width:'100%', textAlign:'right'}}>
              <button
                className='addButton'
                onClick={handleSubmit(createMemo)}
                style={{marginTop:'30px'}}
              >
                保存
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
          background-color: #F0F0F0;
          width:200px;
          height:100%;
          position: fixed;
          border-right: 1px solid;
          border-color:#C5C5C5;
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
          position: fixed;
          z-index: 9999;
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
          background-color:#ffffff;
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
          margin-top:5px;
          margin-left:32px;
          width:50vw;
        }
        .insDetailStatus {
          display:flex;
        }
        .keywordLabel {
          font-size:13px;
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
  )
};

export default Edit;
