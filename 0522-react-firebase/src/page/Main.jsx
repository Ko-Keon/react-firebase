import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Button from '../styledComponents/Button'
import { logout } from '../slice/userSlice';

export default function Main() {
  const user = useSelector((state)=>(state.user))
  const dispatch = useDispatch();
  return (
    <div>
        <h3>Main</h3>
        <p>로그인이 성공하였습니다</p>
        <p>{user && user.email}</p>
        <Button onClick={()=>{dispatch(logout())}}>로그아웃</Button>
    </div>
  )
}
