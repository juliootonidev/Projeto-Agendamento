import React from 'react';
import ReactDOM from 'react-dom';
import Routers from './routes';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Routers/>
  </Provider>,
  document.getElementById('root')
);
