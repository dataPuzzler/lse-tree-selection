class ReactiveState{
  constructor(initialState){
    this._proxyToTagetMap = new WeakMap();

    this.listeners = new Map();
    this._state = this._createProxy(initialState)
  }

  _createProxy(target) {
    const handler = {
      set: (target, property, value) => {
        target[property] = value;
        this.notify(property);
        return true;
      },
      get: (target, property) => {
        return target[property]
      }
    };

    const proxy = new Proxy(target, handler);
    this._proxyToTagetMap.set(proxy, target);

    return proxy;
}
setState(prop, value){
  this._state[prop] = value;
}

getState(){
  return this._proxyToTagetMap.get(this._state)
}

  addListener(property, callback){
    if(!this.listeners.has(property)){
      this.listeners.set(property, []);
    }
    this.listeners.get(property).push(callback);
  }

  notify(property){
    if(this.listeners.has(property)){
      this.listeners.get(property).forEach(
        callback => callback(this._state[property])
      )
    }
  }
}





class TreeSelectionOption{

  /**
   * 
   * @param {string} name 
   * @param {boolean} checked
   * @param {TreeSelectionOption[]} children 
   */
  constructor( {name, checked, children} = {data}){
    this.name = name 
    this.checked = checked
    this.children = children
  }

}


class BaseTreeSelectElement extends HTMLElement{
  constructor(){ 
    super()
    this.attachShadow({ mode: 'open'});
  }

  /**
   * @returns{boolean}
   */
  isTopLevelComponent(){
    throw new Error("To be implemented in Subclass")
  }

}


class TopLevelTreeSelectElement extends BaseTreeSelectElement{
  isTopLevelComponent(){
    return True
  }
}


class TreeSelect extends HTMLElement{
 

  constructor(){ 
    super()
    this.attachShadow({ mode: 'open'});
    

  }


  getChildren(){
    return this.shadowRoot.querySelectorAll("lse-tree-select");
  }

  hasChildren(){
    return this.shadowRoot.querySelectorAll("lse-tree-select").length > 0;
  }
  /**
   * 
   * @param {boolean} v
   */
  setChecked(v){
    this.reactive.setState("checked", v);
    if(this.hasChildren()){
      this.getChildren().forEach(
        child => child.setChecked(v)
      );
    }
  }

  /**
   * @returns{boolean}
   */
  getChecked(){
    return this.reactive.getState().checked
  }

  toggleChecked(){
    this.setChecked(!this.getChecked());
  }


  handleClick(e){
    
    if(e.target.id && e.target.id == this.reactive.getState().name){
      this.toggleChecked();        
    }
  }

  getTemplate(){
    let template = document.createElement("template");
    template.innerHTML = `
    <style>
      :host  .selection-label {
        color: red;
      }
      :host .selection-node {
        margin-left: 40px;
      }
    
    </style> 
    <div class="selection-node">
      <input type="checkbox" id="${this.reactive.getState().name}" ${this.reactive.getState().checked ? "checked" : ""} />
      <label class="selection-label">${this.reactive.getState().name}</label> </br>
      <span>Is Checked ${this.reactive.getState().checked}</span>
    </div>
    `
    return template
  }


  connectedCallback(){
    console.log("Tree Select Connect Callback called");
    console.log(this.getAttribute("data"));
    const data = JSON.parse(this.getAttribute('data'));
    this.reactive = new ReactiveState(new TreeSelectionOption(data));

    // Listen to Event Changes
    this.reactive.addListener("checked", this.render.bind(this));

    // Listen to UI Events
    this.shadowRoot.addEventListener("click", e => this.handleClick(e) )

    this.render();

    
    
  }

  render(){
    this.shadowRoot.innerHTML = "";
    const shadowClone = this.getTemplate().content.cloneNode(true);
    this.shadowRoot.appendChild(shadowClone);
    this.renderChildren(this.shadowRoot.querySelector(".selection-node"));
  }

  renderChildren(container){
    if(this.reactive.getState().children.length > 0){
      this.reactive.getState().children.forEach(
        child => {
          const component = document.createElement("lse-tree-select");
          component.setAttribute("data", JSON.stringify(child))
          container.appendChild(component);
        }
      )
    }
  }
}




customElements.define('lse-tree-select', TreeSelect);
const data = {
  name:"Muscle-Units", checked: true, children: [
  {
    name: "Upper Body",
    checked: false,
    children: [
      {
        name: "Pectoralis Major",
        checked: false,
        children: []
      },
      {
        name: "Latissimus Dorsi",
        checked: true,
        children: []
      }
    ]
  },
  {
    name: "Lower Body",
    checked: true,
    children: [
      {
        name: "Rectus Femoris",
        checked: false,
        children: []
      },
      {
        name: "Gastrocnemius",
        checked: false,
        children: []
      }
    ]
  }
]};

const treeSelect = document.createElement("lse-tree-select");
treeSelect.setAttribute("data", JSON.stringify(data));
document.querySelector('#app').appendChild(treeSelect);

