import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Socket = () => {
  const [taskIds, setTaskIds] = useState([]);

  useEffect(() => { 
    socket.on("tasks_started", (data) => {  
      setTaskIds(data.task_ids); 
    });  

    socket.on("task_result", (data) => {
      // Actualiza el estado local del componente para mostrar los resultados
      console.log(data); // Asegúrate de que la información se está recibiendo correctamente
    });

    return () => { 
      socket.disconnect();
    };   
  }, []); 

  const runTasks = () => { 
    socket.emit("run_tasks");
    console.log("botón presionado :v")
  };

  return (
    <div>
      <h1>Celery Tasks with SocketIO</h1>
      <button onClick={runTasks}>Run Tasks</button>
      <div id="results">
        {taskIds.map((task_id) => (
          <div key={task_id} id={task_id}>
            {`Task ${task_id}: Running...`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Socket;