# PokéBuilder API

## Introdução
A API PokéBuilder possibilita a criação de usuários e seus respectivos times formados por Pokémons fazendo uso de uma API externa, a PokéAPI. Não é necessário possuir todas as tecnologias listadas abaixo instaladas no computador, apenas o Docker instalado, visto que todo o ambiente do projeto será gerado a partir dessa ferramenta. 

## Tecnologias Utilizadas
- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://docs.docker.com/desktop/)

## Inicialização
Para a utilização do projeto, já com o Docker instalado em sua máquina, é necessário executar o comando abaixo para a criação dos _containers_ da API e do banco de dados PostgreSQL.

```bash
docker compose up -d -V --build
```
Após isso, deve-se executar um comando no _container_ da API para realizar a migração da estrutura do banco de dados do Prisma para o _container_ do banco de dados PostgreSQL. ISso será feito a partir do seguinte comando:

```bash
docker exec -it poke-builder-api-1 npx prisma migrate dev --name init
```

## Utilização

As rotas para acesso das endpoints são as seguintes:
| Método | Rota | Descrição |
| --- | --- | --- |
| GET | http://localhost:3333/api/teams/ | Realiza a busca de todos os times registrados no banco de dados, informando o dono de cada time, além das informações de altura, peso e identificação de cada pokémon |
| GET | http://localhost:3333/api/teams/:id | Realiza a busca do time com a identificação fornecida na rota, trazendo o nome do usuário dono do time e as informações de altura, peso e identificação de cada pokémon |
| POST | http://localhost:3333/api/teams/ | Realiza a criação do usuário, caso o mesmo já não esteja registrado no banco de dados, e do time contendo as identificações de cada um dos pokémons informados |


Para criação de um time Pokémon, é necessário que a inclusão de dados através da rota de criação seja da seguinte forma:
```json
{
  "user": "pedro",
  "team": [
    "charmander",
    "pikachu",
    "articuno"
  ]
}
```
