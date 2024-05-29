import React, { useEffect, useState } from 'react'
import "./chatList.css"
import AddUser from './addUser/AddUser'
import { useUserStore } from '../../../lib/UserStore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';

export default function ChatList() {

  //const [chats, setChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] =  useState(false)
  const [input, setInput] =  useState("")

  const {CurrentUser} = useUserStore();
  const { chatId , changeChat} = useChatStore();
  useEffect(()=>{
    const unSub = onSnapshot(doc(db, "userChats", CurrentUser.id), async (res) => {
     const items = res.data().chats; 
     
        const promises = items.map( async (item) =>{
          const userDocRef = doc(db,"users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data()
          return {...item, user}
     
     }); 

     if (promises.length > 0) {
      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    }

    //  const chatData = await Promise.all(promises)

    //  setChats(chatData.sort((a,b)=> b.updatedAt - a.updatedAt));
     });

    return () =>{
      unSub();
    }
  },[CurrentUser.id]);


  const handleSelect = async (chat)=>{

    const userChats = chats.map((item)=>{
      const {user, ...rest} = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userChats", CurrentUser.id)

    try{
      await updateDoc(userChatsRef,{
        chats:userChats,
      })
      changeChat(chat.chatId,chat.user);

    }catch(err){
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c)=>{
    c.user.username.toLowerCase().includes(input.toLowerCase())
  })

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search" />
          <input type="text" placeholder='Search' onChange={(e) => setInput(e.target.value)}/>
        </div>
        <img src={addMode ? './minus.png' : './plus.png'} alt="plus symbol" className='add' 
        onClick={()=>setAddMode(prev => !prev)}
        />
      </div>
      {chats.map((chat) => (
        <div 
          className="item" 
          key={chat.chatId} 
          onClick={()=>handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}  
        >
        <img src={chat.user.blocked.includes(CurrentUser.id) ? "./avatar.png":chat.user.avatar ||"./avatar.png"} alt="" /> 
        <div className="texts">
            <span>{chat.user.blocked.includes(CurrentUser.id) ? "User" : chat.user.username}</span>
            <p>{chat.lastMessage}</p>
        </div> 
      </div>
        ))}
      {addMode &&  <AddUser/>}
    </div>
  )
}
  