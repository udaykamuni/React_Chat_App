import React from 'react'
import './login.css'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import {auth, db} from '../../lib/firebase'
import {doc , setDoc} from 'firebase/firestore'
import {upload} from '../../lib/upload'
import { useState } from 'react'

export default function Login() {

  const [avatar, setAvatar] = useState({
    file:null,
    url:"",
  })

  const [loading, setLoading] = useState(false)

  const handleImage = (e) =>{
    if(e.target.files[0]){
      setAvatar(() =>({
       file : e.target.files[0],
       url: URL.createObjectURL(e.target.files[0])
      }))
    }
  } 

  const handleLogin = async (e) =>{
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target);
    const {email, password} = Object.fromEntries(formData )
    try{
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('successfully login')
    }   
    catch(err){
      console.log(err)
      toast.error(err.message)
      toast.warn("please check the details you have entered")
    } 
    finally{
      setLoading(false)
    }
  };

  const handleRegister = async (e) =>{
    e.preventDefault()
    setLoading(true);
    const formData = new FormData(e.target);

    const {username, email, password} = Object.fromEntries(formData);
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password); 

      const imgUrl = await upload(avatar.file)

      await setDoc(doc(db, "users", res.user.uid),{
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked:[], 
      });
      await setDoc(doc(db, "userChats", res.user.uid),{
        chats :[],
      });
      toast.success("ACCOUNT CREATED👍")
    }
    catch(err){
      console.log(err)
      console.log("this is Loginx")
      toast.error(err.message)
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className='Login'>
      <div className="item">
        <h2>Welcome Back !!</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="Email" 
            placeholder='example@gmail.com' 
            name='email' 
          />
          <input 
            type="password"
            placeholder='password'
            name='password' 
          />
          <button disabled={loading}>{loading ? 'Loading' :'Sign In'}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create Account</h2>

        {/* // form data */}

      <form onSubmit={handleRegister}>
        <label htmlFor='file'>
          <img src={avatar.url || "./avatar.png" } alt="" />
          upload Image</label>
        <input type="file" id='file' style={{display:"none"}} onChange={handleImage}/>
        <input 
          type="text"
          placeholder='UserName'
          name='username' 
        />
          <input 
            type="Email" 
            placeholder='example@gmail.com' 
            name='email' 
          />
          <input 
            type="password"
            placeholder='password'
            name='password' 
          />
          <button disabled={loading}>{loading ? 'Loading': 'Sign Up'}</button>
        </form>
      </div>
    </div>
  )
}
