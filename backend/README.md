# Backend Amive Web
O backend do Amive Web é o responsável por realizar as consultas tanto do banco de dados quanto dos arquivos que contém informações sobre
os participantes do projeto Amive da fase 1.
O backend fornece as rotas de acesso para o _client_ retornando as informações da requisição e faz e verifica a autenticação dos usuários.

Este projeto foi feito usando o [ExpressJS](https://expressjs.com/) para criar e manter o servidor. Para a autenticação é usado a biblioteca
[Passport](https://www.passportjs.org/) e as sessões são mantidas com [express-session](https://www.npmjs.com/package/express-session)
(no servidor) e [cookie-parser](https://www.npmjs.com/package/cookie-parser) (no cliente).

## .env
Este projeto faz uso de variáveis de ambiente (.env) para indicar as informações de conexão com o banco de dados e a chave secreta do
Express para manter as sessões de usuários logadas.
O arquivo __.env__ deve conter:

```
SESSION_SECRET='mysecretkey'

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=amive_web

PROD=false
```

Substituindo as informaçoes de conexão do banco pelas do servidor.

## Estrutura
Segue a estrutura do _backend_ e como os arquivos se comunicam.

- __server.js__: inicia a aplicação do servidor. A porta e os domínios permitidos pelo _cors_ são determinados pela variável de
ambiente _PROD_. Para iniciar o servidor use ``npm run start`` em produção ou ``npm run dev`` em desenvolvimento para iniciar a aplicação
com o [nodemon](https://www.npmjs.com/package/nodemon).

- __config.js__: contém os arquivos de configuração do _passport_ e também do banco de dados. A biblioteca de banco usada é o 
[mysql2](https://www.npmjs.com/package/mysql2)

- __routes__: diretório onde estão as rotas do servidor. O arquivo _routes.js_ cria o caminho de rotas geral e os direciona para os demais
arquivos de rotas do diretório. As rotas disponíveis na API estão mais abaixo deste documento.

- __app__: aqui se encontra os arquivos de dados .csv e .json dos participantes do Amive, juntamente com os arquivos em Python que podem
ser usados para executar e obter esses dados.

## Dados dos participantes (app)
Os dados que foram coletados dos participantes do Amive na fase 1 estão armazenados em arquivos .csv que pode ser encontrado em
[app/data/csv](./app/data/csv). Esses dados são convertidos em arquivos .json usando o Python e armazenados em [app/data/json](./app/data/json).
É deste diretório onde os arquivos são enviados para o _client_ ao fazer requisições para as rotas.

Para ler os dados basta escolher o nome do _DataFrame_ e em seguida o ID do usuário. Juntando essas informações é possível encontrar
os dados de cada participante referentes aquele DataFrame na pasta de jsons.

Por exemplo, para encontrar os dados de frequência cardíaca do usuário 3, basta acessar ``app/data/json/heart_rate/3.json``.
É exatamente este caminho que as rotas fazem para encontrar e acessar os arquivos.

### Extração de dados em Python
Ainda, dentro do diretório _app_ há o diretório [python_extractor](./app/python_extractor), que contém os arquivos em Python para extrair os dados dos
arquivos .csv, que estão misturado, e os disponibiliza de forma organizada em formato json.

É recomendável iniciar o arquivo _extrator.py_, que já faz os imports de todos os outros módulos. A partir dele é possível chamar
todas as funções dos demais arquivos:
- *extracao_geral.py*: busca os dados gerais de todos os participantes e seus envios
- *extracao_individual.py*: busca os dados individuais de um participante em específico
- *funcoes.py*: contém funções de uso geral, como extrair arquivos para json ou converter datas
- *dataframes.py*: apenas busca e armazena os dados do .csv em DataFrames e disponibiliza as variáveis para os demais arquivos

Para usar os arquivos em Python é aconselhável que use o __[pipenv](https://pipenv.pypa.io/en/latest/)__ para criar um ambiente
de desenvolvimento e instalar as dependências do arquivo _Pipfile_.

Usa-se o comando ``pipenv shell`` para iniciar o ambiente e em seguida ``pipenv install`` para instalar as dependências.
Caso for utilizar o _IDLE_ do Python, o comando é ``python -m idlelib``.
Em modo geral, o extrator em Python usa apenas duas bibliotecas: [pandas](https://pandas.pydata.org/) e [numpy](https://numpy.org/).

#### Extração de dados do Twitter
A extração de dados do Twitter é feita de forma separada. Para isso é preciso instalar a biblioteca [Tweepy](https://www.tweepy.org/). Ela não consta nos requerimentos do _pipfile_, então deve ser instalada manualmente. Pode-se usar o comando ``pip install tweepy`` para isso.

O código para se obter os tweets pelo ID está no arquivo [extracao_twitter.py](./app/python_extractor/extracao_twitter.py). Pode-se usar a função __getTweetTextByID( tweet_id )__ para receber o texto de um tweet como resposta.

Para o arquivo funcionar, antes é necessário criar o arquivo __twitter_api_keys.py__ que deve conter as chaves que dão acesso a API do Twitter. O arquivo deve se parecer com este:
```
API_KEY = ""
API_KEY_SECRET = ""
ACCESS_TOKEN = ""
ACCESS_TOKEN_SECRET = ""
```

##### Extração limitada de Tweets
Vale lembrar que a extração de dados do Twitter é um pouco limitada. Por exemplo, o usuário 46 tem 1300 tweets registrados, porém não é possível extraiar os 1300 de uma só vez, é necessário dividir as extrações para que possa ter todos os dados. Não há um número exato de limite de extrações, mas estimo aproximadamente 400 a 500. Após atingir este limite é necessário fazer uma pausa de alguns minutos antes de continuar.

A ordem que usei para extrair todos os tweets foi:
- Extrair normalmente todos usuários do 1 ao 45
- Extrair individualmente os dados do usuário 46 dividido em 3 partes
- Extrair o restante dos dados do usuário 47 a diante

## Rotas (routes)
As rotas da API estão disponíveis no diretório _routes_. O arquivo _routes.js_ apenas direciona as requisições das rotas para cada
arquivo separado de forma que fique mais organizado. Vale lembrar que todas as rotas dessa API seguem o prefixo _/api_ para serem
acessadas.

Todas as rotas são protegidas pelo passport e só podem ser acessadas com a autenticação valida (exceto POST _/api/auth/login_).

#### user.js (_/user_)
Gerencia os usuários e suas permissões para terem acesso ao Amive Web. Esta ligada com a tabela __users__ do banco.
- GET _/getAll_: busca todos os usuários cadastrados no banco
- POST _/create_: cadastra um novo usuário no banco
- DELETE _/delete/<id>_: delete o usuário correspondente aquele ID.

#### auth.js (_/auth_)
Gerencia o processo de autenticação e autorizações do usuário no sistema. Esta ligada com a tabela __users__ do banco.
- GET _/isAuthenticated: retorna verdadeiro ou falso se o usuário está autenticado
- POST _/login: autentica o usuário no sistema
- POST _/logout/<id>_: desloga o usuário

Ainda, as requisição a _/login_ está sujeito aos critério da função __isUserBlocked__ que verifica se o usuário está bloqueado ou não.
O usuário tem até 3 tentativas de realizar um login bem-sucedido. Na terceira falha, o usuário será bloqueado por 1 hora. Os registros de
tentativa estão na tabela __authentication_log__ do banco, e são zeradas assim que o usuário realizar um login com sucesso.

#### data.js (_/data_)
Envia as informações dos arquivos .json de acordo com o DataFrame que o client está tentando acessar.
- GET _/getAll_: retorna os dados gerais de todos os usuários do arquivo _general.json_.
- GET _/user/<id>/<DataFrame>: retorna os dados do DataFrame especificado de acordo com o ID do usuário que está sendo buscado.