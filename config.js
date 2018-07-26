rtl.module("config",["System","JS","Web","Classes","Avamm","webrouter","dhtmlx_base","dhtmlx_layout","dhtmlx_carousel","dhtmlx_form"],function () {
  "use strict";
  var $mod = this;
  this.ShowConfig = function (aValue) {
    var Result = undefined;
    var FParent = undefined;
    var Layout = null;
    var acWizard = null;
    var fDatabaseTyp = null;
    var fDatabaseSettings = null;
    var fDone = null;
    function GotoNext() {
      acWizard.goNext();
    };
    function GotoPrior() {
      acWizard.goPrev();
    };
    function GotoFirst() {
      acWizard.goFirst();
    };
    function DataIsStored(aValue) {
      var Result = undefined;
      if (aValue.status === 200) {
        dhtmlx.message(pas.JS.New(["type","info","text",rtl.getResStr(pas.config,"strDataisStored"),"expire",1000]));
        window.location.href = pas.Avamm.GetBaseUrl() + "\/index.html";
      } else {
        dhtmlx.message(pas.JS.New(["type","error","text",rtl.getResStr(pas.config,"strErrorDataStore") + aValue.responseText,"expire",10000]));
        window.setTimeout(GotoFirst,100);
      };
      return Result;
    };
    function StatusLoaded(aValue) {
      var Result = undefined;
      var iData = "";
      if (aValue.status === 200) {
        dhtmlx.message(pas.JS.New(["type","info","text",rtl.getResStr(pas.config,"strSendingConfig"),"expire",1000]));
        iData = "SQL:";
        if (fDatabaseTyp.getItemValue("n1") == "db") {
          iData = (iData + ("" + fDatabaseSettings.getItemValue("n3"))) + ";";
          iData = (((((((iData + ("" + fDatabaseSettings.getItemValue("srv"))) + ";") + ("" + fDatabaseSettings.getItemValue("db"))) + ";") + ("" + fDatabaseSettings.getItemValue("user"))) + ";") + ("" + fDatabaseSettings.getItemValue("pw"))) + ";";
        } else if (fDatabaseTyp.getItemValue("n1") == "serv") {
          iData = iData + "sqlite-3;;help.db;;;"}
         else iData = ((iData + "sqlite-3;;") + ("" + fDatabaseSettings.getItemValue("db1"))) + ";;;";
        pas.Avamm.StoreData("\/configuration\/add",iData,false,"",6000).then(DataIsStored);
      } else if (aValue.status === 403) {
        dhtmlx.message(pas.JS.New(["type","info","text",rtl.getResStr(pas.config,"strAppserverConfigured"),"expire",1000]));
        window.setTimeout(GotoFirst,100);
      } else {
        dhtmlx.message(pas.JS.New(["type","error","text",rtl.getResStr(pas.config,"strErrorAppserverreachable"),"expire",10000]));
        window.setTimeout(GotoFirst,100);
      };
      return Result;
    };
    function SaveWizard() {
      acWizard.goNext();
      pas.Avamm.LoadData("\/configuration\/status",false,"",6000).then(StatusLoaded);
    };
    function FormButtonClick(id) {
      if (id === "bNext") {
        if (fDatabaseTyp.getItemValue("n1") == "db") {
          fDatabaseSettings.hideItem("pSQLite");
          fDatabaseSettings.showItem("pSQLServer");
        } else if (fDatabaseTyp.getItemValue("n1") == "serv") {
          acWizard.goLast();
          SaveWizard();
        } else {
          fDatabaseSettings.hideItem("pSQLServer");
          fDatabaseSettings.showItem("pSQLite");
        };
        window.setTimeout(GotoNext,100);
      };
    };
    function FormButtonClick2(id) {
      if (id === "bNext") {
        window.setTimeout(GotoNext,100);
      } else if (id === "bPrior") {
        window.setTimeout(GotoPrior,100);
      };
    };
    pas.System.Writeln("configuring...");
    FParent = pas.Avamm.GetAvammContainer();
    Layout = new dhtmlXLayoutObject(pas.JS.New(["parent",FParent,"pattern","1C"]));
    Layout.cells("a").hideHeader();
    acWizard = rtl.getObject(Layout.cells("a").attachCarousel(pas.JS.New([])));
    acWizard.addCell("tsDatabaseTyp",0);
    fDatabaseTyp = rtl.getObject(acWizard.cells("tsDatabaseTyp").attachForm(pas.JS.New([])));
    fDatabaseTyp.addItem(null,pas.JS.New(["type","block","width","auto","blockOffset",20,"offsetTop",30,"name","pSQLite"]));
    fDatabaseTyp.addItem("pSQLite",pas.JS.New(["type","label","label",rtl.getResStr(pas.config,"strWelcome")]));
    fDatabaseTyp.addItem("pSQLite",pas.JS.New(["type","label","label",rtl.getResStr(pas.config,"strDatabaseConfig")]));
    fDatabaseTyp.addItem(null,pas.JS.New(["type","block","width","auto","blockOffset",20,"offsetTop",30,"name","pDBType"]));
    fDatabaseTyp.addItem("pDBType",pas.JS.New(["type","radio","label",rtl.getResStr(pas.config,"strLocaldatabase"),"name","n1","value","serv","checked",true]));
    fDatabaseTyp.addItem("pDBType",pas.JS.New(["type","label","label",rtl.getResStr(pas.config,"strLocaldatabaseDesc")]));
    fDatabaseTyp.addItem("pDBType",pas.JS.New(["type","radio","label",rtl.getResStr(pas.config,"strPersonaldatabase"),"name","n1","value","serv","checked",true]));
    fDatabaseTyp.addItem("pDBType",pas.JS.New(["type","label","label",rtl.getResStr(pas.config,"strPersonaldatabaseDesc")]));
    fDatabaseTyp.addItem("pDBType",pas.JS.New(["type","radio","label",rtl.getResStr(pas.config,"strServerdatabase"),"name","n1","value","serv","checked",true]));
    fDatabaseTyp.addItem("pDBType",pas.JS.New(["type","label","label",rtl.getResStr(pas.config,"strServerdatabaseDesc")]));
    fDatabaseTyp.addItem(null,pas.JS.New(["type","button","label",rtl.getResStr(pas.config,"strServerdatabase"),"name","bNext","value",rtl.getResStr(pas.config,"strNext")]));
    fDatabaseTyp.attachEvent("onButtonClick",FormButtonClick);
    acWizard.addCell("tsDatabaseSettings",1);
    fDatabaseSettings = rtl.getObject(acWizard.cells("tsDatabaseSettings").attachForm(pas.JS.New([])));
    fDatabaseSettings.addItem(null,pas.JS.New(["type","block","width","auto","blockOffset",0,"offsetTop",0,"name","pGlobal"]));
    fDatabaseSettings.addItem("pGlobal",pas.JS.New(["type","block","width","auto","blockOffset",0,"offsetTop",0,"name","pSQLite"]));
    fDatabaseSettings.addItem("pSQLite",pas.JS.New(["type","settings","offsetLeft",50,"offsetTop",30]));
    fDatabaseSettings.addItem("pSQLite",pas.JS.New(["type","label","label",rtl.getResStr(pas.config,"strDatabaseConnection")]));
    fDatabaseSettings.addItem("pSQLite",pas.JS.New(["type","input","label",rtl.getResStr(pas.config,"strDatabasePath"),"name","db1","value","~\/promet-erp.db"]));
    fDatabaseSettings.addItem("pGlobal",pas.JS.New(["type","block","width","auto","blockOffset",0,"offsetTop",0,"name","pSQLServer"]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","settings","offsetLeft",0,"offsetTop",30]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","label","label",rtl.getResStr(pas.config,"strDatabaseType")]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","radio","label","PostgresSQL","name","n3","checked",true,"value","postgresql"]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","radio","label","MySQL","name","n3","checked",true,"value","mysql"]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","radio","label","Microsoft SQL Server","name","n3","checked",true,"value","mssql"]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","newcolumn"]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","label","label",rtl.getResStr(pas.config,"strDatabaseConnection")]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","input","label",rtl.getResStr(pas.config,"strServer"),"name","srv","value","localhost"]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","input","label",rtl.getResStr(pas.config,"strDatabase"),"name","db","value","promet"]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","input","label",rtl.getResStr(pas.config,"strUser"),"name","user","value","promet"]));
    fDatabaseSettings.addItem("pSQLServer",pas.JS.New(["type","input","label",rtl.getResStr(pas.config,"strPassword"),"name","pw","value",""]));
    fDatabaseSettings.addItem(null,pas.JS.New(["type","button","label",rtl.getResStr(pas.config,"strPrior"),"name","bPrior","value",rtl.getResStr(pas.config,"strPrior")]));
    fDatabaseSettings.addItem(null,pas.JS.New(["type","button","label",rtl.getResStr(pas.config,"strServerdatabase"),"name","bNext","value",rtl.getResStr(pas.config,"strNext")]));
    fDatabaseSettings.attachEvent("onButtonClick",FormButtonClick2);
    acWizard.addCell("tsDone",2);
    fDone = rtl.getObject(acWizard.cells("tsDone").attachForm(pas.JS.New([])));
    return Result;
  };
  $mod.$resourcestrings = {strWelcome: {org: "Wilkomen"}, strDatabaseConfig: {org: "Hier können Sie festlegen, ob Sie eine persönliche Datenbank auf dieser Mashine, oder einen Datenbankserver verwenden möchten."}, strLocaldatabase: {org: "Lokale Server Datenbank"}, strLocaldatabaseDesc: {org: "Es wird eine mitgelieferte Vorkonfigurietrte Datenbank benutzt. Diese verhält sich wie eine Persönliche Datenbank, muss aber nicht separate erstellt und eingerichtet werden."}, strPersonaldatabase: {org: "Persönliche Datenbank"}, strPersonaldatabaseDesc: {org: "Bei dieser Variante benötigen Sie keinen Datenbankserver, können dafür allerdings auch nur mit bis zu 3 Clients an der selben Datenbank arbeiten. Empfohlen wird diese Variante wenn Sie hauptsächlich allein mit der Datenbank arbeiten"}, strServerdatabase: {org: "Datenbankserver"}, strServerdatabaseDesc: {org: "Verwenden Sie diese Option, wenn Sie bereits einen Datenbankserver besitzen\/verwenden oder einrichten möchten. Oder wenn Sie mit Mitarbeitern im Netzwerk auf die Datenbank zugreifen möchten"}, strNext: {org: "Weiter"}, strPrior: {org: "Zurück"}, strDatabaseConnection: {org: "Datenbankverbindung"}, strDatabasePath: {org: "Datenbankpfad"}, strDatabaseType: {org: "Datenbanktyp"}, strServer: {org: "Server"}, strDatabase: {org: "Datenbank(pfad)"}, strUser: {org: "Benutzer"}, strPassword: {org: "Passwort"}, strSendingConfig: {org: "Konfiguration wird übertragen"}, strAppserverConfigured: {org: "Appserver ist bereits konfiguriert"}, strErrorAppserverreachable: {org: "Fehler beim kontaktieren des Appservers"}, strDataisStored: {org: "Appserver erfolgreich konfiguriert !"}, strErrorDataStore: {org: "Fehler beim speichern: "}};
  $mod.$init = function () {
    pas.dhtmlx_base.WidgetsetLoaded.then($mod.ShowConfig);
  };
});
//# sourceMappingURL=config.js.map
