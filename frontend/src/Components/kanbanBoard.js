// import React, { useState } from 'react';
// import Board from '@lourenci/react-kanban';
// import '@lourenci/react-kanban/dist/styles.css';

// const KanbanBoard = () => {
//     const mockTasks = [
//         { id: 1, title: 'Task 1', laneId: 'lane1' },
//         { id: 2, title: 'Task 2', laneId: 'lane1' },
//         { id: 3, title: 'Task 3', laneId: 'lane2' },
//         { id: 4, title: 'Task 4', laneId: 'lane3' }
//     ];

//     const [board, setBoard] = useState({
//         columns: [
//             {
//                 id: 'lane1',
//                 title: 'To Do',
//                 cards: mockTasks.filter(task => task.laneId === 'lane1')
//             },
//             {
//                 id: 'lane2',
//                 title: 'In Progress',
//                 cards: mockTasks.filter(task => task.laneId === 'lane2')
//             },
//             {
//                 id: 'lane3',
//                 title: 'Done',
//                 cards: mockTasks.filter(task => task.laneId === 'lane3')
//             }
//         ]
//     });

//     const [newTaskTitle, setNewTaskTitle] = useState('');

//     const handleCardMove = (_card, source, destination) => {
//         const updatedBoard = Board.moveCard(board, source, destination);
//         setBoard(updatedBoard);
//     };

//     const handleCreateTask = () => {
//         const newTask = {
//             id: Date.now(),
//             title: newTaskTitle,
//             laneId: 'lane1' // Default to 'To Do' lane
//         };
//         console.log('Creating new task:', newTask);
//         setBoard(prevBoard => {
//             const updatedColumns = prevBoard.columns.map(column => {
//                 if (column.id === 'lane1') {
//                     return { ...column, cards: [...column.cards, newTask] };
//                 }
//                 return column;
//             });
//             console.log('Updated columns:', updatedColumns);
//             return { columns: updatedColumns };
//         });
//         setNewTaskTitle('');
//     };

//     const handleDeleteTask = (taskId, laneId) => {
//         setBoard(prevBoard => {
//             const updatedColumns = prevBoard.columns.map(column => {
//                 if (column.id === laneId) {
//                     return { ...column, cards: column.cards.filter(card => card.id !== taskId) };
//                 }
//                 return column;
//             });
//             return { columns: updatedColumns };
//         });
//     };

//     const handleUpdateTask = (taskId, updatedData) => {
//         setBoard(prevBoard => {
//             const updatedColumns = prevBoard.columns.map(column => {
//                 if (column.id === updatedData.laneId) {
//                     return {
//                         ...column,
//                         cards: column.cards.map(card => card.id === taskId ? updatedData : card)
//                     };
//                 }
//                 return column;
//             });
//             return { columns: updatedColumns };
//         });
//     };

//     return (
//         <div><input
//                  type="text"
//         value={newTaskTitle}
//         onChange={(e) => setNewTaskTitle(e.target.value)}
//         placeholder="New task title"
//         style={{
//             padding: '10px',
//             borderRadius: '5px',
//             border: '1px solid #ccc',
//             marginTop: '50px',
//             marginRight: '30px',
//             marginBottom: '10px',
//             width: '300px'
//         }}
//     />
//     <button 
//         onClick={handleCreateTask}
//         style={{ 
//             padding: '10px 10px', 
//             backgroundColor: '#007BFF', 
//             color: '#fff', 
//             border: 'none', 
//             borderRadius: '5px', 
//             cursor: 'pointer' 
//         }}
//     >
//         Add Task
//     </button>
          
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//                 <div style={{ width: '45%' }}>
//                     <Board
//                         initialBoard={board}
//                         allowRemoveCard
//                         onCardDragEnd={handleCardMove}
//                         renderCard={(card, { removeCard, dragging }) => (
//                             <div style={{ 
//                                 border: '1px solid #ccc', 
//                                 borderRadius: '4px', 
//                                 padding: '10px', 
//                                 margin: '10px 0', 
//                                 backgroundColor: '#fff', 
//                                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
//                             }}>
//                                 <div style={{ marginBottom: '10px' }}>{card.title}</div>
//                                 <button 
//                                     style={{ 
//                                         marginRight: '5px', 
//                                         padding: '5px 10px', 
//                                         backgroundColor: '#f44336', 
//                                         color: '#fff', 
//                                         border: 'none', 
//                                         borderRadius: '3px', 
//                                         cursor: 'pointer' 
//                                     }} 
//                                     onClick={() => handleDeleteTask(card.id, card.laneId)}
//                                 >
//                                     Delete
//                                 </button>
//                                 <button 
//                                     style={{ 
//                                         padding: '5px 10px', 
//                                         backgroundColor: '#4CAF50', 
//                                         color: '#fff', 
//                                         border: 'none', 
//                                         borderRadius: '3px', 
//                                         cursor: 'pointer' 
//                                     }} 
//                                     onClick={() => handleUpdateTask(card.id, { ...card, title: 'Updated Title' })}
//                                 >
//                                     Update
//                                 </button>
//                             </div>
//                         )}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default KanbanBoard;


