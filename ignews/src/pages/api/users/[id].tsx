import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id;

  const user = [
    {id: 1, name: 'Jhonathan'},
    {id: 2, name: 'Dotyo'},
    {id: 3, name: 'Tetf'},
  ]

return res.json(user)
}