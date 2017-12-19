import { Element } from './v-dom-creator'
export class EasySlider {
  constructor (config) {
    this.wrapper = config.wrapper;
    this.height = config.height;
    this.width = config.width;
    this.pieces = config.pieces;
    this.slideType = config.slideType;
    this.imgUrls = config.imgUrls;
    this.DOMs = [];
    this.init();
  }

  promiseDOM () {
    return new Promise((resolve, reject) => {
      let wrapper = document.getElementById(this.wrapper);
      let imgEls = [];
      let arrowEls = [new Element('div', {class: 'arrow', id: 'lArrow'}), new Element('div', {class: 'arrow', id: 'rArrow'})];
      let pieces = this.pieces;
      let imgUrls = this.imgUrls;
      imgEls.push(new Element('img', {src: imgUrls[imgUrls.length - 1], class: 'imgPiece'}));
      for (let i = 0; i < pieces; i++) {
        imgEls.push(new Element('img', {src: imgUrls[i], class: 'imgPiece'}));
      }
      imgEls.push(new Element('img', {src: imgUrls[0], class: 'imgPiece'}));
      let imgTree = new Element('div', {id: 'cCon'}, imgEls);
      let root = imgTree.render();
      wrapper.appendChild(root);
      for (let i = 0; i < arrowEls.length; i++) {
        wrapper.appendChild(arrowEls[i].render());
      }
      resolve({root, wrapper});
      reject('reject in creating dom!');
    })
  }

  promiseAttr () {
    return new Promise((resolve, reject) => {
      let pieces = this.pieces;
      let imgWidth = this.width;
      let cCon = this.DOMs.find((target) => {
        return target.name == 'cCon';
      }).el || null;
      let lArrow = this.DOMs.find((target) => {
        return target.name == 'lArrow';
      }).el || null;
      let rArrow = this.DOMs.find((target) => {
        return target.name == 'rArrow';
      }).el || null;
      cCon.style.cssText = `position: absolute;height: 400px;`;
      cCon.style.width = ((pieces + 2) * imgWidth) + 'px';
      cCon.style.left = -imgWidth + 'px';
      resolve({cCon, lArrow, rArrow, imgWidth, pieces});
      reject('reject in set attr!');
    })
  }

  init () {
    this.promiseDOM().then(obj => {
      console.log(obj.root.childNodes[obj.root.childNodes.length - 1]);
      // let img = document.getElementsByClassName('imgPiece')[0];
      // let c0 = obj.root.children[0];
      this.DOMs.push(
        {
          name: 'cCon',
          el: obj.root
        },
        {
          name: 'rArrow',
          el: obj.wrapper.childNodes[obj.wrapper.childNodes.length - 1] // last object of DOM tree
        },
        {
          name: 'lArrow',
          el: obj.wrapper.childNodes[obj.wrapper.childNodes.length - 2]
        });
      // console.log(img == c0);
      this.promiseAttr().then(obj => {
        console.log(obj);
        let simpleTimer = this.simpleAutoPlay(obj);

        obj.lArrow.onclick = () => {
          window.clearInterval(simpleTimer);
          this.promiseClickEvent(obj, 'left').then(resolve => {
            console.log(resolve);
            simpleTimer = this.simpleAutoPlay(obj);
          }).catch(error => {
            console.log(error);
          })
        }
        obj.rArrow.onclick = () => {
          window.clearInterval(simpleTimer);
          this.promiseClickEvent(obj, 'right').then(resolve => {
            console.log(resolve);
            simpleTimer = this.simpleAutoPlay(obj);
          }).catch(error => {
            console.log(error);
          })
        }
      }).catch(error => {
        console.log(error);
      })
      // c0.remove();
    }, reject => {
      console.log('error!' + reject);
    })
  }

  simpleMove (obj, offset) {
    // console.log('moving');
    obj.cCon.style.left = parseInt(obj.cCon.style.left) + offset + 'px';
    if (parseInt(obj.cCon.style.left) == -(obj.imgWidth * (obj.pieces + 1))) {
      obj.cCon.style.left = -obj.imgWidth + 'px';
    }

  }

  simpleAutoPlay (obj) {
    return setInterval(() => {
      this.simpleMove(obj, -obj.imgWidth);
    }, 2000);
  }

  promiseClickEvent (obj, direction) {
    return new Promise((resolve, reject) => {
      if (parseInt(obj.cCon.style.left) == 0) {
        // console.log(obj.imgWidth);
        obj.cCon.style.left = -(parseInt(obj.cCon.style.width) - 2 * obj.imgWidth) + 'px';
      }
      switch (direction) {
        case 'left':
          this.simpleMove(obj, obj.imgWidth);
          obj.lArrow.onmouseout = () => {
            resolve('continue');
          };
          break;
        case 'right':
          this.simpleMove(obj, -obj.imgWidth);
          obj.rArrow.onmouseout = () => {
            resolve('continue');
          };
          break;
      }
      // reject('not yet');
    })
  }
}