import React, { useState, useEffect } from 'react';
import Board from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';
import { getTasks, createTask, updateTask, deleteTask } from '../taskService';

const KanbanBoard = () => {
    const [board, setBoard] = useState({
        columns: [
            {
                id: 'lane1',
                title: 'To Do',
                cards: []
            },
            {
                id: 'lane2',
                title: 'In Progress',
                cards: []
            },
            {
                id: 'lane3',
                title: 'Done',
                cards: []
            }
        ]
    });

    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        const loadTasks = async () => {
            const tasks = await getTasks();
            const updatedColumns = board.columns.map(column => ({
                ...column,
                cards: tasks.filter(task => task.laneId === column.id)
            }));
            setBoard({ columns: updatedColumns });
        };
        loadTasks();
    }, []);

    const handleCardMove = (_card, source, destination) => {
        const updatedBoard = Board.moveCard(board, source, destination);
        setBoard(updatedBoard);
    };

    const handleCreateTask = async () => {
        const newTask = {
            title: newTaskTitle,
            laneId: 'lane1' // Default to 'To Do' lane
        };
        const createdTask = await createTask(newTask);
        setBoard(prevBoard => {
            const updatedColumns = prevBoard.columns.map(column => {
                if (column.id === 'lane1') {
                    return { ...column, cards: [...column.cards, createdTask] };
                }
                return column;
            });
            return { columns: updatedColumns };
        });
        setNewTaskTitle('');
    };

    const handleDeleteTask = async (taskId, laneId) => {
        await deleteTask(taskId);
        setBoard(prevBoard => {
            const updatedColumns = prevBoard.columns.map(column => {
                if (column.id === laneId) {
                    return { ...column, cards: column.cards.filter(card => card.id !== taskId) };
                }
                return column;
            });
            return { columns: updatedColumns };
        });
    };

    const handleUpdateTask = async (taskId, updatedData) => {
        const updatedTask = await updateTask(taskId, updatedData);
        setBoard(prevBoard => {
            const updatedColumns = prevBoard.columns.map(column => {
                if (column.id === updatedTask.laneId) {
                    return {
                        ...column,
                        cards: column.cards.map(card => card.id === taskId ? updatedTask : card)
                    };
                }
                return column;
            });
            return { columns: updatedColumns };
        });
    };

    return (
        <div>
            <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New task title"
                style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    marginTop: '50px',
                    marginRight: '30px',
                    marginBottom: '10px',
                    width: '300px'
                }}
            />
            <button 
                onClick={handleCreateTask}
                style={{ 
                    padding: '10px 10px', 
                    backgroundColor: '#007BFF', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer' 
                }}
            >
                Add Task
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div style={{ width: '45%' }}>
                    <Board
                        initialBoard={board}
                        allowRemoveCard
                        onCardDragEnd={handleCardMove}
                        renderCard={(card, { removeCard, dragging }) => (
                            <div style={{ 
                                border: '1px solid #ccc', 
                                borderRadius: '4px', 
                                padding: '10px', 
                                margin: '10px 0', 
                                backgroundColor: '#fff', 
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
                            }}>
                                <div style={{ marginBottom: '10px' }}>{card.title}</div>
                                <button 
                                    style={{ 
                                        marginRight: '5px', 
                                        padding: '5px 10px', 
                                        backgroundColor: '#f44336', 
                                        color: '#fff', 
                                        border: 'none', 
                                        borderRadius: '3px', 
                                        cursor: 'pointer' 
                                    }} 
                                    onClick={() => handleDeleteTask(card.id, card.laneId)}
                                >
                                    Delete
                                </button>
                                <button 
                                    style={{ 
                                        padding: '5px 10px', 
                                        backgroundColor: '#4CAF50', 
                                        color: '#fff', 
                                        border: 'none', 
                                        borderRadius: '3px', 
                                        cursor: 'pointer' 
                                    }} 
                                    onClick={() => handleUpdateTask(card.id, { ...card, title: 'Updated Title' })}
                                >
                                    Update
                                </button>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;