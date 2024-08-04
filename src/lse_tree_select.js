/**
 * Public API
 * HTML-TagName:
 * <lse-tree-selection-container>
 * Required HTML-Attributes:
 *  dimension-key := Unique Identifer for an lse-tree-selection-container instance
 *  init-data := Initial TreeSelectionOption structure that gets rendered in DOM-Tree in mounting-phase
 * 
 * Dispatches TreeSelectionChangeEvent
 * type: lse-tree-selection-change (= Event-Name)
 * 
 */


class TreeSelectionChangeEvent extends Event{
  
  /**
   * @typedef {Object} TreeSelectionChangeEventDetail
   * @property {string} dimension_key 
   * @property {number[]} selected_ids 
  /**
   * 
   * @param {TreeSelectionChangeEventDetail} detail 
   */
  constructor(detail){
    super("lse-tree-selection-change", {bubbles: true})
    this.detail = detail
  }
}




class TreeSelectionContainer extends HTMLElement{
  constructor(){
    super()
  }
  
  connectedCallback(){
    console.log(`On Connected called in ${this.constructor.name}`)
    this.initErrors = ""
    this.initData = this.parseInitData()
    this.initDimension = this.getInitDimension()
    /**
     * @type {Set}
     */
    this.selectedIDs = new Set()
    
    if(this.isInitDataValid(this.initData) && this.isInitDimensionValid() ){
      this.render(this.initData);
      this.setAttribute("init-data", "done")
      this.addEventListener("lse-tree-selection-changed", this.handleChangedSelection)
    }
    else{
      this.setAttribute("init-data", this.initErrors)
    }
  }

    /**
   * @typedef {Object} TreeSelectionOption 
   * @property {number} id - A unique identifier for the Selection Option within the TreeSelection
   * @property {string}  label - The visible name for the selection Option
   * @property {TreeSelectionNode[]} children - Child Selection Options 
   */
  
  /**
   * @returns {TreeSelectionOption}
   */
   parseInitData(){
    return JSON.parse(this.getAttribute("init-data")); 
  }

  /**
   * 
   * @returns {string} 
   */
  getInitDimension(){
    return this.getAttribute("init-dimension");
  }






  /**
   * @param {TreeSelectionOption} initdata 
   * @returns {boolean} 
   */
  isInitDataValid(initData){
    if ((initData == {} || initData == null || initData == undefined )){
      this.initErrors = "Init data is undefined or Empty"
      return false
    }
    if(!initData.hasOwnProperty("id")){
      this.initErrors = "Not each node has an id property"
      return false
    }
    if(!initData.hasOwnProperty("label")){
      this.initErrors = "Not each node has a label property"
      return false
    }
    if(!initData.hasOwnProperty("children")){
      this.initErrors = "Not each node as a children property"
      return false
    }
    if(! Array.isArray(initData.children)){
      this.initErrors = "The children must be an array"
      return false
    }
    return initData.children.every(child => this.isInitDataValid(child));
  }
  /**
   * @returns {boolean}
   */
  isInitDimensionValid(){
    if (typeof this.initDimension != "string"){
      this.setAttribute("init-dimension", "Error: Please explitly set a unique Dimension name here")
      return false
    }
    return true
  }

  /**
   * 
   * @param {TreeSelectionOption} renderData 
   */
  render(renderData){
    console.log(`Render called in ${this.constructor.name}`)
    
    console.log(`Render Data Before: ${renderData}`)
    
    let tree = document.createElement("lse-tree-selection-node");
    tree.setAttribute("init-data", JSON.stringify(this.initData));
    this.appendChild(tree);
    console.log(`Render Data After: ${renderData}`)

  }

  /**
   * 
   * @param {CustomEvent} ev 
   */
  handleChangedSelection(ev){
    if(ev.detail.isSelection){
      this.selectedIDs = new Set([...this.selectedIDs, ...ev.detail.affectedIDs])
    }else{
      Array.from(ev.detail.affectedIDs).forEach(
        unselectedId => this.selectedIDs.delete(unselectedId)
      );
    }
    let topEv = new TreeSelectionChangeEvent({
      dimension_key: this.initDimension,
      selected_ids: Array.from(this.selectedIDs).map(s => Number(s)),
    });
    this.dispatchEvent(topEv);
    console.log(`Dispatched TopLevel ChangedSelection => new State: ${JSON.stringify(topEv)} `)
  }
}

customElements.define('lse-tree-selection-container', TreeSelectionContainer)


class TreeSelectionNode extends HTMLElement{
  
  constructor(){
    super()
    this.childCount = 0
    this.checkedChilds = new Set()


  }
  
  static get observedAttributes() {
    return ['checked'];
  }


  /**
   * @returns {TreeSelectionOption}
   */
  parseInitData(){
    return JSON.parse(this.getAttribute("init-data"));
  }

  connectedCallback(){
    console.log(`On Connected called in ${this.constructor.name}`);
    let initData = this.parseInitData();
    this.childCount = initData.children ? initData.children.length : 0
    this.render(initData);
    this.setAttribute("init-data", "done")
    this.addEventListener("change", this.handleSelectionChange)
    this.addEventListener("lse-tree-selection-changed", this.handleChangedSelection)
  }
  /**
   * 
   * @returns TreeSelectionNode[]
   */
  getChildElements(){
    return Array.from(this.children).filter(child => child.nodeName.toLowerCase() == "lse-tree-selection-node")
  }

