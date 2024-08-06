# LSE-TREE-SELECTION

A dependency free web component enabling consistent interactivity of a tree selection view. It's usable both in client- and server side rendering settings (csr & ssr).

# Showcase
[![E2E-Tests](https://img.youtube.com/vi/OWD8yDEvPuw/0.jpg)](https://www.youtube.com/watch?v=OWD8yDEvPuw)


## Table of Contents
- [Installation](#installation)
- [Examples](#examples)
- [HTML-API](#html-api)
- [Event-API](#event-api)
- [Style-API](#style-api)

## Installation

You can install the package using npm:

## HTML-API

### `<lse-tree-selection>`
#### Attributes

| Attribute        | Description                                               | Possible Values               | Required       |
|------------------|-----------------------------------------------------------|-------------------------------|----------------|
| `init-dimension` | Identifier to identify the selection hierarchy uniquely.  |  A distinctive string         | yes            |
| `init-data`      | Holder of data selection structure in csr-setting         |  Stringified JSON string, see below | csr only |

The data selection structure is defined as follows in recursive manner:
```javascript
// Leaf Node Example
{
    id: 1 // Numeric identifier of selection option, must be unique within the `<lse-tree-selection>` instance
    label: "Label for option 1" // String that is visually displayed
    children: [] // Array that holds objects of the exact structure as defined in this example or is empty in case of Leaf Nodes
}
```

#### Inner-HTML Characteristics 
- Empty in csr-etting
- In ssr-setting a structure of nested `<lse-tree-selection-node>`


### `<lse-tree-selection-node>`
If the attribute **init-data** is given in `<lse-tree-selection>` as explained above, these nodes are automatically rendered, when the `<lse-tree-selection>` DOM node is mounted.

In a ssr-setting the following characterics must be satisfied.

#### Attributes
| Attribute        | Description                                               | Possible Values               | Required       |
|------------------|-----------------------------------------------------------|-------------------------------|----------------|
| `id` | Identifier to identify the selection node uniquely within the lse-tree-selection instance |  A numeric identifier         | yes            |


#### Inner-HTML Characteristics
The Inner-HTML must contain an `<input>` element of type checkbox and with a value that corresponds to the id-attribute of the containing `<lse-tree-selection-node>` DOM node.

## Event-API

With each selection the `<lse-tree-selection>` element dispatches a custom *TreeSelectionChangeEvent*.
Hierarchically higher DOM Nodes should listen to `lse-tree-selection-change` to get notified about selection changes as well.

###  TreeSelectionChangeEvent
This is a custom Event, whose detail property refers to an object with the following properties
- *dimension_key*: Corresponds to the attribute value `init-dimension` of `<lse-tree-selection>`
- *selected_ids* : An Array numbers, that correspond to the selected leaf nodes identifiers of the corresponding selection hierarchy.  


## Style-API
The component doesn't make any assumptions about its CSS styling. <br/>
As showed in the examples CSS can leverage the high specificity of the introduced selection tags, which should help to define enterprise-wise consistent styling of such components. <br />
The component doesn't make use of any shadow DOM feature. 
