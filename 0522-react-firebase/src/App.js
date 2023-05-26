import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import Home from './page/Home';
import LoginForm from './page/LoginForm';
import Main from './page/Main';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/loginform' element={<LoginForm />}/>
        <Route path='/main' element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
