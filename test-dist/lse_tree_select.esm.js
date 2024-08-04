function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=Array(t);n<t;n++)i[n]=e[n];return i}function t(e,t,n){return t=o(t),function(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,l()?Reflect.construct(t,n||[],o(e).constructor):t.apply(e,n))}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,u(i.key),i)}}function r(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function o(e){return o=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},o(e)}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&c(e,t)}function l(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(l=function(){return!!e})()}function c(e,t){return c=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},c(e,t)}function s(t){return function(t){if(Array.isArray(t))return e(t)}(t)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(t,n){if(t){if("string"==typeof t)return e(t,n);var i={}.toString.call(t).slice(8,-1);return"Object"===i&&t.constructor&&(i=t.constructor.name),"Map"===i||"Set"===i?Array.from(t):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?e(t,n):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var i=n.call(e,t||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}function d(e){var t="function"==typeof Map?new Map:void 0;return d=function(e){if(null===e||!function(e){try{return-1!==Function.toString.call(e).indexOf("[native code]")}catch(t){return"function"==typeof e}}(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,n)}function n(){return function(e,t,n){if(l())return Reflect.construct.apply(null,arguments);var i=[null];i.push.apply(i,t);var r=new(e.bind.apply(e,i));return n&&c(r,n.prototype),r}(e,arguments,o(this).constructor)}return n.prototype=Object.create(e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),c(n,e)},d(e)}var h=function(e){function i(e){var r;return n(this,i),(r=t(this,i,["lse-tree-selection-change",{bubbles:!0}])).detail=e,r}return a(i,d(Event)),r(i)}(),f=function(e){function i(){return n(this,i),t(this,i)}return a(i,d(HTMLElement)),r(i,[{key:"connectedCallback",value:function(){this.initErrors="",this.initData=this.parseInitData(),this.initDimension=this.getInitDimension(),this.selectedIDs=new Set,this.isInitDataValid(this.initData)&&this.isInitDimensionValid()?(this.render(this.initData),this.setAttribute("init-data","done"),this.addEventListener("lse-tree-selection-changed",this.handleChangedSelection)):this.setAttribute("init-data",this.initErrors)}},{key:"parseInitData",value:function(){return JSON.parse(this.getAttribute("init-data"))}},{key:"getInitDimension",value:function(){return this.getAttribute("init-dimension")}},{key:"isInitDataValid",value:function(e){var t=this;return e=={}||null==e||null==e?(this.initErrors="Init data is undefined or Empty",!1):e.hasOwnProperty("id")?e.hasOwnProperty("label")?e.hasOwnProperty("children")?Array.isArray(e.children)?e.children.every((function(e){return t.isInitDataValid(e)})):(this.initErrors="The children must be an array",!1):(this.initErrors="Not each node as a children property",!1):(this.initErrors="Not each node has a label property",!1):(this.initErrors="Not each node has an id property",!1)}},{key:"isInitDimensionValid",value:function(){return"string"==typeof this.initDimension||(this.setAttribute("init-dimension","Error: Please explitly set a unique Dimension name here"),!1)}},{key:"render",value:function(e){var t=document.createElement("lse-tree-selection-node");t.setAttribute("init-data",JSON.stringify(this.initData)),this.appendChild(t)}},{key:"handleChangedSelection",value:function(e){var t=this;e.detail.isSelection?this.selectedIDs=new Set([].concat(s(this.selectedIDs),s(e.detail.affectedIDs))):Array.from(e.detail.affectedIDs).forEach((function(e){return t.selectedIDs.delete(e)}));var n=new h({dimension_key:this.initDimension,selected_ids:Array.from(this.selectedIDs).map((function(e){return Number(e)}))});this.dispatchEvent(n)}}])}();customElements.define("lse-tree-selection",f);var p=function(e){function i(){var e;return n(this,i),(e=t(this,i)).childCount=0,e.checkedChilds=new Set,e}return a(i,d(HTMLElement)),r(i,[{key:"parseInitData",value:function(){return JSON.parse(this.getAttribute("init-data"))}},{key:"connectedCallback",value:function(){var e=this.parseInitData();this.childCount=e.children?e.children.length:0,this.render(e),this.setAttribute("init-data","done"),this.addEventListener("change",this.handleSelectionChange),this.addEventListener("lse-tree-selection-changed",this.handleChangedSelection)}},{key:"getChildElements",value:function(){return Array.from(this.children).filter((function(e){return"lse-tree-selection-node"==e.nodeName.toLowerCase()}))}},{key:"reportChangedSelectionUpwards",value:function(e,t){var n,i,r,o=new CustomEvent("lse-tree-selection-changed",{detail:(n={affectedIDs:e,isSelection:t},i="isSelection",r=t,(i=u(i))in n?Object.defineProperty(n,i,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[i]=r,n),bubbles:!0});this.dispatchEvent(o)}},{key:"handleChangedSelection",value:function(e){var t=!0;this.hasChildren()&&e.target.id!=this.id&&(this.getChildElements().forEach((function(e){e.querySelector("input").checked||(t=!1)})),this.querySelector("input").checked=t)}},{key:"handleSelectionChange",value:function(e){e.stopPropagation();var t=[];this.hasChildren()||t.push(this.id),this.hasChildren()&&t.push.apply(t,s(this.propagateSelectionChangeToLeafs(e))),this.reportChangedSelectionUpwards(t,e.target.checked)}},{key:"propagateSelectionChangeToLeafs",value:function(e){var t=[];return this.getChildElements().forEach((function(n){n.hasChildren()||t.push(n.id),n.querySelector("input").checked=e.target.checked,n.hasChildren()&&t.push.apply(t,s(n.propagateSelectionChangeToLeafs(e)))})),t}},{key:"hasChildren",value:function(){return this.childCount>0}},{key:"attributeChangedCallback",value:function(e,t,n){}},{key:"getNodeContent",value:function(e){var t=document.createElement("template");return t.innerHTML='\n    <input type="checkbox" value='.concat(e.id,' />\n    <label class="selection-label">').concat(e.label,"</label>\n    "),t.content.cloneNode(!0)}},{key:"renderChildren",value:function(e,t){t&&t.children&&t.children.length>0&&t.children.forEach((function(t){var n=document.createElement("lse-tree-selection-node");n.setAttribute("init-data",JSON.stringify(t)),e.append(n)}))}},{key:"render",value:function(e){this.setAttribute("id",e.id),this.append(this.getNodeContent(e)),this.renderChildren(this,e)}}],[{key:"observedAttributes",get:function(){return["checked"]}}])}();customElements.define("lse-tree-selection-node",p);var y=document.createElement("lse-tree-selection");y.setAttribute("init-dimension","Region-Selection"),y.setAttribute("init-data",JSON.stringify({id:19999,label:"Europe",children:[{id:1999,label:"Spain",children:[{id:199,label:"Asturias",children:[{id:10,label:"Gijon",children:[]},{id:11,label:"Oviedo",children:[]},{id:12,label:"Avilés",children:[]}]},{id:299,label:"Castellón",children:[{id:21,label:"Villarel",children:[]},{id:22,label:"Burriana",children:[]}]}]},{id:5999,label:"Portugal",children:[{id:599,label:"Estremadura",children:[{id:232,label:"Lisboa",children:[]}]}]}]})),app.appendChild(y);
