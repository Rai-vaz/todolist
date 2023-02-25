import {useState, useEffect} from 'react'
import {BsTrash, BsBookmark, BsBookmarkCheckFill} from 'react-icons/bs'
import './css/App.css'

const API = "http://localhost:5000"

function App() {
  const [Title, setTitle] = useState("");
  const [Time, setTime] = useState("");
  const [Todos, setTodos] = useState([]);
  const [Loding, setLodind] = useState(false);
  const [click, setClick] = useState(0)

  
  const handleClick = async (e) => {
    e.preventDefault()
    setClick((click) => click + 1)
    const todo = {
      Title,
      Time,
      Done: false
    }
    //envio para api
    await fetch(API + '/todos', {
        //metodo usado para se enviado os dados
        method: "POST",
        //a api só permite dados em forma de texto
        body: JSON.stringify(todo),
        headers: {
          "Content-type": "application/json"
        }
      } 
    )
    
    //adiciono obj todo ao array antes de ir para o db
    //setTodos((prevState) => [...prevState, todo])
    setTitle('')
    setTime('')

    if (Loding) {
      return <p>Carregando...</p>
    }

  }

  useEffect(() => {
    const loadData = async () => {
      setLodind(true)
      const res = await fetch(API + '/todos')
      //transformando resposta da requisição em objeto javaScript
      .then((resp) => {
        const data = resp.json()
        return data
      }).catch((erro) => console.log("Erro na requisição:" + erro))
      
      setTodos(res)
      setLodind(false)
    }

    loadData()
  }, [click]);

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React Todo</h1>
      </div>
      <div className='form-todo'>
        <h2>Insira a sua próxima tarefa:</h2>
        <form>
          <div className='form-control'>
            <label htmlFor='tarefa'>O que você vai fazer?</label>
            <input
              type="text"
              id='tarefa'
              placeholder='Digite sua tarefa'
              required
              onChange={(e) => setTitle(e.target.value)}
              value={Title || ''}
            />
          </div>
          <div className='form-control'>
            <label htmlFor='tarefa'>Tempo de duração da tarefa</label>
            <input
              type="text"
              id='tempo'
              placeholder='Tempo estimado em horas'
              onChange={(e) => setTime(e.target.value)}
              value={Time || ''}
              required
            />
          </div>
          <input
            type="submit"
            value="Criar Tarefa"
            onClick={handleClick}
          />
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas</h2>
        {Todos.length === 0 && <p>Não há tarefas!</p>}
        {Todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <p>{todo.Title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
