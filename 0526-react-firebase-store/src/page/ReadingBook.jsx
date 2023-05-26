import React, { useEffect, useState } from "react";
import { db } from "../database/firebase";
import { updateDoc,collection, addDoc, query, getDocs, orderBy, startAt, endAt, getDoc, doc, deleteDoc } from "firebase/firestore";
require('moment-timezone');
const moment = require('moment');
moment.tz.setDefault('Asia/Seoul');

const Book = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [memo, setMemo] = useState("");
    const [keyword, setKeyword] = useState("");
    const [bookList, setBookList] = useState([]);
    const [bookOne, setBookOne] = useState({});
    const [modal, setModal] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [memoTab, setMemoTab] = useState(false);


    useEffect(() => {
        getBooks();
    }, []);

    const insertBook = async () => {
        try {
            if(title === "" || author === "") {
                alert('제목 또는 저자를 입력하세요.');
                return;
            }
            const docRef = await addDoc(collection(db, "readingbooks"), {
                title : title,
                author : author,
                memo : "",
                done : false,
                startdate : moment().format('YYYY-MM-DD hh:mm:ss'),
                enddate : moment().format('YYYY-MM-DD hh:mm:ss'),
            });
            alert('추가 되었습니다.');
            console.log('Document written : ', docRef);
            setTitle("");
            setAuthor("");
            getBooks();
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const getBooks = async () => {
        const bQuery = query(
            collection(db, "readingbooks"),
            orderBy("title"),
            startAt(keyword),
            endAt(keyword + "\uf8ff")
        );
        const querySnapshot = await getDocs(bQuery);
        let list = [];
        querySnapshot.forEach((doc) => {
            let id = doc.id;
            list.push({
                id : id,
                ...doc.data()
            })
        });
        setBookList(list);
        console.log('리스트 => ', bookList);
    };

    const selectBookOne = (e) => {
        let id = e.currentTarget.dataset.id;
        setCurrentId(id);
        console.log('id => ', id);
        getBookOne(id);
        setModal(true);
        setMemoTab(false);
        console.log(bookOne);
    };

    const handleSearch = () => {
        getBooks(keyword);
        setKeyword("");
    };

    const getBookOne = async (key) => {
        const querySnapshot = await getDoc(doc(db, "readingbooks", key));
        console.log(querySnapshot.data());
        setBookOne(querySnapshot.data());
    };

    const deleteBookOne = async () => {
        if(!window.confirm('삭제 하시겠습니까?')) {
            return
        }
        try {
            await deleteDoc(doc(db, "readingbooks", currentId));
            alert('삭제 되었습니다.')
            setModal(false);
            getBooks();
            setBookOne({});
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const offModal = (e) => {
        if(e.currentTarget === e.target) {
            setModal(false);
            setBookOne({});
        }
    };

    const handleMemo = (e) => {
        let str = e.target.value;
        setMemo(str);
    };

    const insertMemo = async () => {
  try {
    await updateDoc(doc(db, "readingbooks", currentId), {
      memo: memo,
    });
    alert("메모가 추가되었습니다.");
    getBookOne(currentId);
    setMemo("")
  } catch (e) {
    console.error("Error adding memo: ", e);
  }
};

    const updateData = async() => {
        await updateDoc(doc(db,"readingbooks",currentId), {
          memo : memo || "",
        });
        alert("수정되었습니다.")
        getBookOne(currentId)
      }


    return (
        <div>
            <div>
                <div>
                    <h3>readingbooks 컬렉션</h3>
                    <h2>책 추가</h2>
                </div>
            </div>
            <div>
                <div>
                    <div>
                        <div>
                            책 이름 :
                        </div>
                        <input type="text" value={title} onChange={(e) => {setTitle(e.target.value)}} />
                    </div>
                    <div>
                        <div>
                            작가이름 :
                        </div>
                        <input type="text" value={author} onChange={(e) => {setAuthor(e.target.value)}} />
                    </div>
                    <div>
                        <div>
                        </div>
                        <button onClick={insertBook}>추가</button>
                    </div>
                </div>
            </div>
            <hr />
            <div style={{display:"flex", justifyContent : "center"}}>
                <input type="text" value={keyword} onChange={(e) => {setKeyword(e.target.value)}} />
                <button onClick={handleSearch}>읽은 책 검색</button>
            </div>
            <br />
            <div style={{display:"flex", justifyContent : "center"}}>
            <table>
                    <thead>
                        <tr>
                            <th>제목 </th>
                            <th>저자 </th>
                            <th>등록일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookList.length > 0 &&
                            bookList.map((tmp, idx) => 
                                <tr data-id={tmp.id} onClick={selectBookOne} key={idx}>
                                    <td>{tmp.title}</td>
                                    <td>{tmp.author}</td>
                                    <td>{tmp.startdate}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            {modal && 
                <div onClick={offModal}>
                    <div className="modal-card">
                        <p>{currentId}</p>
                        <h3>{bookOne.title}</h3>
                        <p>{bookOne.author}</p>
                        <p>{bookOne.memo}</p>
                        <button onClick={() => setMemoTab(!memoTab)}>감상문 보기</button>
                        {memoTab &&
                            <div>
                                <textarea onChange={handleMemo}>
                                </textarea>
                                <br />
                                <button onClick={insertMemo}>감상문 추가</button>
                                <button onClick={()=>updateData()}>감상문 수정</button>
                            </div>
                        }
                        <br />
                        <button onClick={deleteBookOne}>X</button>
                    </div>
                </div>
            }
        </div>
    )
};

export default Book;
