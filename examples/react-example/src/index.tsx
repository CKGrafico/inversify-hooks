import React from 'react';
import ReactDOM from 'react-dom';
import 'reflect-metadata';
import App from './App';
import { containerBuilder } from './container';

containerBuilder();
ReactDOM.render(<App />, document.getElementById('root'));
