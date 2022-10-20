import { NextApiRequest, NextApiResponse } from 'next'

// JWT = Salvo no Storage (com Data de Inspiracao)
// Next Auth (Usado quando queremos sistema de autenticacao simples, login social, quando nao quer preocupar salvar credencial no back)
// Cognito, Auth0 eles conversam com o Next Auth

export default (req: NextApiRequest, res: NextApiResponse) => {
  const user = [
    {id: 1, name: 'Jhonathan'},
    {id: 2, name: 'Dotyo'},
    {id: 3, name: 'Tetf'},
  ]

return res.json(user)
}