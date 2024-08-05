const region_selection_data = {
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
  
  let client_side_rendering_container = document.getElementById("csr-example");
  let region_tree_selection = document.createElement("lse-tree-selection")
  region_tree_selection.setAttribute("init-dimension", "Region-Selection")
  region_tree_selection.setAttribute("init-data", JSON.stringify(region_selection_data))
  client_side_rendering_container.appendChild(region_tree_selection)