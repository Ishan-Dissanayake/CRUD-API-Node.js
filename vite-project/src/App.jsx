
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Student from './Student.jsx'
import LoginPage from './LoginPage.jsx'
import React from 'react';
import CreateStudent from './CreateStudent.jsx';
import UpdateStudent from './UpdateStudent.jsx';



function App() {
  //comment
  //const [count, setCount] = useState(0)

  return (
    <div className="App">
<BrowserRouter>
<Routes>
  <Route path='/' element={<LoginPage />}></Route>
  <Route path='/student' element={<Student />}></Route>
  <Route path='/create' element={<CreateStudent />}></Route>
  <Route path='/update/:id' element={<UpdateStudent />}></Route>
</Routes>
</BrowserRouter>
    </div>




    
//ddsdsdsdjjzd

    // <>
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
  )
}

export default App
