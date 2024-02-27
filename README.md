# Getting Started with cra-template-redux-saga-controller (javascript version)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

```
npx create-react-app --template https://github.com/elartix/cra-template-redux-saga-controller-js
# or
yarn create react-app --template https://github.com/elartix/cra-template-redux-saga-controller-js
```

## Connected packages
- [React](https://reactjs.org)
- [Axios](https://www.npmjs.com/package/axios)
- [Lodash](https://lodash.com/docs)
- [Moment](https://momentjs.com)
- [reactstrap](https://reactstrap.github.io)
- [react-redux](https://github.com/reactjs/react-redux)
- [redux-saga](https://redux-saga.js.org)
- [redux-saga-controller](https://github.com/TECH-Rubicone/redux-saga-controller/)
- [react-router](https://reacttraining.com/react-router/web/example/basic)
- [redux-form](https://redux-form.com)
- [react-redux-toastr](https://www.npmjs.com/package/react-redux-toastr)
- [fortawesome](https://fontawesome.com/start)

## Introduction
Whenever there is a need to write a new web interface using React.js, we are faced with the problem of a lack of basic abstractions. 
Possessing a powerful template engine, React absolutely does not solve the issues of code organization. In this connection we are forced to solve these problems every time. We are helped to solve them by Babel (ES6) preprocessor. But this is not enough when there is a need to organize the structure of the project. In this application billet, a minimal set of proven ready-made solutions for the development of medium and large "admin" applications is collected.

## Install dependencies.
```
> npm install
```
> Without environment configuration used the **.env.development** config.

## Available Scripts

In the project directory, you can run:

### Run
```
> npm run start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Build
```
> npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Locally-trusted development certificates
For making locally-trusted development certificates we use ```mkcert```
- [https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)

```
> mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem local.domain.com 127.0.0.1 ::1
```

Please updated ```.env.local``` file
```
GENERATE_SOURCEMAP=true
HOST=local.domain.com
HTTPS=true
SSL_CRT_FILE=./.cert/cert.pem
SSL_KEY_FILE=./.cert/key.pem
```


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
