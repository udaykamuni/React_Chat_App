import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/UserStore';
import { upload } from '../../lib/upload'

export default function Chat() {

  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { chatId , user, isCurrentUserBlocked , isReceiverBlocked} = useChatStore()
  const {CurrentUser} = useUserStore()

  const endRef = useRef(null)

  const handleEmoji = (e) =>{
    setText((prev)=>prev + e.emoji);
    setOpen(false)
  }

  const handleImg = (e) =>{
    if(e.target.files[0]){
      setImg(() =>({
       file : e.target.files[0],
       url: URL.createObjectURL(e.target.files[0])
      }))
    } 
  }

  const handleSend =async ()=>{
    if(text === "") return ;
    
    let imgUrl = null;

    try{

      if(img.file){
        imgUrl = await upload(img.file)
      } 

      await updateDoc(doc(db,"chats",chatId),{
        messages: arrayUnion({
          senderId: CurrentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && {img : imgUrl}),

        }),
      });


      const userIDs = [CurrentUser.id, user.id];

      userIDs.forEach(async (id) =>{

        
        const userChatsRef = doc(db, "userChats", id)
        const userChatsSnapshot = await getDoc(userChatsRef);

        if(userChatsSnapshot.exists()){
          const userChatsData = userChatsSnapshot.data();
          
          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);
          
          userChatsData.chats[chatIndex].lastMessage = text
          userChatsData.chats[chatIndex].isSeen = id === CurrentUser.id ?  true : false
          userChatsData.chats[chatIndex].updatedAt = Date.now()
          
          await updateDoc(userChatsRef,{
          chats: userChatsData.chats,
        })  
      }
    });

    }catch(err){
      console.log(err);
    }

    setImg({
      file:null,
      url: "",
    })

    setText("");
  }

  useEffect(()=>{
     endRef.current?.scrollIntoView({behavior : 'smooth'} )
  },[])


  useEffect(()=>{
    const unSub = onSnapshot(doc(db, "chats", chatId), (res)=>{
      setChat(res?.data());
    })

    return () =>{
      unSub();
    };
  },[chatId])

  const currentDate = new Date();
  const formattedDate = currentDate.toDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  return ( 
    <div className="chat">
      <div className="top">
        <div className="User">
          <img src={user.avatar || "./avatar.png"} alt="avatar" />
          <div className="text">
            <span> {user.username}</span>
            <p>
            <span style={{color : "#E23F70"}}>{formattedDate}</span> | <span style={{color:"#3FE296"}}>{formattedTime}</span>
            </p>
          </div>
        </div>
        <div className="icon">
          <img src="./phone.png" alt="phone" />
          <img src="./video.png" alt="video" />
          <img src="./info.png" alt="info" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) =>(
            <div className={message.senderId === CurrentUser?.id ?  "message own" : "message"} key={message?.createdAt}>
          <div className="texts">
          {message.img && <img src={message.img} alt="avatar" />}
            <p>{message.text}</p>
               {/* <span>{}</span> */}
          </div>
        </div>  
        ))}
        {img.url && (
         <div className="message own">
          <div className="texts">
            <img src={img.url} alt=''/>
          </div>
        </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom"> 
         <div className="icons">
          <label htmlFor='file'>
           <img src="./img.png" alt="" />
          </label>
           <input 
           type="file" 
           id='file' 
           style={{display:"none"}} 
           onChange={handleImg}
           disabled={isCurrentUserBlocked || isReceiverBlocked}
           />
           <img src="./camera.png" alt="" />
           <img src="./mic.png" alt="" />
         </div>
         <input type="text" 
         placeholder={(isCurrentUserBlocked || isReceiverBlocked) ?"you cannot send a message " :'Type a message ...' }
         value={text}
         onChange={(e)=>setText(e.target.value)}/>
         <div className="emoji">
          <img src="./emoji.png" alt="emoji" onClick={()=>setOpen((prev) => !prev)}/>
          <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
          </div>
         </div>
         <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
          </button>
      </div>
    </div>
  );
}
