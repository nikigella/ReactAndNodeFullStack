import 'materialize-css/dist/css/materialize.min.css'
import React from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'; 
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';


// Created the redux store
const store = createStore(reducers, {}, applyMiddleware(reduxThunk))


ReactDOM.render(
    // Connected the redux store to the react app
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root')
);
