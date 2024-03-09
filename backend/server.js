// import express from 'express'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import { createServer as createViteServer } from 'vite'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// console.log(__dirname)
// console.log(fileURLToPath(import.meta.url))

// async function createServer() {
//   const app = express()

//   // ミドルウェアモードで Vite サーバーを作成し、app type を 'custom' に指定します。
//   // これにより、Vite 自体の HTML 配信ロジックが無効になり、親サーバーが
//   // 制御できるようになります。
//   const vite = await createViteServer({
//     server: { middlewareMode: true },
//     appType: 'custom'
//   })

//   // Vite の接続インスタンスをミドルウェアとして使用。独自の express ルータ
//   // (express.Route()) を利用する場合は、router.use を使用してください
//   // （たとえばユーザーが vite.config.js を編集した後に）サーバーが再起動しても、
//   // `vite.middlewares` は同じリファレンスのままです（ただし、新しい Vite の内部スタックと
//   // プラグインが注入されたミドルウェアが使用されます）。
//   // 次のコードは再起動後でも有効です。
//   app.use(vite.middlewares)

//   app.use('*', async (_req, _res) => {
//     // index.html を提供します - 次にこれに取り組みます。
//   })

//   app.listen(5173)
// }

// createServer()

// index.js

import express from "express";
import { WebSocket as WWW, WebSocketServer } from "ws";
import http from "http";

const app = express();
const port = 3000;

// HTTPサーバーの設定
const server = http.createServer(app);

// WebSocketサーバーの設定
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WWW.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Expressルートの設定
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// サーバーの起動
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
