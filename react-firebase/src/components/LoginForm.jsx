import React, { useState } from 'react'

// firebase 초기화 하면서 들고온 auth
import { auth } from '../database/firebase';
// firebase에서 제공하는 메소드 가져옴
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'

export default function LoginForm() {
    // input 태그에 있는 값을 가져오는 state
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    // react가 실행되는 동안에 저장 될 user 데이터
    // accessToken은 세션이나 브라우저에 저장해서 로그인 확인
    // {email, uid, displayName}
    const [user,setUser] = useState(null);


    // 이메일 회원가입 로그인 메소드
    const onEmailLogin = (e) => {
        e.preventDefault();
        // 구글에서 제공하는 이메일 메소드 사용
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // 회원가입 성공했을 때
            const user = userCredential.user;
            console.log(user)
            setUser(
                {
                    uid : user.uid,
                    email : user.email,
                    displayname : user.displayName,
                }
            )
        })
        .catch((error) => {
            // 회원가입 실패했을 때
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode,errorMessage)
            if(errorCode =="auth/email-already-in-use"){
                alert('동일한 이메일이 있습니다');
            }
            else if (errorCode == "auth/weak-password") {
                alert('비밀번호를 6자리 이상 입력하세요')
            }
        });
    }

    // 이메일 로그인 메소드
    const onClickLogin = () => {
        // async와 await를 이용하여 firebase 메소드 사용(비동기 함수로 만들기)
        async function getLogin(){
            // 오류가 날 가능성이 있는 모든 코드를 try에 작성
            try{
                const userCredential = await signInWithEmailAndPassword(auth, email, password)
                const user = userCredential.user;
                console.log(user);
                setUser(
                    {
                        uid : user.uid,
                        email : user.email,
                        displayname : user.displayName,
                    }
                )
            }
            // 오류가 났을 때 실행 할 코드
            // 오류가 나면 화면이 멈추는 것이 아니라 오류 
            // catch를 실행하고 다른 아래쪽 코드를 실행
            catch(error){
                console.log(error.code, error.message)
            }

        }
        getLogin()
    }

  return (
    <div>
        <h3>로그인 폼입니다</h3>
        <form onSubmit={onEmailLogin}>
            <label htmlFor="">이메일</label>
            <input type="email" required
                onChange={(e)=>{setEmail(e.target.value)}}
                value={email}
            /> <br />
            <label htmlFor="">비밀번호</label>
            <input type="password" required
                onChange={(e)=>{setPassword(e.target.value)}}
                value={password}
            /> <br />
            <input type="submit" value="회원가입" />
        </form>
            <button type='button' onClick={onClickLogin}>로그인</button>
        <h3>{user ? user.email : "로그인 되지 않았습니다."}</h3>
    </div>
  )
}
