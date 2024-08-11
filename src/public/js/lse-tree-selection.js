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




class TreeSelection extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    console.log(`On Connected called in ${this.constructor.name}`)
    console.log(this.getAttribute("init-data") != null)
    /**
     * @type {Set}
     */
    this.selectedIDs = new Set()
    this.initDimension = this.getInitDimension()
    if(this.isInitDimensionValid() ){
      this.addEventListener("lse-tree-selection-changed", this.handleChangedSelection)
      this.setAttribute("id", this.initDimension)
      this.setAttribute("init-dimension", "done")
    }

    if(this.isClientSideRenderingEnabled()){
      this.initErrors = ""
      this.initData = this.parseInitData()
      if(this.isInitDataValid(this.initData)){
        this.render(this.initData);
        this.setAttribute("init-data", "done")
      } else{
        this.setAttribute("init-data", this.initErrors)
      }

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

  isClientSideRenderingEnabled(){
    return this.getAttribute("init-data") != null;
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


class TreeSelectionNode extends HTMLElement{
  
  constructor(){
    super()
    this.childCount = 0
    this.checkedChilds = new Set()
  }
  
  static get observedAttributes() {
    return ['checked'];
  }

  isClientSideRenderingEnabled(){
    return this.getAttribute("init-data") != null;
  }

  /**
   * @returns {TreeSelectionOption}
   */
  parseInitData(){
    return JSON.parse(this.getAttribute("init-data"));
  }

  connectedCallback(){
    console.log(`On Connected called in ${this.constructor.name}`);
    if(this.isClientSideRenderingEnabled()){
      let initData = this.parseInitData();
      this.childCount = initData.children ? initData.children.length : 0
      this.render(initData);
      this.setAttribute("init-data", "done")
    } else{
      this.childCount =  this.children.length
    }
    
    
    
    
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
   * @param {Event} Event that initially caused the update
   * propagate selection change to childs
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
    return this.querySelectorAll("lse-tree-selection-node").length > 0
  }

  /**
   * 
   * @param {TreeSelectionOption} initData 
   * @returns {DocumentFragment}
   */
  getNodeContent(initData){
    let template = document.createElement("template");
    template.innerHTML = `
    <input id=${`lbl-${initData.id}`} type="checkbox" value=${initData.id} />
    <label class="selection-label" for="lbl-${initData.id}">${initData.label} </label>
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




function register_lse_tree_selection_components(){
  customElements.define('lse-tree-selection', TreeSelection);
  customElements.define('lse-tree-selection-node',TreeSelectionNode);
}

export {register_lse_tree_selection_components}