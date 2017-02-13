var siConfig,tbToolbar;
dhtmlxEvent(window,"load",function(){
  console.log("Loading Times Page...");
  sbMain.addItem({id: 'siTimes', text: 'Zeitaufschreibung', icon: 'fa fa-refresh'});
  siTimes = window.parent.sbMain.cells('siConfig');
  tbToolbar = siConfig.attachToolbar({
    parent:"pToolbar",
      items:[
         {id: "new", type: "button", text: "Neu", img: "fa fa-plus-circle"}
        ,{id: "sep1", type: "separator" }
      ],
    iconset: "awesome"
  });
  tbToolbar.attachEvent("onClick", function(id) {
    if (id=='new') {
      AddEntry();
    }
  });
});
