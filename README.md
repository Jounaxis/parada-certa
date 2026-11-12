# Parada Certa

Aplicativo de embarque assistido no transporte público para passageiros que precisam de apoio na hora de embarcar.

## Testar no Expo Go

1. Use o Node.js 22 LTS (22.13 ou superior) e instale no celular o [Expo Go compatível com o SDK 58](https://expo.dev/go).
2. Conecte o computador e o celular à mesma rede Wi-Fi.
3. Na raiz do repositório, execute `npm ci`. Se for testar no iPhone, execute `npx expo login` e entre com a mesma conta no Expo Go.
4. Execute `npm start` e escaneie o QR code pelo Expo Go no Android ou pela Câmera no iPhone. A tela inicial deve mostrar **Parada Certa** e a descrição do embarque assistido.

Se o celular não conseguir acessar o servidor pela rede local, pare o servidor com `Ctrl+C`, entre na conta Expo com `npx expo login` e execute `npm start -- --tunnel`. Escaneie o novo QR code.

Para testar cadastro e login, copie `.env.example` para `.env.local`, preencha os valores com a configuração do app Web no Firebase e reinicie o Expo.

## Verificações

```sh
npm run lint
npm run typecheck
```
