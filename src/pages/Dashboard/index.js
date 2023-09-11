import { useContext, useEffect, useState } from 'react'
import {AuthContext} from '../../contexts/auth'

import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi'

import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, limit, startAfter, query} from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

import { format } from 'date-fns'
import Modal from '../../components/Modal'

import './dashboard.css'

const listRef = collection(db, "alunos")

export default function Dashboard(){
  const { logout } = useContext(AuthContext);

  const [alunos, setChamados] = useState([])
  const [loading, setLoading] = useState(true);

  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false);



  useEffect(() => {
    async function loadChamados(){
      const q = query(listRef, orderBy('created', 'desc'), limit(5));

      const querySnapshot = await getDocs(q)
      setChamados([]);

      await updateState(querySnapshot)

      setLoading(false);

    }

    loadChamados();


    return () => { }
  }, [])


  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          aluno: doc.aluno,
          id: doc.id,
          nota: doc.data().nota,
          materia: doc.data().materia,
          curso: doc.data().curso,
          aluno: doc.data().aluno,
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] // Pegando o ultimo item

      setChamados(alunos => [...alunos, ...lista])
      setLastDocs(lastDoc);

    }else{
      setIsEmpty(true);
    }
    setLoadingMore(false);
  }


  async function handleMore(){
    setLoadingMore(true);

    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs),  limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);

  }

  if(loading){
    return(
      <div>
        <Header/>

        <div className="content">
          <Title name="Alunos">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando alunos...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Alunos">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {alunos.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhuma nota encontrada...</span>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Nova Nota
              </Link>  
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Nova Nota
              </Link>  

              <table>
                <thead>
                  <tr>
                    <th scope="col">Aluno</th>
                    <th scope="col">Curso</th>
                    <th scope="col">Materia</th>
                    <th scope="col">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((item, index) => {
                    return(
                      <tr key={index}>
                        <td data-label="Aluno">{item.aluno}</td>
                        <td data-label="Curso">{item.curso}</td>
                        <td data-label="Materia">{item.materia}</td>
                        <td data-label="Nota">{item.nota}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>   


              {loadingMore && <h3>Buscando mais alunos...</h3>}    
              {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>  }  
            </>
          )}
        </>

      </div>
    </div>
  )
}