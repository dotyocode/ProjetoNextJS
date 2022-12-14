import { signIn, useSession } from 'next-auth/react';

import { api } from '../../service/api';
import { getStripeJs } from '../../service/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({priceId}: SubscribeButtonProps) {
  const {data: session} = useSession()

  async function handleSubscribe() {
    //verificando se tem usuario com sessao
    if(!session) {
      signIn('github')
      return
    }

    //se ele estiver logado
    //criando a checkout session
    try {
      const response = await api.post('/subscribe')
      const { sessionId } = response.data
      const stripe = await getStripeJs()
      await stripe.redirectToCheckout({sessionId})
    } catch(err) {
      alert(err.message);
    }
  }

  return (
    <button onClick={handleSubscribe} type="button" className={styles.subscribeButton}>
      Subscribe Now
    </button>
  )
}