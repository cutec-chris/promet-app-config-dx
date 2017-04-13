var siConfig,tbToolbar;
dhtmlxEvent(window,"load",function(){
  console.log("Loading Install Page...");
  sbMain.addItem({id: 'siInstall', text: 'Einrichtung', icon: 'fa fa-refresh'});
  siConfig = window.parent.sbMain.cells('siInstall');
  acWizard = siConfig.attachCarousel();
  acWizard.hideControls();
  acWizard.addCell("tsDatabaseTyp");
  var fDatabaseSettings;
	var fDatabaseTyp = acWizard.cells("tsDatabaseTyp").attachForm([
      {type: "block", width: "auto", blockOffset: "40", offsetTop: "30", name: "pSQLite", list: [
        	{type: "label", label: "Wilkommen", value: ""},
        	{type: "label", label: "Hier können Sie festlegen, ob Sie eine persönliche Datenbank auf dieser Mashine, oder einen Datenbankserver verwenden möchten.", labelWidth: "80%"},
        	{type: "block", width: "auto", blockOffset: 20, list: [
            {type: "radio", label: "Lokale Server Datenbank", name: "n1", value:"serv", checked: true},
            {type: "label", label: "Es wird eine mitgelieferte Vorkonfigurietrte Datenbank benutzt. Diese verhält sich wie eine Persönliche Datenbank, muss aber nicht separate erstellt und eingerichtet werden.", value: "", labelWidth: "80%"},
        		{type: "radio", label: "Persönliche Datenbank", name: "n1", value:"pers", checked: true},
        		{type: "label", label: "Bei dieser Variante benötigen Sie keinen Datenbankserver, können dafür allerdings auch nur mit bis zu 3 Clients an der selben Datenbank arbeiten. Empfohlen wird diese Variante wenn Sie hauptsächlich allein mit der Datenbank arbeiten", value: "", labelWidth: "80%"},
        		{type: "radio", label: "Datenbankserver", name: "n1", value:"db"},
        		{type: "label", label: "Verwenden Sie diese Option, wenn Sie bereits einen Datenbankserver besitzen/verwenden oder einrichten möchten. Oder wenn Sie mit Mitarbeitern im Netzwerk auf die Datenbank zugreifen möchten", value: "", labelWidth: "80%"}
        	]}
      ]},
      {type: "button", name: "bNext", label: "New Input", value: "Weiter", offsetTop: "40", offsetLeft: "50"}
    ]);
    fDatabaseTyp.attachEvent("onButtonClick", function(id){
      if (id=='bNext') {
        if (fDatabaseTyp.getItemValue('n1')=='db') {
          fDatabaseSettings.hideItem('pSQLite');
          fDatabaseSettings.showItem('pSQLServer');
        } else {
          fDatabaseSettings.hideItem('pSQLServer');
          fDatabaseSettings.showItem('pSQLite');
        }
        acWizard.goNext();
      }
    });
    acWizard.addCell("tsDatabaseSettings");
  	fDatabaseSettings = acWizard.cells("tsDatabaseSettings").attachForm([
    	{type: "block", width: "auto", blockOffset: "", list: [
    		{type: "block", width: "auto", blockOffset: "", name: "pSQLite", list: [
    			{type: "settings", offsetLeft: "50", offsetTop: "30"},
    			{type: "label", label: "Datenbankverbindung", value: ""},
    			{type: "input", label: "Datenbankpfad", value: "~/promet-erp.db"}
    		]},
    		{type: "block", width: "auto", blockOffset: "", name: "pSQLServer", list: [
    			{type: "settings", offsetLeft: "50"},
    			{type: "label", label: "Datenbanktyp", value: ""},
    			{type: "radio", label: "PostgresSQL", name: "n1", checked: true},
    			{type: "radio", label: "MySQL", name: "n1"},
    			{type: "radio", label: "Microsoft SQL Server", name: "n1"},
    			{type: "newcolumn", offset: "50"},
    			{type: "label", label: "Datenbankverbindung", value: ""},
    			{type: "input", label: "Server", value: "localhost"},
    			{type: "input", label: "Datenbank(pfad)", value: "promet"},
    			{type: "input", label: "Benutzername", value: ""},
    			{type: "password", label: "Kennwort", value: ""}
    		]},
    		{type: "block", width: "auto", offsetLeft: "50", offsetTop: "50", list: [
          {type: "button", name: "bPrior", value: "Zurück"},
    			{type: "newcolumn"},
          {type: "button", name: "bNext", value: "Weiter"}
    		]}
    	]}
    ]);
    fDatabaseSettings.attachEvent("onButtonClick", function(id){
      if (id=='bNext') {
        acWizard.goNext();
        LoadData('/configuration/status',function(Data){
          console.log(Data);
          if ((Data)&&(Data.xmlDoc)) {
            if (Data.xmlDoc.status == 200) { // No Configuration found
              dhtmlx.message({
                type : "info",
                text: "Konfiguration wird übertragen",
                expire: 1000
              });
              StoreData('/configuration/add','SQL:',function(Data){
                if ((aData)&&(aData.xmlDoc)&&(aData.xmlDoc.status == 200)) {
                    console.log("Data stored");
                    dhtmlx.message({
                      type : "info",
                      text: "Daten erfolgreich gespeichert",
                      expire: 5000
                    });
                } else {
                  console.log("Data not stored");
                  dhtmlx.message({
                    type : "error",
                    text: "Fehler beim Speichern der Daten",
                    expire: 5000
                  });
                  acWizard.goFirst();
                }
              },True);
            } else if (Data.xmlDoc.status == 403) { //Server already configured
              dhtmlx.message({
                type : "info",
                text: "Appserver ist bereits konfiguriert",
                expire: 5000
              });
              acWizard.goFirst();
            } else {
              acWizard.goFirst();
              dhtmlx.message({
                type : "error",
                text: "Fehler beim kontaktieren des Appservers",
                expire: 5000
              });
            }
            console.log('Data there');
          } else {
            dhtmlx.message({
              type : "error",
              text: "Appserver nicht erreichbar",
              expire: 5000
            });
            console.log('Appserver not there');
            acWizard.goFirst();
          }
        },true);
      }
      if (id=='bPrior')
        acWizard.goPrev();
    });
    acWizard.addCell("tsDone");
    fDone = acWizard.cells("tsDone").attachForm([
    	{type: "block", width: "auto", blockOffset: "40", offsetTop: "30", name: "pSQLite", offsetLeft: "50", list: [
    		{type: "settings", inputWidth: "80%"},
    	]}
    ]);
      fDone.attachEvent("onButtonClick", function(id){
        if (id=='bPrior')
          acWizard.goPrev();
      });

    sbMain.goToNextItem();
});
