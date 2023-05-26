import { createSlice } from '@reduxjs/toolkit'
import { signOut } from 'firebase/auth';
import { auth } from '../database/firebase';

export const userSlice = createSlice({
    name : 'user',
    // {name, email, photo, uid}
    initialState : null,
    // 구글 인증에 관한 메소드를 컴포넌트에서 진행하거나
    // 리덕스 슬라이스에서 진행할수 있다
    // 둘다 동일한 결과임으로 어느 방법을 선택해도괜찮다
    // 회원가입과 로그인 : 컴포넌트에서 진행 > loginUser 호출로그인
    // 로그아웃 : 리덕스 슬라이스에서 진행
    reducers : {
        // reducers안의 메소드에서는 state에 값을 할당하는 내용
        loginUser : (state, action)=> {
            console.log(action.payload)
            // action.payload로 전달할때 {name, email, photo,uid}

            // state의 값을 전체로 바꾸는 것은 리덕스 툴킷에서
            // 막아두었으므로, 전체 값을 바꿀 때는 return으로 수정
            // *state의 속성값의 일부를 바꿀 때는 직접접근해서 바꿀 수 있다
            return action.payload;
        },
        logoutUser : ()=> {
            return null;
        }
    },
})

// 로그아웃을 사용하기위한 리덕스 미들웨어
export const logout = () => (dispatch) => {
    signOut(auth).then(() => {
        // Sign-out successful.
        dispatch( logoutUser() );
      }).catch((error) => {
        // An error happened.
      });
} 

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;