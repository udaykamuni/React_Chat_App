import React from 'react'
import "./detail.css"
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/UserStore'
import { useChatStore } from '../../lib/chatStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

export default function Detail() {
  const { chatId, user , isCurrentUserBlocked , isReceiverBlocked , changeBlock } = useChatStore()
  const {CurrentUser} = useUserStore()

  const handleBlock = async ()=>{
     if(!user) return ;

     const userDocRef = doc(db, "users", CurrentUser.id);

     try{
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock()
     }catch(err){
       console.log(err)
     }
  }
  const currentDate = new Date();
  const formattedDate = currentDate.toDateString();
  const formattedTime = currentDate.toLocaleTimeString();
  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar||"./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>
          <span style={{color : "#E23F70"}}>{formattedDate}</span> | <span style={{color:"#3FE296"}}>{formattedTime}</span>
        </p>

      </div>
      <div className="info">
        <div className="option">
          <div className="title">
             <span>Chat Setting</span>
             <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
             <span>Chat Setting</span>
             <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title"> 
             <span>Privacy % help</span>
             <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
             <span>Shared Photos</span>
             <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
              <img src="image 2.jpeg" alt="" />
              <span>photo_2024_2.png</span>
              </div>
                <img src="./download.png" alt="" className='icon'/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
              <img src="image 2.jpeg" alt="" />
              <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className='icon' />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
              <img src="image 2.jpeg" alt="" />
              <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className='icon'  />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
             <span>Shared Files</span>
             <img src="./arrowUp.png" alt="" />
          </div>
        </div>
      <button onClick={handleBlock}>
        { isCurrentUserBlocked 
          ? "you are Blocked" 
          :  isReceiverBlocked 
          ? "User blocked" 
          : "Block User"}
      </button>
      <button className='logout' onClick={()=> auth.signOut() } >Logout</button>
      </div>
    </div>
  )
}
