# LocPay Tech Challenge - Summer Job 2025 🔵
---

&emsp; API simplificada para simular operações de antecipação de aluguel entre recebedores e a LocPay.

## Como executar? 🤔

1. Clone o repositório:

``` bash
git clone https://github.com/Messias-Olivindo/locpay-tech-challenge-2025
cd locpay-tech-challenge-2025
```

2. Instale as dependências:
- Você precisa ter Node.js 11.6.0+, para baixar acesse o seguinte link: [nodejs](https://nodejs.org/en)

``` bash
npm install
```

3. Crie o arquivo `.env` baseado no arquivo `.env.example`:

```
cp .env.example .env
```

4. Rode as migrações:

``` bash
npx prisma migrate dev --name init
```

5. Rode o servidor:

```bash
npm run start:dev
```

6. Teste a API localmente no seguinte endereço: `http://localhost:3000`  

## Exemplos de requests e responses 📤

### `POST /receivers`

- Cria um recebedor

    - Request:
    ```bash
    curl -X POST http://localhost:3000/receivers \
        -H "Content-Type: application/json" \
        -d '{
                "name": "Messias"
            }'
    ```

    - Response:
    ```JSON
    {
        "id": "0cfea37a-5955-4c5b-98ab-d59c24bb870a",
        "name": "Messias",
        "balance": "0",
        "operations": []
    }
    ```


### `POST /operations`

- Cria uma operação de antecipação, calculando a taxa e o valor líquido dela

    - Request:
    ```bash
    curl -X POST http://localhost:3000/operations \
        -H "Content-Type: application/json" \
        -d '{
                "receiverId": "0cfea37a-5955-4c5b-98ab-d59c24bb870a",
                "grossValue": "9000.00"
            }'
    ```

    - Response:
    ```JSON
    {
        "id": "652939f2-0982-4c18-be2e-38becc6cfb62",
        "receiverId": "0cfea37a-5955-4c5b-98ab-d59c24bb870a",
        "grossValue": "9000",
        "fee": "270",
        "netValue": "8730",
        "status": "pending"
    }
    ```

### `GET /operations/:id`

- Retorna os dados de uma operação específica a partir do Id.

    - Request:
    ```bash
    curl -X GET http://localhost:3000/operations/652939f2-0982-4c18-be2e-38becc6cfb62 \
        -H "Content-Type: application/json" \
    ```

    - Response:
    ```JSON
    {
        "id":"652939f2-0982-4c18-be2e-38becc6cfb62",
        "receiverId":"0cfea37a-5955-4c5b-98ab-d59c24bb870a",
        "grossValue":"9000",
        "fee":"270",
        "netValue":"8730",
        "status":"pending"
    }
    ```

### `POST /operations/:id/confirm`

- Confirma uma operação a partir do seu id

    - Request: 
    ```bash
    curl -X POST http://localhost:3000/operations/652939f2-0982-4c18-be2e-38becc6cfb62/confirm \
        -H "Content-Type: application/json" \
        -d '{}'
    ```

    - Response:
    ```JSON
    {
        "id":"652939f2-0982-4c18-be2e-38becc6cfb62",
        "receiverId":"0cfea37a-5955-4c5b-98ab-d59c24bb870a",
        "grossValue":"9000",
        "fee":"270",
        "netValue":"8730",
        "status":"confirmed",
        "receiver":
        {
            "id":"0cfea37a-5955-4c5b-98ab-d59c24bb870a",
            "name":"Messias",
            "balance":"8730",
            "operations": [
                {
                    "id":"652939f2-0982-4c18-be2e-38becc6cfb62",
                    "receiverId":"0cfea37a-5955-4c5b-98ab-d59c24bb870a",
                    "grossValue":"9000",
                    "fee":"270",
                    "netValue":"8730",
                    "status":"confirmed",
                }
            ]
            }
        }
    ```

### `GET /receivers/:id`

- Retorna as informações do recebedor (nome, saldo e histórico de operações).

    - Request:
    ```bash
    curl -X GET http://localhost:3000/receivers/0cfea37a-5955-4c5b-98ab-d59c24bb870a \
        -H "Content-Type: application/json" \
    ```

    - Response:
    ```JSON
    {
        "id":"0cfea37a-5955-4c5b-98ab-d59c24bb870a",
        "name":"Messias",
        "balance":"8730",
        "operations":[
            {
                "id":"652939f2-0982-4c18-be2e-38becc6cfb62",
                "receiverId":"0cfea37a-5955-4c5b-98ab-d59c24bb870a",
                "grossValue":"9000",
                "fee":"270",
                "netValue":"8730",
                "status":"confirmed"
                },
        ]
    }
    ```

### Erros

- Os erros 4xx ou 5xx, seguem o seguinte padrão:

    - Com mensagem personalizada:
    ```JSON
    {
        "message":"Validation failed (uuid is expected)",
        "error":"Bad Request",
        "statusCode":400
    }
    ```

    - Sem mensagem:
    ```JSON
    {
        "message":"Bad Request",
        "statusCode":400
    }
    ```
