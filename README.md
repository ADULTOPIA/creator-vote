# Creator Vote

人気投票サイトのフロントエンド（React + Tailwind）プロトタイプです。

## ローカル開発

```bash
git clone <repo>
cd creator-vote/creator-vote
npm install
npm start
```

ブラウザで `http://localhost:3000/creator-vote` を開いてください（CRAのhomepage設定に合わせています）。

## LAN 共有で開発

同一ネットワークの別端末から確認する場合：

```bash
npm run start:lan
```

表示されるアドレス例：
`http://<このPCのローカルIP>:3000/creator-vote`

## ビルド

```bash
npm run build
```

---

### ルート直下の package.json について
画像最適化などの補助ツール用です（必要な場合のみ使用）。
