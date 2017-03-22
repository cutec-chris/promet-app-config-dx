var siConfig,tbToolbar;
dhtmlxEvent(window,"load",function(){
  console.log("Loading Install Page...");
  sbMain.addItem({id: 'siInstall', text: 'Einrichtung', icon: 'fa fa-refresh'});
  siConfig = window.parent.sbMain.cells('siInstall');
  acWizard = siConfig.attachCarousel();
  acWizard.addCell("tsDatabaseTyp");
	fDatabaseTyp = acWizard.cells("tsDatabaseTyp").attachForm([
        	{type: "label", label: "Wilkommen", value: ""},
        	{type: "label", label: "Hier können Sie festlegen, ob Sie eine persönliche Datenbank auf dieser Mashine, oder einen Datenbankserver verwenden möchten.", value: "", labelWidth: "80%"},
        	{type: "block", width: "auto", blockOffset: 20, list: [
        		{type: "radio", label: "Persönliche Datenbank", name: "n1", checked: true},
        		{type: "label", label: "Bei dieser Variante benötigen Sie keinen Datenbankserver, können dafür allerdings auch nur mit bis zu 3 Clients an der selben Datenbank arbeiten. Empfohlen wird diese Variante wenn Sie hauptsächlich allein mit der Datenbank arbeiten", value: "", labelWidth: "80%"},
        		{type: "radio", label: "Datenbankserver", name: "n1"},
        		{type: "input", label: "Verwenden Sie diese Option, wenn Sie bereits einen Datenbankserver besitzen/verwenden oder einrichten möchten. Oder wenn Sie mit Mitarbeitern im Netzwerk auf dei Datenbank zugreifen möchten", value: "", labelWidth: "80%"}
        	]}
    ]);
    acWizard.addCell("tsDatabaseSettings");
  	fDatabaseTyp = acWizard.cells("tsDatabaseSettings").attachForm([
	     {type: "block", width: "auto", blockOffset: "", list: [
		     {type: "settings", offsetLeft: "50"},
		     {type: "label", label: "Datenbanktyp", value: ""},
		     {type: "radio", label: "PostgresSQL", name: "n1", checked: true},
		     {type: "radio", label: "MySQL", name: "n1"},
		     {type: "radio", label: "Microsoft SQL Server", name: "n1"},
		     {type: "radio", label: "SQLite", name: "n1"},
		  {type: "newcolumn", offset: "50"},
		    {type: "label", label: "Datenbankverbindung", value: ""},
		    {type: "input", label: "Server", value: "localhost"},
		    {type: "input", label: "Benutzername", value: ""},
		    {type: "password", label: "Kennwort", value: ""}
	    ]}
    ]);
    acWizard.addCell("tsDone");
    fDone = acWizard.cells("tsDone").attachForm();
});
