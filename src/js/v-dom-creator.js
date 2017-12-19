export class Element {
  constructor (tagName, props, children) {
    this.tagName = tagName;
    this.props = props;
    this.children = children;
  }

  render () {
    let el = document.createElement(this.tagName);
    let props = this.props;

    for (let propName in props) {
      let propVal = props[propName];
      el.setAttribute(propName, propVal);
    }

    let children = this.children || [];

    children.forEach(child => {
      let childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
      el.appendChild(childEl);
    })
    return el;
  }
}