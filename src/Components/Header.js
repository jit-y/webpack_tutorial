import $ from 'jquery';
import Mustache from 'mustache';
import template from './Header.html';
import './Header.sass';

export default class Header {
  render(node) {
    const text = $(node).text();
    $(node).html(
      Mustache.render(template, {text})
    );
  }
}
