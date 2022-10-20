import { signIn, signOut, useSession } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {
  const { data: session } = useSession();
  console.log(session)

  return session ? (

    <button onClick={() => {signOut()}} className={styles.signInButton} type='button'>
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon}/>
    </button>

  ) : (

    <button onClick={() => signIn('github')} className={styles.signInButton} type='button'>
      <FaGithub color="#eba417" />
      Sign In With Github
    </button>

  )
}