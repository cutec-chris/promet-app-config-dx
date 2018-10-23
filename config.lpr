library config;
  uses js, web, classes, Avamm, webrouter, dhtmlx_base, dhtmlx_layout,
    dhtmlx_carousel,dhtmlx_form;

resourcestring
  strWelcome                    = 'Wilkomen';
  strDatabaseConfig             = 'Hier können Sie festlegen, ob Sie eine persönliche Datenbank auf dieser Mashine, oder einen Datenbankserver verwenden möchten.';

  strLocaldatabase              = 'Lokale Server Datenbank';
  strLocaldatabaseDesc          = 'Es wird eine mitgelieferte Vorkonfigurietrte Datenbank benutzt. Diese verhält sich wie eine Persönliche Datenbank, muss aber nicht separate erstellt und eingerichtet werden.';

  strPersonaldatabase           = 'Persönliche Datenbank';
  strPersonaldatabaseDesc       = 'Bei dieser Variante benötigen Sie keinen Datenbankserver, können dafür allerdings auch nur mit bis zu 3 Clients an der selben Datenbank arbeiten. Empfohlen wird diese Variante wenn Sie hauptsächlich allein mit der Datenbank arbeiten';

  strServerdatabase             = 'Datenbankserver';
  strServerdatabaseDesc         = 'Verwenden Sie diese Option, wenn Sie bereits einen Datenbankserver besitzen/verwenden oder einrichten möchten. Oder wenn Sie mit Mitarbeitern im Netzwerk auf die Datenbank zugreifen möchten';

  strNext                       = 'Weiter';
  strPrior                      = 'Zurück';
  strDatabaseConnection         = 'Datenbankverbindung';
  strDatabasePath               = 'Datenbankpfad';
  strDatabaseType               = 'Datenbanktyp';
  strServer                     = 'Server';
  strDatabase                   = 'Datenbank(pfad)';
  strUser                       = 'Benutzer';
  strPassword                   = 'Passwort';
  strSendingConfig              = 'Konfiguration wird übertragen';
  strAppserverConfigured        = 'Appserver ist bereits konfiguriert';
  strErrorAppserverreachable    = 'Fehler beim kontaktieren des Appservers';
  strDataisStored               = 'Appserver erfolgreich konfiguriert !';
  strErrorDataStore             = 'Fehler beim speichern: ';
  strConfigurationwillbesaved   = 'Konfiguration wird gespeichert...<br>';

