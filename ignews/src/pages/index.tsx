import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';
import {GetStaticProps} from 'next'
import { stripe } from '../service/stripe';

// Cliente side - quando nao precisa de index, não precisa coisa do usuario
// server side - pagina para trazer informacao para cada usuario autenticacao
// static side generation - pagina sendo a mesma

interface HomeProps {
  product: {
    priceId: string,
    amount: number

  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>   
        <title>Home | ig.news</title>
      </Head>
        <main className={styles.contentContainer}>
          <section className={styles.hero}>
            <span>👏 Hey, Welcome</span>
            <h1>News about the <span>React</span> World.</h1>
            <p>Get access to all the publications 
              <br /> 
              <span>for {product.amount} month</span> 
            </p>
            <SubscribeButton priceId={product.priceId} />
          </section>

          <img src="/images/avatar.svg" alt="garota programando"/>
        </main>
    </>
  )
}

//stripe configuration
export const getStaticProps: GetStaticProps = async () => {
    const price = await stripe.prices.retrieve('price_1Luko6ABnshoHp0FezU7xvjf')

    const product = {
      priceId: price.id,
      amount: new Intl.NumberFormat('en-US', 
      {style: 'currency', currency: 'USD'}
    ).format(price.unit_amount / 100), // salvando em centavos para trazer numero inteiro
  }
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 horas
  }
}