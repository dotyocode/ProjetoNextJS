import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { fauna } from '../../service/fauna'
import { stripe } from '../../service/stripe';

type User = {
  ref: {
    id: string
  },
  data: {
    stripe_customer_id: string
  }
}
//configuração do Stripe para modo de Pagamentos
export default async(req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const session = await getSession({req})    

    //buscando o usuario por email para verificar se existe, isso está sendo buscado no banco do Fauna
    const user = await fauna.query<User>(q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email))))

    //não deixando ele criar outro usuario no Stripe
    //pegando o custumer ID que existe no banco
    let customerId = user.data.stripe_customer_id
    //Se ele não existir
    if(!customerId) {
      //Criando um Usuario no Stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
        //metadata: session
      })

        // atualizando o usuario criado no Fauna
        await fauna.query(
          q.Update(
            q.Ref(q.Collection('users'), user.ref.id), {
              data: {stripe_customer_id: stripeCustomer.id }
            }
          )
        )
        // colocando o valor na variavel para o StripeCheckoutSession
        customerId = stripeCustomer.id
    } 

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items: [{
      price: 'price_1Luko6ABnshoHp0FezU7xvjf',
      quantity: 1
    }],
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL
  })

   return res.status(200).json({sessionId: stripeCheckoutSession.id})

  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}