function ShowConfig(aValue : JSValue) : JSValue;
var
  FParent: JSValue;
  Layout: TDHTMLXLayout;
  acWizard: TDHTMLXCarousel;
  fDatabaseTyp,fDatabaseSettings, fDone: TDHTMLXForm;
  procedure GotoNext;
  begin
    acWizard.goNext;
  end;
  procedure GotoPrior;
  begin
    acWizard.goPrev;
  end;
  procedure GotoFirst;
  begin
    acWizard.goFirst;
  end;
  function DataIsStored(aValue: TJSXMLHttpRequest): JSValue;
  begin
    if aValue.Status=200 then
      begin
        dhtmlx.message(js.new(['type','info',
                               'text', strDataisStored,
                               'expire', 1000
                               ]));
        TDHTMLXCarouselCell(acWizard.cells('tsDone')).attachHTMLString(strDataisStored);
        window.location.href := Avamm.GetBaseUrl+'/index.html';
      end
    else
      begin
        dhtmlx.message(js.new(['type','error',
                               'text', strErrorDataStore+aValue.responseText,
                               'expire', 10000
                               ]));
        window.setTimeout(@GotoFirst, 500);
      end;
  end;
  function StatusLoaded(aValue: TJSXMLHttpRequest): JSValue;
  var
    iData: String;
  begin
    if aValue.Status=200 then
      begin
        dhtmlx.message(js.new(['type','info',
                               'text', strSendingConfig,
                               'expire', 1000
                               ]));
        iData := 'SQL:';
        if (fDatabaseTyp.getItemValue('n1')='db') then
          begin
            iData := iData+string(fDatabaseSettings.getItemValue('n3'))+';';
            iData := iData+string(fDatabaseSettings.getItemValue('srv'))+';'+string(fDatabaseSettings.getItemValue('db'))+';'+string(fDatabaseSettings.getItemValue('user'))+';'+string(fDatabaseSettings.getItemValue('pw'))+';';
          end
        else if (fDatabaseTyp.getItemValue('n1')='serv') then
          iData := iData+'sqlite-3;;help.db;;;'
        else
          iData := iData+'sqlite-3;;'+string(fDatabaseSettings.getItemValue('db1'))+';;;';
        StoreData('/configuration/add',iData)._then(TJSPromiseResolver(@DataIsStored));
      end
    else if aValue.Status=403 then
      begin
        dhtmlx.message(js.new(['type','info',
                               'text', strAppserverConfigured,
                               'expire', 1000
                               ]));
        window.setTimeout(@GotoFirst, 500);
      end
    else
      begin
        dhtmlx.message(js.new(['type','error',
                               'text', strErrorAppserverreachable ,
                               'expire', 10000
                               ]));
        window.setTimeout(@GotoFirst, 500);
      end;
  end;
  procedure SaveWizard;
  begin
    acWizard.goNext();
    LoadData('/configuration/status')._then(TJSPromiseResolver(@StatusLoaded));
  end;

  procedure FormButtonClick(id : string);
  begin
    if id = 'bNext' then
      begin
        if (fDatabaseTyp.getItemValue('n1')='db') then
          begin
            fDatabaseSettings.hideItem('pSQLite');
            fDatabaseSettings.showItem('pSQLServer');
          end
        else if (fDatabaseTyp.getItemValue('n1')='serv') then
          begin
            acWizard.goLast();
            SaveWizard();
          end
        else
          begin
            fDatabaseSettings.hideItem('pSQLServer');
            fDatabaseSettings.showItem('pSQLite');
          end;
        window.setTimeout(@GotoNext, 500);
      end;
  end;
  procedure FormButtonClick2(id : string);
  begin
    if id = 'bNext' then
      begin
        window.setTimeout(@GotoNext, 500);
      end
    else if id = 'bPrior' then
      begin
        window.setTimeout(@GotoPrior, 500);
      end
  end;

