import {useState, useEffect} from 'react'
import {BsTrash, BsBookmark, BsBookmarkCheckFill, BsBookmarkCheck} from 'react-icons/bs'
import Loading from './imagens/Loding.svg'
import './css/App.css'

const API = "http://localhost:5000"

function App() {
  const [Title, setTitle] = useState("");
  const [Time, setTime] = useState("");
  const [Todos, setTodos] = useState([]);
  const [Loding, setLodind] = useState(true);
  
  const handleClick = async (e) => {
    e.preventDefault()
    if (Title === '' || Time === '') {
      alert("Todos os campos são obrigatórios!")
      return
    }

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
      }} 
    )  
    //adiciono obj todo ao array antes de ir para o db
    //setTodos((prevState) => [...prevState, todo])
    setTitle('')
    setTime('')
  }

  const handleDelete = async (id) => {
    await fetch(API + '/todos/' + id, {
        method: "DELETE",
    })

    setTodos((prevState) => prevState.filter((Todos) => Todos.id != id) )
  }

  const handleEdit = async (tarefa) => {
    tarefa.Done = !tarefa.Done

    const data = await fetch(API + "/todos/" + tarefa.id, {
      method: 'PUT',
      body: JSON.stringify(tarefa),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setTodos(
      (prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t))
    )

  }

  useEffect(() => {
    const loadData = async () => {
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
  }, [Todos]);

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
              type="number"
              min="0"
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
      <h2 className='title-list'>Lista de tarefas</h2>
      <div className='list-todo'>
        {Loding && <img src={Loading} alt='Imagem Loading'/>}
        {Todos.length === 0 && <p>Não há tarefas!</p> }
        {Todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.Done ? "todo-done" : ""}>{todo.Title}</h3>
            <p>Duração: {todo.Time} Horas</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.Done ? <BsBookmarkCheck className='mark-done'/> : <BsBookmarkCheckFill/>}
              </span>
              <BsTrash className='trash' onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
