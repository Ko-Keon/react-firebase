import './App.css';
import {Routes,Route} from 'react-router-dom'
import ReadingBook from './page/ReadingBook';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<ReadingBook/>} />
      </Routes>
    </div>
  );
}

export default App;