begin
  console.log('configuring...');
  FParent := Avamm.GetAvammContainer();
  Layout := TDHTMLXLayout.New(js.new(['parent',FParent,'pattern','1C']));
  Layout.cells('a').hideHeader;
  acWizard := TDHTMLXCarousel(Layout.cells('a').attachCarousel(js.new([])));
  acWizard.addCell('tsDatabaseTyp',0);
  fDatabaseTyp := TDHTMLXForm(acWizard.cells('tsDatabaseTyp').attachForm(js.new([])));
  fDatabaseTyp.addItem(null,js.new(['type','block',
                                    'width','auto',
                                    'blockOffset',20,
                                    'offsetTop',30,
                                    'name','pSQLite'
                                   ]));
  fDatabaseTyp.addItem('pSQLite',js.new(['type','label',
                                         'label',strWelcome
                                        ]));
  fDatabaseTyp.addItem('pSQLite',js.new(['type','label',
                                         'label',strDatabaseConfig
                                        ]));
  fDatabaseTyp.addItem(null,js.new(['type','block',
                                    'width','auto',
                                    'blockOffset',20,
                                    'offsetTop',30,
                                    'name','pDBType'
                                   ]));
  fDatabaseTyp.addItem('pDBType',js.new(['type','radio',
                                         'label',strLocalDatabase,
                                         'name','n1',
                                         'value','serv',
                                         'checked',true
                                        ]));
  fDatabaseTyp.addItem('pDBType',js.new(['type','label',
                                         'label',strLocalDatabaseDesc
                                        ]));
  fDatabaseTyp.addItem('pDBType',js.new(['type','radio',
                                         'label',strPersonalDatabase,
                                         'name','n1',
                                         'value','serv',
                                         'checked',false
                                        ]));
  fDatabaseTyp.addItem('pDBType',js.new(['type','label',
                                         'label',strPersonalDatabaseDesc
                                        ]));
  fDatabaseTyp.addItem('pDBType',js.new(['type','radio',
                                         'label',strServerdatabase,
                                         'name','n1',
                                         'value','serv',
                                         'checked',false
                                        ]));
  fDatabaseTyp.addItem('pDBType',js.new(['type','label',
                                         'label',strServerdatabaseDesc
                                        ]));
  fDatabaseTyp.addItem(null,js.new(['type','button',
                                    'label',strServerdatabase,
                                    'name','bNext',
                                    'value',strNext
                                   ]));
  fDatabaseTyp.attachEvent('onButtonClick',@FormButtonClick);
  acWizard.addCell('tsDatabaseSettings',1);
  fDatabaseSettings := TDHTMLXForm(acWizard.cells('tsDatabaseSettings').attachForm(js.new([])));
  fDatabaseSettings.addItem(null,js.new(['type','block',
                                    'width','auto',
                                    'blockOffset',0,
                                    'offsetTop',0,
                                    'name','pGlobal'
                                   ]));
  fDatabaseSettings.addItem('pGlobal',js.new(['type','block',
                                    'width','auto',
                                    'blockOffset',0,
                                    'offsetTop',0,
                                    'name','pSQLite'
                                   ]));
  fDatabaseSettings.addItem('pSQLite',js.new(['type','settings',
                                    'offsetLeft',50,
                                    'offsetTop',30
                                   ]));
  fDatabaseSettings.addItem('pSQLite',js.new(['type','label',
                                         'label',strDatabaseConnection
                                        ]));
  fDatabaseSettings.addItem('pSQLite',js.new(['type','input',
                                         'label',strDatabasePath,
                                         'name','db1',
                                         'value','~/promet-erp.db'
                                        ]));
  fDatabaseSettings.addItem('pGlobal',js.new(['type','block',
                                    'width','auto',
                                    'blockOffset',0,
                                    'offsetTop',0,
                                    'name','pSQLServer'
                                   ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','settings',
                                    'offsetLeft',0,
                                    'offsetTop',30
                                   ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','label',
                                         'label',strDatabaseType
                                        ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','radio',
                                         'label','PostgresSQL',
                                         'name','n3',
                                         'checked',true,
                                         'value','postgresql'
                                        ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','radio',
                                         'label','MySQL',
                                         'name','n3',
                                         'checked',true,
                                         'value','mysql'
                                        ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','radio',
                                         'label','Microsoft SQL Server',
                                         'name','n3',
                                         'checked',true,
                                         'value','mssql'
                                        ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','newcolumn']));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','label',
                                         'label',strDatabaseConnection
                                        ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','input',
                                         'label',strServer,
                                         'name','srv',
                                         'value','localhost'
                                        ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','input',
                                         'label',strDatabase,
                                         'name','db',
                                         'value','promet'
                                        ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','input',
                                         'label',strUser,
                                         'name','user',
                                         'value','promet'
                                        ]));
  fDatabaseSettings.addItem('pSQLServer',js.new(['type','input',
                                         'label',strPassword,
                                         'name','pw',
                                         'value',''
                                        ]));
  fDatabaseSettings.addItem(null,js.new(['type','button',
                                    'label',strPrior,
                                    'name','bPrior',
                                    'value',strPrior
                                   ]));
  fDatabaseSettings.addItem(null,js.new(['type','button',
                                    'label',strServerdatabase,
                                    'name','bNext',
                                    'value',strNext
                                   ]));
  fDatabaseSettings.attachEvent('onButtonClick',@FormButtonClick2);
  acWizard.addCell('tsDone',2);
  TDHTMLXCarouselCell(acWizard.cells('tsDone')).attachHTMLString(strConfigurationwillbesaved);
  fDone := TDHTMLXForm(acWizard.cells('tsDone').attachForm(js.new([])));
end;

initialization
  WidgetsetLoaded._then(@ShowConfig);
end.

