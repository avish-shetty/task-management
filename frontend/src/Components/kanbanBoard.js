import React, { useState } from 'react';
const styles = {
  container: {
    padding: '16px',
  },
  inputContainer: {
    marginBottom: '16px',
    display: 'flex',
    gap: '8px',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '300px',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  laneContainer: {
    display: 'flex',
    gap: '16px',
  },
  lane: {
    flex: 1,
    minWidth: '300px',
  },
  laneHeader: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
  },
  laneTitle: {
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  taskCard: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'move',
  },
  taskTitle: {
    marginBottom: '10px',
    cursor: 'text',
  },
  titleInput: {
    width: '100%',
    padding: '4px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '14px',
  },
  deleteButton: {
    marginRight: '5px',
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  updateButton: {
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  dropZone: {
    minHeight: '100px',
    transition: 'background-color 0.2s ease',
  },
  dropZoneActive: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: '4px',
  }
};

const KanbanBoard = () => {
  const [mockTasks, setMockTasks] = useState([
    { id: 1, title: 'Task 1', laneId: 'lane1' },
    { id: 2, title: 'Task 2', laneId: 'lane1' },
    { id: 3, title: 'Task 3', laneId: 'lane2' },
    { id: 4, title: 'Task 4', laneId: 'lane3' }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [dragOverLaneId, setDragOverLaneId] = useState(null);

  const lanes = [
    { id: 'lane1', title: 'To Do' },
    { id: 'lane2', title: 'In Progress' },
    { id: 'lane3', title: 'Done' }
  ];

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      laneId: 'lane1'
    };

    setMockTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const handleDeleteTask = (taskId) => {
    setMockTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleStartEditing = (task) => {
    setEditingTask(task.id);
    setEditedTitle(task.title);
  };

  const handleUpdateTask = (taskId) => {
    if (!editedTitle.trim()) return;
    
    setMockTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, title: editedTitle } : task
    ));
    setEditingTask(null);
    setEditedTitle('');
  };

  const handleDragStart = (task, e) => {
    if (editingTask === task.id) {
      e.preventDefault();
      return;
    }
    setDraggedTask(task);
  };

  const handleDragOver = (e, laneId) => {
    e.preventDefault();
    setDragOverLaneId(laneId);
  };

  const handleDragLeave = () => {
    setDragOverLaneId(null);
  };

  const handleDrop = (laneId) => {
    setDragOverLaneId(null);
    if (draggedTask && draggedTask.laneId !== laneId) {
      setMockTasks(prev =>
        prev.map(task =>
          task.id === draggedTask.id
            ? { ...task, laneId }
            : task
        )
      );
    }
    setDraggedTask(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
          style={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
        />
        <button 
          onClick={handleCreateTask}
          style={styles.button}
        >
          Add Task
        </button>
      </div>

      <div style={styles.laneContainer}>
        {lanes.map(lane => (
          <div
            key={lane.id}
            style={styles.lane}
          >
            <div style={styles.laneHeader}>
              <h3 style={styles.laneTitle}>{lane.title}</h3>
              <div 
                style={{
                  ...styles.dropZone,
                  ...(dragOverLaneId === lane.id ? styles.dropZoneActive : {})
                }}
                onDragOver={(e) => handleDragOver(e, lane.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(lane.id)}
              >
                <div style={styles.taskList}>
                  {mockTasks
                    .filter(task => task.laneId === lane.id)
                    .map(task => (
                      <div
                        key={task.id}
                        draggable={editingTask !== task.id}
                        onDragStart={(e) => handleDragStart(task, e)}
                        style={styles.taskCard}
                      >
                        <div style={styles.taskTitle}>
                          {editingTask === task.id ? (
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleUpdateTask(task.id)}
                              style={styles.titleInput}
                              autoFocus
                            />
                          ) : (
                            <div onClick={() => handleStartEditing(task)}>
                              {task.title}
                            </div>
                          )}
                        </div>
                        <button
                          style={styles.deleteButton}
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </button>
                        <button
                          style={styles.updateButton}
                          onClick={() => {
                            if (editingTask === task.id) {
                              handleUpdateTask(task.id);
                            } else {
                              handleStartEditing(task);
                            }
                          }}
                        >
                          {editingTask === task.id ? 'Save' : 'Update'}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;