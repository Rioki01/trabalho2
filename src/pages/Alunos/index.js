import { useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiUser } from 'react-icons/fi'

import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

import { toast } from 'react-toastify'

export default function Alunos(){
  const [aluno, setAluno] = useState('')
  const [curso, setCurso] = useState('')
  const [materia, setMateria] = useState('')
  const [nota, setNota] = useState('')
  async function handleRegister(e){
    e.preventDefault();

    if(aluno !== ''){
        await addDoc(collection(db, "alunos"), {
          aluno: aluno,
          curso: curso,
          materia: materia,
          nota: nota,
        })
        .then(() => {
          setAluno('')
          setCurso('')
          setNota('')
          setMateria('')
          toast.success("Notas registradas!")
          console.log("Document written with ID: ", aluno.id);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao cadastrar notas.")
        })

    }else{
      toast.error("Preencha todos os campos!")
    }

  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Cadastrar Alunos">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
          
            <label>Aluno</label>
              <input
                type="text"
                placeholder="Aluno..."
                value={aluno}
                onChange={(e) => setAluno(e.target.value) }
              />
              <button type="submit">
                Salvar
              </button>
          </form>
        </div>

      </div>

    </div>
  )
}