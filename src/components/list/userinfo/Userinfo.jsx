import React from 'react';
import './userinfo.css';
import {useUserStore} from '../../../lib/UserStore'

export default function UserInfo() {
  const {CurrentUser} = useUserStore();

  return (
    <div className="userinfo">
      <div className="user">
        <img src={CurrentUser.avatar ||"./avatar.png" }alt="avatar" />
        <h2>{CurrentUser.username}  </h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="more" />
        <img src="./video.png" alt="video" />
        <img src="./edit.png" alt="edit" />
      </div>
    </div>
  );
}

