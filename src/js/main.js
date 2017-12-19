import {Element} from './v-dom-creator'
import { EasySlider } from './easy-slider'

console.log('test');
console.log('linux test');
require('../scss/style.scss');

let el = new Element('ul', {id: 'list'}, [
  new Element('li', {class: 'item'}, ['Item 1']),
  new Element('li', {class: 'item'}, ['Item 2']),
  new Element('li', {class: 'item'}, ['Item 3'])
])
let ulRoot = el.render();
document.body.appendChild(ulRoot);

new EasySlider({
  wrapper: 'wrapper',
  width: 1200,
  height: 800,
  pieces: 3,
  slideType: 'simple',
  imgUrls: ['../static/fff.png','../static/fff1.png','../static/fff2.png']
})