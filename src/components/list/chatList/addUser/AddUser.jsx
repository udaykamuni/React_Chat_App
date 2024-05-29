import React, { useState } from 'react'
import './addUser.css'
import { arrayUnion, collection, doc, getDocs,getDoc, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../../../../lib/firebase';
import { useUserStore } from '../../../../lib/UserStore';



export default function AddUser() {
  const [user, setUser] = useState(null);

  const {CurrentUser} = useUserStore()


  const handleSearch = async (e) =>{
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const username = formData.get("username");

    try{
      const userRef = collection(db, "users"); // Create a query against the collection.
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q)

      if(!querySnapShot.empty){
        setUser(querySnapShot.docs[0].data());
      }
    }
    catch(err){
      console.log("search bar error",err)
    }

  }

 const handleAdd = async () => {
  const chatRef = collection(db,"chats"); // Ensure there's no leading space in the collection name
  const userChatsRef = collection(db,"userChats");

  try {
    const newChatRef = doc(chatRef); // This creates a new document reference in the "chats" collection
    await setDoc(newChatRef, {
      createdAt: serverTimestamp(),
      messages: [],
    });

   // const userDocRef = doc(userChatsRef, user.id); // Correct variable name for consistency

    // No need to get the document snapshot if you're only updating the document.
    // Directly use the DocumentReference for updating.

    await updateDoc(doc(userChatsRef, user.id), { // Use the DocumentReference directly
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "", 
        receiverId: CurrentUser.id,
        updatedAt: Date.now(),
      })
    });

    //const currentUserDocRef = doc(userChatsRef,CurrentUser.id);

    await updateDoc(doc(userChatsRef,CurrentUser.id), { // Use the DocumentReference directly
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "", 
        receiverId: user.id,
        updatedAt: Date.now(),
      })
    });

    console.log(user.id);

  } catch (err) {
    console.log("error in updating", err);
  }
};

  
  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder='Username' name='username' />
        <button>Search</button>
      </form>
      {user && <div className="user">
        <div className="detail">
          <img src={user.avatar ||"./avatar.png"} alt="" />
          <span>{user.  username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>}
    </div>
  )
}
