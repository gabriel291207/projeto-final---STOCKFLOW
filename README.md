# StockFlow — React + JavaScript + PWA

Projeto inicial do StockFlow baseado no protótipo enviado: identidade azul-marinho, formulários claros, painel de estoque e navegação inferior no celular.

## Executar
1. Instale Node.js LTS.
2. Abra esta pasta no VS Code.
3. No terminal, execute `npm install`.
4. Copie `.env.example` para `.env`.
5. Preencha a URL oficial da API, seu secret e confirme os nomes dos endpoints/headers com a documentação fornecida pelo professor.
6. Execute `npm run dev`.

## Atenção: integração com a API
O arquivo `src/api.js` usa como hipótese inicial:
- coleção: `/records`
- header: `x-secret`
- GET na coleção, POST na coleção, PUT em `/records/:id`, DELETE em `/records/:id`
- resposta de listagem como array ou objeto com `data`, `records` ou `items`.

Esses detalhes NÃO foram confirmados. Antes da entrega, ajuste `src/api.js` conforme a documentação real da API da TechSolutions. O secret deve ficar somente no `.env` local e nunca ser enviado ao GitHub. Se a API exigir secret no navegador, lembre-se de que variáveis `VITE_` ficam visíveis no bundle; siga a orientação do professor para o ambiente didático e não reutilize esse secret em sistemas reais.

## PWA
O `manifest.webmanifest` e `public/sw.js` estão incluídos e o service worker é registrado em `src/main.jsx`. Para testar instalação, use `localhost` ou hospedagem HTTPS.

## Observação sobre o protótipo
O layout foi recriado a partir da imagem do Figma enviada. A autenticação apresentada é apenas uma tela de entrada local para navegar na demonstração; o requisito principal de persistência do CRUD é atendido pela API quando a configuração e o contrato da API forem preenchidos.
