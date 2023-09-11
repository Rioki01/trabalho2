
import { useState, useEffect, useContext  } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle} from 'react-icons/fi'

import {AuthContext} from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import {collection, getDocs, getDoc, doc, addDoc, updateDoc} from 'firebase/firestore'

import { useParams, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

import './new.css';

const listRef = collection(db, "alunos");

export default function New(){
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState([])
  const [loadAluno, setloadAluno] = useState(true);
  const [alunoSelected, setAlunoSelected] = useState(0)

  const [nota, setNota] = useState('')
  const [materia, setMateria] = useState('')
  const [curso, setCurso] = useState('')
  const [idAluno, setIdAluno] = useState(false)
  

  useEffect(() => {
    async function loadAlunos(){
      const querySnapshot = await getDocs(listRef)
      .then( (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            materia: doc.data().materia,
            curso: doc.data().curso,
            aluno: doc.data().aluno,
          })
        })

        if(snapshot.docs.size === 0){
          console.log("NENHUM ALUNO ENCONTRADO");
          setAlunos([ { id: '1', aluno: 'NULL' } ])
          setloadAluno(false);
          return;
        }

        setAlunos(lista);
        setloadAluno(false);

        if(id){
          loadId(lista);
        }

      })
      .catch((error) => {
        console.log("ERRO AO BUSCAR OS ALUNOS", error)
        setloadAluno(false);
        setAlunos([ { id: '1', aluno: 'NULL' } ])
      })
    }

    loadAlunos();    
  }, [id])


  async function loadId(lista){
    const docRef = doc(db, "alunos",);
    await getDoc(docRef)
    .then((snapshot) => {
      setNota(snapshot.data().nota);
      setMateria(snapshot.data().materia);
      setCurso(snapshot.data().curso);


      let index = lista.findIndex(item => item.id === snapshot.data().alunoId)
      setAlunoSelected(index);
      setIdAluno(true);

    })
    .catch((error) => {
      console.log(error);
      setIdAluno(false);
    })
  }


  function hnadleChangeAluno(e){
    setAlunoSelected(e.target.value)
    console.log(alunos[e.target.value].aluno);
  }

  
  async function handleRegister(e){
    e.preventDefault();

    if(idAluno){
      //Atualizando chamado
      const docRef = doc(db, "alunos", id)
      await updateDoc(docRef, {
        aluno: alunos[alunoSelected].aluno,
        alunoId: alunos[alunoSelected].id,
        materia: alunos[alunoSelected].materia,
        nota: alunos[alunoSelected].nota,
        curso: alunos[alunoSelected].curso,
        userId: user.uid,
      })
      .then(() => {
        toast.info("Chamado atualizado com sucesso!");
        setAlunoSelected(0);
        setIdAluno('');
        setNota('');
        setMateria(''); 
        navigate('/dashboard');
      })
      .catch((error) => {
        toast.error("Ops erro ao atualizar esse chamado!")
        console.log(error);
      })

      return;
    }


    //Registrar um chamado
    await addDoc(collection(db, "alunos"), {
      created: new Date(),
      aluno: alunos[alunoSelected].aluno,
      materia: materia,
      curso: curso,
      alunoId: alunos[alunoSelected].id,
      nota: nota,
      userId: user.uid,
    })
    .then(() => {
      toast.success("Chamado registrado!")
      setAlunoSelected(0);
    })
    .catch((error) => {
      toast.error("Ops erro ao registrar, tente mais tarde!")
      console.log(error);
    })
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name={id ? "Editando Chamado" : "Novo Chamado"}>
          <FiPlusCircle size={25}/>
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>

            <label>Aluno</label>
            {
              loadAluno ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select value={alunoSelected} onChange={hnadleChangeAluno}>
                  {alunos.map((item, index) => {
                    return(
                      <option key={index} value={index}>
                        {item.aluno}
                      </option>
                    )
                  })}
                </select>
              )
            }
            <label>Curso</label>
            <input
                type="text"
                placeholder="..."
                value={curso}
                onChange={ (e) => setCurso(e.target.value) }
            />

          <label>Materia</label>
            <input
                type="text"
                placeholder="..."
                value={materia}
                onChange={ (e) => setMateria(e.target.value) }
            />
            <label>Nota</label>
            <textarea
              type="text"
              placeholder="0"
              value={nota}
              onChange={ (e) => setNota(e.target.value) }
            />
          
            <button type="submit">Registrar</button>

          </form>
        </div>
      </div>
    </div>
  )
}