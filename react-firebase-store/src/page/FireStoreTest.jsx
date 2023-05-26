import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

import { db } from '../database/firebase';

export default function FireStoreTest() {
  // 파이어스토어에서 가져온 값을 출력
  const [users, setUsers] = useState();

  // 가져올 값을 개별 state로 가져오기
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [born, setBorn] = useState();

  // 수정될 값 state
  const [updateFirst, setUpdateFirst] = useState();

  // 검색할 last값
  const [searchLast, setSearchLast] = useState();

  // 검색된 user값 
  const [searchUser, setSearchUser] = useState();
  

  // 유저 uid값이 문서의 uid값일때, 문서의 값을 찾아올 수 있는지
  useEffect(()=>{
    async function getUserData () {
      // doc()을 통해서 값을 찾을때, getDoc통해서 한개의 값을 들고옴
      const querySnapshot = await getDoc(doc(db,'userList','k2pc7BpZYjWAdXPCQKb2IYCa5TD2'));
      // 바로 값을 들고오므로 forEach사용X
      console.log(querySnapshot.data())
    }
    getUserData()
  },[])


  // 시작하자마자 값 가져오기
  useEffect(()=>{
    getData();
  },[])

  // 비동기함수로 작성하여 값 가져옴
  async function getData () {
      // getDocs를 통해서 컬렉션안의 모든 문서 가져옴
      const querySnapshot = await getDocs(collection(db, "users"));
      
      // forEach에서 출력한 모든 값을 배열에 담음
      let dataArray = [];
      // forEach를 통해서 모든 문서값에 접근하여 원하는 값을 가져온다
      querySnapshot.forEach((doc) => {
          // doc.id와 doc.data()값을 리덕스/state에 저장하여 
          // 웹에서 사용 >> forEach의 모든내용을 배열로 저장

          // id값을 함께 넣어주기 위해서 새로운 객체 생성
          // id는 doc.id, 객체인 doc.data()는 
          // ...(스프레드연산자)를 통해서 그 안에 있는 값을 꺼내서 씀
          dataArray.push({
            id : doc.id,
            ...doc.data()
          });

          console.log(`${doc.id} => ${doc.data().first}`);
        });
      // 값이 들어간 배열을 state에 넣어서 활용
      setUsers(dataArray);
  } 

  const addDocData = async () => {
    try {
        // 서버에 연결해서 사용하는 것은 비동기 함수로 작성
        const docRef = await addDoc(collection(db, "users"), {
          first,
          last,
          born: parseInt(born)
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    getData();
  }

  // id값을 가져와서 삭제
  const deleteData = async (id) => {
    // doc(db,컬렉션이름,id)로 하나의 문서를 찾을 수 있다
    await deleteDoc(doc(db, "users", id));
    getData()
  }

  // id값을 가져와서 내용 업데이트
  const updateData = async(id) => {
    //수정할 필드의 값을 객체형태로 넣어줌
    await updateDoc(doc(db,"users",id), {
      first : updateFirst
    });
    getData()
  }

  // 단일 쿼리를 이용하여 값 찾기
  const onSearch = async () => {
    // where를 하나를 이용한 단일 쿼리
    // 문자열에서 특정 문자열을 찾을 수 없다
    // 데이터를 세부적으로 사용 > 따로 서버를 만들어서 SQL또는 noSQL을 사용
    const q = query(collection(db, "users"), 
                    where("last", "==", searchLast),
                    where("born", ">", 1953));
    // 복합 쿼리문은 파이어베이스 콘솔에서 인덱스(색인)을 설정하고 쓸수 있다

    // 작성한 쿼리 객체를 getDocs를 이용하여 가져옴
    const querySnapshot = await getDocs(q);
    let dataArray = []
    querySnapshot.forEach((doc) => {
      dataArray.push({
        id : doc.id,
        ...doc.data()
      })
    });
    setSearchUser(dataArray)
  }

  return (
    <div>
        <h3>파이어스토어의 값을 추가, 가져옴 확인</h3>
        <p>users컬렉션 확인</p>
        <label htmlFor="">first</label>
        <input type="text" onChange={(e)=>{setFirst(e.target.value)}}/>
        <label htmlFor="">last</label>
        <input type="text" onChange={(e)=>{setLast(e.target.value)}}/>
        <label htmlFor="">born</label>
        <input type="number" onChange={(e)=>{setBorn(e.target.value)}}/>
        <button onClick={addDocData}>
            버튼을 누르면 파이어스토어에 값추가
        </button>
        <br />
        <hr />
        <label htmlFor="">last 검색</label>
        <input type="text" onChange={(e)=>{setSearchLast(e.target.value)}}/>
        <button onClick={ onSearch }>검색하기</button>
        <hr />
        {
          // 검색결과 출력
          searchUser && searchUser.map((user)=>(
            <div>{user.last}, {user.born}, {user.first}</div>
          ))
        }
        <hr />
        {
          users && users.map((user)=>(
            <div>
              <span>{user.first} , {user.born}</span> 
              <button onClick={ ()=>{deleteData(user.id)} }>X</button>
              <input type="text" onChange={(e)=>{setUpdateFirst(e.target.value)}} />
              <button onClick={ ()=>{ updateData(user.id) } }>first수정</button>
            </div>
          ))
        }

    </div>
  )
}
