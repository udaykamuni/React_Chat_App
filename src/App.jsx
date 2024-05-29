import React from 'react'
import { useEffect } from 'react'
import Chat from './components/chat/Chat'
import Detail from './components/detail/Detail'
import List from './components/list/List'
import Login from './components/login/Login'
import Notification from './components/notification/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/UserStore'
import { useChatStore } from './lib/chatStore'



const App =() => {
  const {CurrentUser, isLoading, fetchUserInfo} = useUserStore();

  const {chatId} = useChatStore();


  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user)=>{
      // console.log('user3')
       fetchUserInfo(user?.uid);
    });

    return() =>{
      unSub();
    }
  },[fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {CurrentUser ? (
      <>
        <List/>
       {chatId && <Chat/>}
       {chatId && <Detail/>}
      </>

      ) : (
        <Login/>
      )}
      <Notification></Notification>
    </div>
  )
}
export default App;