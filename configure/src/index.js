import Main from './main.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

export default class CorespringMatchConfigReactElement extends HTMLElement {

  constructor() {
    super();
    this._model = null;
    this._session = null;
  }

  set model(s) {
    this._model = s;
    this._rerender();
  }

  _rerender() {
    let element = ReactDOM.createElement(Main, {
      model: this._model
    });
    ReactDOM.render(element, this, () => {
      console.log('rendered config');
    })
  }

  connectedCallback() {
    
  }

}