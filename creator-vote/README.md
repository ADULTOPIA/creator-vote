# Creator Vote 公式サイト

2026 Adultopia 大人國のクリエイター募集の公式ウェブサイトです。

## サイトURL

公式サイトは以下のURLでアクセスできます：
[http://localhost:3000/creator-vote](http://localhost:3000/creator-vote)

## 概要


## 技術スタック

- React (Create React App)
- TypeScript
- styled-components
- React Router
- React Helmet

## 開発方法

### 必要条件

- Node.js (バージョン14以上)
- npm (バージョン6以上)

### 開発サーバー起動

```bash
npm start
```

### 本番ビルド作成

```bash
npm run build
```

### ビルドのサーブ

```bash
npm run serve
```

### GitHub Pagesへのデプロイ

このサイトはGitHub Pagesを使用してデプロイされています。
更新をデプロイするには：

```bash
npm run deploy
```

または、リポジトリのルートディレクトリから：

```bash
./deploy.sh
```

## サイト構成

- トップページ (`/`) - アプリの概要と特徴の紹介


## デザイン

- アクセントカラー: #ea6d9a
- フォント: Noto Sans JP, Inter

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
