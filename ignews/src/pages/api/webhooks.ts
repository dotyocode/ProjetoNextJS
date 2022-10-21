import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream';
import Stripe from 'stripe';

import { stripe } from '../../service/stripe';
import { saveSubscription } from './_lib/manageSubscribtion';

//configurando streeming do stripe - transforma em string
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }
    return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false
  }
}

//configurando os evento relevantes, que o stripe são obrigado a ouvir
const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscriptions.created', //nova assinatura
  'customer.subscriptions.updated', //atualizacao de assinatura
  'customer.subscriptions.deleted', //delecao da assinatura
])

export default  async (req: NextApiRequest, res: NextApiResponse) => {
  //configurando streeming do stripe
  // todos dados da requisicao está aqui em buff
  if(req.method === 'POST') {
    const buff = await buffer(req)
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buff, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (e) {
      return res.status(400).send(`WEBHOOK ERROR: ${e.message}`)
    }

    //retorna o que é visto no terminal do stripe
    const { type } = event;

    if(relevantEvents.has(type)) {

      try {
        //ouvindo os eventos
        switch(type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':

            //pegando o subscription
            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(subscription.id,
              subscription.customer.toString(),
              false
            )

            break;
          case 'checkout.session.completed':
            //salvando o usuario
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription(checkoutSession.subscription.toString(), checkoutSession.customer.toString(), true)

            break;
        // não houve tratativa
          default:
          throw new Error('Unhandled Event')
        }
      } catch (e) {
          //retornando isso para o stripe
         return res.json({error: 'Webhook handle failed'})
        }
    }

    console.log('evento recebido')
    res.json({recebido: true})
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }

}