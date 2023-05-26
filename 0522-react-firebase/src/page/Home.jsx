import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
        <h3>HOME</h3>
        <p>로그인에 실패하면 HOME으로 돌아옵니다</p>
        <Link to='/loginform'>로그인</Link>
    </div>
  )
}
