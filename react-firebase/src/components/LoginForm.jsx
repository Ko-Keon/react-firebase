import React, { useState } from 'react'

// 파이어베이스 초기화하면서 들고온 auth
import { auth } from '../database/firebase';
// 파이어베이스에서 제공하는 메소드 가져옴
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginForm() {
    // input 태그에 있는 값을 가져오는 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // react가 실행되는 동안에 저장될 user데이터
  // accessToken은 세션이나 브라우저에 저장해서 로그인확인
  // { email, uid, displayName }
  const [user, setUser] = useState(null);

  // 이메일 회원가입 로그인 메소드
  const onEmailLogin = (e) => {
    e.preventDefault();
    // 구글에서 제공하는 이메일 메소드 사용
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // 회원가입에 성공했을때
        const user = userCredential.user;
        console.log(user)
        setUser(
            {
                uid : user.uid,
                email : user.email,
                displayName : user.displayName,
            }
        )
    })
    .catch((error) => {
        // 회원가입에 실패했을때
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        if(errorCode =="auth/email-already-in-use" ) {
            // alert이용하여 알려주거나, 태그를 이용해 알려줌
            alert('동일한 이메일이 있습니다');
        }
        else if (errorCode == "auth/weak-password") {
            alert('비밀번호를 6자리이상 적어주세요')
        }
    });
  }

  // 이메일 로그인 메소드
  const onClickLogin = () => {
    // async와 await 를 이용하여 파이어베이스메소드 사용
    // 비동기함수로 만들기 
    async function getLogin(){
        // 오류가 날 가능성이 있는 모든 코드를 try 에작성
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email,password);
            const user= userCredential.user;
            console.log(user);
            setUser(
                {
                    uid : user.uid,
                    email : user.email,
                    displayName : user.displayName,
                }
            )

        }
        // 오류가 났을때 실행할 코드
        // 오류가 나면 화면이 멈추는 것이아니라 
        // catch를 실행하고 다른 아래쪽의 코드를 실행
        catch(error) {
            console.log(error.code, error.message)
            if ( error.code == "auth/user-not-found" || 
                    error.code == "auth/wrong-password" ) {
                alert("없는 이메일이거나 비밀번호가 잘못되었습니다")
            }
        }
    }
    getLogin();

  }

  return (
    <div>
        <h3>로그인 폼입니다</h3>
        <form onSubmit={onEmailLogin}>
            <label htmlFor="">이메일</label>
            <input type="email" required
                onChange={(e)=>{setEmail(e.target.value)}}
                value={email}
            />
            <br />
            <label htmlFor="">비밀번호</label>
            <input type="password" required
                onChange={(e)=>{setPassword(e.target.value)}}
                value={password}
            />
            <br />
            <input type="submit" value="회원가입" />
            <button type='button' onClick={ onClickLogin }>로그인</button>
        </form>
        <h3>{user ? user.email :"로그인되지않았습니다"}</h3>
    </div>
  )
}
