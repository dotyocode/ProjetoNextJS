import { query as q } from 'faunadb'

import { fauna } from '../../../service/fauna';
import { stripe } from '../../../service/stripe';

export async function saveSubscription(subscriptionId: string, customerId: string, createAction = false) {
  //salvando informações de pagamento no banco de dados
  //crie primeiro um indice no fauna

  //buscando usuario no banco do fauna com o ID CustomerID [stripeCustumerID]
    const userRef = await fauna.query(
     q.Select(
        "ref",
        q.Get(
          q.Match(
            q.Index(
            'user_by_stripe_customer_id'), 
            customerId
        ))
      )
    )
  //obtendo todas informações do Subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  //salvar os dados da subscription do usuario no faunaDB
    //dados que vão ser salvos no banco de dados do fauna
    const subscriptionData = {
      id: subscription.id,
      userId: userRef,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,      
    }
    if(createAction) {
      // criando uma subscription
      await fauna.query(
        q.Create(
          q.Collection('subscriptions'),
          { data: subscriptionData }
        )
      )
    } else {
      await fauna.query(
        q.Replace(
          q.Select(
            "ref",
            q.Get(
              q.Match(
                q.Index("subscription_by_id"),
                subscriptionId
              )
            )
          ),
          { data: subscriptionData }
        )
      )
    }
}