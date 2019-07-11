import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { containerBuilder } from './container';

containerBuilder();
ReactDOM.render(<App />, document.getElementById('root'));