  /**
   * 
   * @param {number[]} affectedIDs
   * @param {boolean} isSelection 
   */
  reportChangedSelectionUpwards(affectedIDs, isSelection){
    let ev  = new CustomEvent("lse-tree-selection-changed", {
      detail: {
        affectedIDs: affectedIDs,
        isSelection, isSelection
      },
      bubbles: true
    });
    this.dispatchEvent(ev)


  }

  /**
   * Update Parent Node Display in case all Child Nodes are now checked
   * @param {ev} CustomEvent 
   */
  handleChangedSelection(ev){
    console.log("Handle Changed Selection")
    let allChildsActive = true
    if(this.hasChildren() &&   ev.target.id != this.id){
      this.getChildElements().forEach( child => {
        if(!child.querySelector("input").checked){
          allChildsActive = false
        }
      });
      this.querySelector("input").checked = allChildsActive
    }
  }

  /**
   * 
   * @param {Event} ev 
   */
  handleSelectionChange(ev){
    ev.stopPropagation()
    console.log(`Handle Selection of ${ev.target.value} to ${ev.target.checked}`)
    let affectedIDs = []
    if(!this.hasChildren()){
      affectedIDs.push(this.id);
    }
    if(this.hasChildren()){
      affectedIDs.push(...this.propagateSelectionChangeToLeafs(ev));
    }
    this.reportChangedSelectionUpwards(affectedIDs, ev.target.checked)
    console.log(affectedIDs)
  }
  /**
   * 
   * @param {Event} Event that initially caused the Update
   * Propagate Selection Change to Childs
   */
  propagateSelectionChangeToLeafs(ev){
    let affectedIDs = []
    this.getChildElements().forEach( child => {
        if(!child.hasChildren()){
          affectedIDs.push(child.id)
        }
        child.querySelector("input").checked = ev.target.checked;
        if(child.hasChildren()){
          affectedIDs.push(...child.propagateSelectionChangeToLeafs(ev));
        }
          
    });
    return affectedIDs
  }
    
    

  hasChildren(){
    return this.childCount > 0;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Attribute Changed Called")
    if (name === 'data') {
        console.log(oldValue);
        console.log(newValue)
    }
}

  /**
   * 
   * @param {TreeSelectionOption} initData 
   * @returns {DocumentFragment}
   */
  getNodeContent(initData){
    let template = document.createElement("template");
    template.innerHTML = `
    <input type="checkbox" value=${initData.id} />
    <label class="selection-label">${initData.label}</label>
    `
    return template.content.cloneNode(true);
  }

  /**
   * @param {HTMLElement} currentNode 
   * @param {TreeSelectionOption} initData 
   */
  renderChildren(container, initData){
    if(initData && initData.children && initData.children.length > 0){
      initData.children.forEach(child => {
        let child_selection_node = document.createElement("lse-tree-selection-node");
        child_selection_node.setAttribute("init-data", JSON.stringify(child));
        container.append(child_selection_node);
      });
    }
  }

  /**
   * 
   * @param {TreeSelectionOption} initData 
   */
  render(initData){
    this.setAttribute("id", initData.id)
    this.append(this.getNodeContent(initData))
    this.renderChildren(this, initData)
  }
}

customElements.define('lse-tree-selection-node',TreeSelectionNode);








class TreeSelect extends HTMLElement{
 

  constructor(){ 
    super()
    this.attachShadow({ mode: 'open'});
    

  }

  /**
   * 
   * @returns 
   */
  getChildren(){
    return this.shadowRoot.querySelectorAll("lse-tree-select");
  }

  /**
   * 
   * @returns {boolean}
   */

  hasChildren(){
    return this.reactive.getState().children.length > 0
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
        margin-left: 80px;
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

  updateData(data){
    this.reactive = new ReactiveState(data)
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
  id: 30,
  label:"Muscle-Units", 
  children: [
  {
    id: 20,
    label: "Upper Body",
    children: [
      {
        id: 21,
        label: "Pectoralis Major",
      },
      {
        id: 22,
        label: "Latissimus Dorsi",
        children: []
      }
    ]
  },
  {
    id: 10,
    label: "Lower Body",
    children: [
      {
        id: 11,
        label: "Rectus Femoris",
        children: []
      },
      {
        id: 12,
        label: "Gastrocnemius",
        children: []
      }
    ]
  }
]};

const data2 = {
  id: 19999,
  label:"Europe",
  children: [
    {
      id: 1999,
      label: "Spain",
      children: [
        {
          id: 199,
          label: "Asturias",
          children: [
            {
              id: 10,
              label: "Gijon",
              children: []
            },
            {
              id: 11,
              label: "Oviedo",
              children: []
            },
            {
              id: 12,
              label: "Avilés",
              children: []
            }
          ]
        },
        {
          id: 299,
          label: "Castellón",
          children: [
            {
              id: 21,
              label: "Villarel",
              children: []
            },
            {
              id: 22,
              label: "Burriana",
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 5999,
      label: "Portugal",
      children: [
        {
          id: 599,
          label: "Estremadura",
          children: [
            {
              id: 232,
              label: "Lisboa",
              children: []
            }
          ]
        }
      ]
    }
  ]
}


let region_tree_selection = document.createElement("lse-tree-selection-container")
region_tree_selection.setAttribute("init-dimension", "Region-Selection")
region_tree_selection.setAttribute("init-data", JSON.stringify(data2))
app.appendChild(region_tree_selection)

