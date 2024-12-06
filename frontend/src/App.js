import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
// import KanbanBoard from './Components/kanbanBoard.js';
import KanbanBoard from './Components/kanbanBoard.js';
// import  TaskManager from './Components/board.js'
const KANBAN_ROUTE = "/kanban";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path={KANBAN_ROUTE} element={<KanbanBoard />} />
                    {/* <Route path="/tasks" element={<TaskManager />} /> */}

                    {/* Add other routes here */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;