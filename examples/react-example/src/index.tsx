import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import { containerBuilder } from './container';
import App from './App';

containerBuilder();
ReactDOM.render(<App />, document.getElementById('root'));
