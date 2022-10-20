import { SessionProvider as NextAuthProvider } from 'next-auth/react'

import { Header } from '../components/Header';

import '../styles/global.scss';

function MyApp({ Component, pageProps: { session, ...pageProps }}) {
  console.log(pageProps)
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header/>
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
