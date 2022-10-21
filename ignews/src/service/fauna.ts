import { Client } from 'faunadb'

//acessando o fauna DB
//operações do banco de dados que precisam ter acesso a essa chave não pode ser feita ao lado do
//browser, somente dentro das API ROUTES  ou por getStaticProps ou getServerSideProps
export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
  domain: "db.us.fauna.com",
})