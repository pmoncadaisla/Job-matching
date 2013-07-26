var demoMode = true;


$(document).ready(function () {
    ko.utils.stringContains = function (string, contain) {
        string = string.toLowerCase();
        contain = contain.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '').split(" ").join("|");
        string = string || "";
        //if (contain.length > string.length) return false;
        var regex = new RegExp("" + contain + "");
        //console.log(contain);
        return string.search(regex) !== -1
    };
    //Ordenar ObservableArray por "datacolumn"
    //self.myObservableArray.sortByPropertyAsc('name');
    ko.observableArray.fn.sortByPropertyAsc = function (prop) {
        this.sort(function (obj1, obj2) {
            if (obj1[prop]() == obj2[prop]()) return 0;
            else if (obj1[prop]() < obj2[prop]()) return -1;
            else return 1;
        });
    }
    ko.observableArray.fn.sortByNumberAsc = function (prop) {
        this.sort(function (obj1, obj2) {
            if (obj1[prop]() == obj2[prop]()) return 0;
            else if (parseFloat(obj1[prop]()) > parseFloat(obj2[prop]())) return -1;
            else return 1;
        });
    }

    ko.observableArray.fn.sortByPropertyDesc = function (prop) {
        this.sort(function (obj1, obj2) {
            if (obj1[prop]() == obj2[prop]()) return 0;
            else if (obj1[prop]() > obj2[prop]()) return -1;
            else return 1;
        });
    }
    ko.observableArray.fn.sortByPropertyCat = function (prop) {
        this.sort(function (obj1, obj2) {
            if (obj1[prop]() == obj2[prop]()) return 0;
            else if (obj1[prop]() < obj2[prop]()) return -1;
            else return 1;
        });
    }
    //Te devuelve el contenido compacto de un datacolumn
    ko.utils.getDataColumns = function (type) {
        var results = ko.utils.arrayMap(self.companiesData(), function (item) {
            return item[type].value();
        });
        //console.log(ko.utils.arrayGetDistinctValues(results).sort());
        return ko.utils.arrayGetDistinctValues(results).sort();
    };
    
    templateJson = []
    templateSkills = []
    templateProvinces = []
    templateTypes = []
    templateProvenances = ["gsi", "vulka", "Episteme"]
    templateSearches = {
        "values": []
    }
    templateSearch = {
        "name": "",
        "logo": "",
        "description": "",
    }
    templateSelectedSearch = {
        "id": Math.random(),
        "name": "new_search",
        "logo": "",
        "about": "",
        "jsonrpc": "2.0",
        "changed": "false",
        "completed": "false",
        "total": 1,
        "entityLastID": 1,
        "registered": new Date().toString(),
        "result": [{
                "id": 1,
                "entityName": "",
                "entityLogo": "",
                "provenance": "gsi",
                "isSemantic": "true",
                "semantic": [],
                "solr": [{
                        "name": "hidden",
                        "field": "Provenance",
                        "type": "comboBox",
                        "values": ["gsi"]
                    }, {
                        "name": "province",
                        "field": "Province",
                        "type": "autoComplete",
                        "values": []
                    }, {
                        "name": "type",
                        "field": "Type",
                        "type": "comboBox",
                        "values": []
                    }, {
                        "name": "travel",
                        "field": "Travel",
                        "type": "comboBox",
                        "values": []
                    }, {
                        "name": "freeText",
                        "field": "Description",
                        "type": "inputText",
                        "values": []
                    }
                ]
            },
        ]
    }
    templateEntity = {
        "id": 2,
        "entityName": "",
        "entityLogo": "",
        "provenance": "gsi",
        "isSemantic": "true",
        "semantic": [],
        "solr": [{
                "name": "hidden",
                "field": "Provenance",
                "type": "comboBox",
                "values": ["gsi"]
            }, {
                "name": "province",
                "field": "Province",
                "type": "autoComplete",
                "values": []
            }, {
                "name": "type",
                "field": "Type",
                "type": "comboBox",
                "values": []
            }, {
                "name": "freeText",
                "field": "Description",
                "type": "inputText",
                "values": []
            }
        ]
    }
    templateProvenanceFilterInes = {
        "name": "hidden",
        "field": "Provenance",
        "type": "comboBox",
        "values": ["gsi"]
    }
    templateProvenanceFilterVulka = {
        "name": "hidden",
        "field": "Provenance",
        "type": "comboBox",
        "values": ["vulka"]
    }
    templateProvincesFilter = {
        "name": "province",
        "field": "Province",
        "type": "autoComplete",
        "values": []
    }
    templateTypesFilter = {
        "name": "type",
        "field": "Type",
        "type": "comboBox",
        "values": []
    }
    templateFreeTextFilter = {
        "name": "freeText",
        "field": "Description",
        "type": "inputText",
        "values": []
    }
    AppViewModel = function () {
        self = this;
        var limit = "505";
        self.lang = ko.observable(languages[0]);
        self.loading = ko.observable(false);
        self.existPagination = ko.observable(false);
        self.filter = ko.observable();
        filterType = ko.observable("name");
        self.availableCategories = ko.observableArray();
        self.companiesData = ko.mapping.fromJS(templateJson);
        self.viewData = ko.mapping.fromJS(templateJson);
        self.recommendedData = ko.mapping.fromJS(templateJson);
        self.focusBar = ko.observable(true);
        self.setFocusBar = function () {
            self.focusBar(true);
            return true;
        }
        self.page = ko.observable(0);
        self.status = ko.observable(0);
        self.option = ko.observable(1);
        self.help = ko.observable(false);
        self.helpText = ko.observable(false);
        self.semanticOrder = ko.observable(false);
        self.viewOffers = ko.observableArray();
        self.offerReq = ko.observableArray();
        self.selectedOffer = ko.observable("");
        self.offerDetails = ko.observableArray();
        self.offerDetailsSkills = ko.observableArray();
        self.nestedReqSkills = ko.observableArray();
        self.companyDetails = ko.mapping.fromJS(templateJson);
        self.companyDetailsSkills = ko.mapping.fromJS(templateJson);
        self.currentSearch = ko.mapping.fromJS(templateSelectedSearch)
        self.currentEntity = ko.observable(0);
        self.currentSearches = ko.mapping.fromJS(templateSearches)
        self.newSkillName = ko.observable("");
        self.newSkillLevel = ko.observable("beginner");
        self.newFilterValue = ko.observable("");
        self.Type = ko.observableArray(templateTypes);
        self.selectedType = ko.observable("");
        self.Skill = ko.observableArray(templateSkills);
        self.selectedSkill = ko.observable("");
        self.Provenance = ko.observableArray(templateProvenances);
        self.selectedProvenance = ko.observable(templateProvenances[0]);
        self.Province = ko.observableArray(templateProvinces);
        self.selectedProvince = ko.observable("");
        self.selectedDescription = ko.observable("");
        
        /* Añadido de travel */
        self.Travel = ko.observableArray(["true","false"]);
        self.selectedTravel = ko.observable("");
        /* Fin de añadido */
        
        self.availableLogos = ko.observableArray(["episteme", "Globalmetanoia", "GSI", "sphere", "bird", "circle", "coffee", "ipod", "map", "next", "twitter", "windows", "youtube"]);
        ko.bindingHandlers.kendoPanelBar.options.expandMode = "single";
        ko.bindingHandlers.kendoPanelBar.options.select = expandCollapse;

        function expandCollapse(e) {
            if ($(e.item).is(".k-state-active")) {
                var that = this;
                window.setTimeout(function () {
                    that.collapse(e.item);
                }, 1);
                $(e.item.children).removeClass("k-state-selected");
            }
        };
        //initial functions
        loadSkills('gsi');
        loadProvinces('gsi');
        loadTypes('gsi');
        
        loadSearches();
        self.hideElement = function (elem) {
            alert('eo');
            $(elem).fadeOut()
        }
        //filter the items using the filter text
        self.filteredData = ko.computed(function () {
            var filter = self.filter();
            var data = self.viewData();
            if (!filter) {
                //console.log(self.viewData().length);
                return data;
            } else {
                return ko.utils.arrayFilter(data, function (item) {
                    var type = filterType();	
                    return ko.utils.stringContains(item[type]().toString(), filter);
                    //return true;
                });
            }
        }, self);
        //reload when filteredData changes
        ko.bindingHandlers.autoPaginate = {
            update: function (element, valueAccessor) {
                ko.utils.unwrapObservable(valueAccessor());
                createTooltips();
                OnloadFunction();
		paginate(); 
		if ($('.page_navigation').is(':empty')) {
                self.existPagination(false);
            } else {
                self.existPagination(true);
            }
            }
        };
        self.changeProvenance = function (index, value) {
            var element = self.currentSearch.result()[index()];
            element.solr.removeAll();
            element.semantic.removeAll();
            if (value == 'gsi') {
                element.isSemantic("true");
                element.provenance("gsi");
                //element.solr.push(ko.mapping.fromJS(templateProvenanceFilterInes));
                element.solr.push(ko.mapping.fromJS(templateProvincesFilter));
                element.solr.push(ko.mapping.fromJS(templateTypesFilter));
                element.solr.push(ko.mapping.fromJS(templateFreeTextFilter));
                loadSkills('gsi');
                loadProvinces('gsi');
                loadTypes('gsi');
            }
            if (value == 'vulka') {
                element.isSemantic("false");
                element.provenance("vulka");
                element.solr.push(ko.mapping.fromJS(templateProvenanceFilterVulka));
                element.solr.push(ko.mapping.fromJS(templateProvincesFilter));
                element.solr.push(ko.mapping.fromJS(templateFreeTextFilter));
                loadSkills('vulka');
                loadProvinces('vulka');
                loadTypes('vulka');
            }
        };
        self.reload = function () {
            console.log("reload!");
            self.loading(false);
            $.unblockUI()
            paginate();
            createTooltips();
            OnloadFunction();
            if ($('.page_navigation').is(':empty')) {
                self.existPagination(false);
            } else {
                self.existPagination(true);
            }
            if (self.semanticOrder() && self.filter() == '') {
                $('.semanticCompanies').each(function (index) {
                    var stallFor = 50 * parseInt(index);
                    var value = 1 / (index / 5)
                    $(this).animate({
                        opacity: value
                    }, 200);
                    if (index == 0) $(this).find(".companyMedal").addClass('gold');
                    if (index == 1) $(this).find(".companyMedal").addClass('silver');
                    if (index == 2) $(this).find(".companyMedal").addClass('bronze');
                    if (index < 15) {
                        $(this).hide();
                        $(this).delay(stallFor).fadeIn();
                    }
                });
            } else {
                $('.semanticCompanies').each(function (index) {
                    $(this).animate({
                        opacity: '1'
                    }, 200);
                    if (index == 0) $(this).find(".companyMedal").removeClass('gold');
                    if (index == 1) $(this).find(".companyMedal").removeClass('silver');
                    if (index == 2) $(this).find(".companyMedal").removeClass('bronze');
                    if (index < 15) {
                        $(this).hide();
                        $(this).fadeIn();
                    }
                });
            }
        }

        function HtmlEncode(s) {
            var el = document.createElement("div");
            el.innerText = el.textContent = s;
            s = el.innerHTML;
            return s;
        }

        function loadCategories() {
            $.each(self.loadedCategories(), function (index, item) {
                self.availableCategories(ko.utils.getDataColumns(item.name()));
                //console.log( self.availableCategories());
                populateCategories(index);
            });
        }
        self.changeLanguage = function (place) {
            self.lang(languages[place]);
            if (self.status() == -1) {
                saveDefault = true;
                self.reload();
            }
        };
        self.activateHelp = function (type, value) {
            self.offerDetails([]);
            self.offerDetailsSkills([]);
            self.helpText(false);
            if (type == "offer") {
                $.ajax({
                    type: 'GET',
                    url: endPoint + 'sparql/select?query=SELECT+DISTINCT+%3Fname+%3Flogo+%3Fdetail+%3Fcontractor+%3Fbudget+%3Faddress+%3FbeginDate+%3FendDate+%3Freq%0D%0AWHERE+%7B%0D%0A++GRAPH+%3Chttp%3A%2F%2F' + value + '%3E+%7B%0D%0A++%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23name%3E+%3Fname+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23detail%3E+%3Fdetail+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Flogo%3E+%3Flogo+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fcontractor%3E+%3Fcontractor+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fbudget%3E+%3Fbudget+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Address%3E+%3Faddress+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2FbeginDate%3E+%3FbeginDate+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2FendDate%3E+%3FendDate%0D%0A++%7D%0D%0A%7D&output=json',
                    dataType: 'json',
                    success: function (allData) {
                        data = JSON.stringify(allData.results.bindings);
                        //console.log("Alldata es: " + data);
                        self.offerDetails(ko.mapping.fromJSON(data));
                    },
                    error: function (xhr, status) {
                        alert('Error loading offer ' + status);
                    },
                    data: {},
                    async: false
                });
                $.ajax({
                    type: 'GET',
                    url: endPoint + 'sparql/select?query=SELECT+%3Freq+%3Ffield+%3Fweight+%0D%0AWHERE+%7B%0D%0A++GRAPH+%3Chttp%3A%2F%2F' + value + '%3E+%7B%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2FcompanyReq%3E+%3Freq+.+%0D%0A++++%3Freq+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Preference%3E+%3Fpref1t+.+%0D%0A++++++%3Fpref1t+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Ffield%3E+%3Ffield+.+%0D%0A++++++%3Fpref1t+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23weight%3E+%3Fweight%0D%0A++%7D%0D%0A%7D&output=json',
                    dataType: 'json',
                    success: function (allData) {
                        data = JSON.stringify(allData.results.bindings);
                        //console.log("Alldata es: " + data);
                        self.offerDetailsSkills(ko.mapping.fromJSON(data));
                    },
                    error: function (xhr, status) {
                        alert('Error loading offer ' + status);
                    },
                    data: {},
                    async: false
                });
            }
            if (type == "company") {
                $.ajax({
                    type: 'GET',
                    url: endPoint + 'sparql/select?query=PREFIX+mao%3A+<http%3A%2F%2Fwww.w3.org%2Fns%2Fma-ont%23>%0D%0APREFIX+yt%3A+<http%3A%2F%2Fgdata.youtube.com%2Fschemas%2F2007%23>%0D%0APREFIX+rdfs%3A+<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23>%0D%0APREFIX+foaf%3A+<http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F>%0D%0APREFIX+ldp%3A+<http%3A%2F%2Fwww.w3.org%2Fns%2Fldp%23>%0D%0APREFIX+lmftypes%3A+<http%3A%2F%2Fwww.newmedialab.at%2Flmf%2Ftypes%2F1.0%2F>%0D%0APREFIX+dc%3A+<http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F>%0D%0APREFIX+skos%3A+<http%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23>%0D%0APREFIX+rdf%3A+<http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23>%0D%0APREFIX+owl%3A+<http%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23>%0D%0APREFIX+sioc%3A+<http%3A%2F%2Frdfs.org%2Fsioc%2Fns%23>%0D%0APREFIX+dcat%3A+<http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23>%0D%0APREFIX+dct%3A+<http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F>%0D%0APREFIX+context%3A+<http%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fcontext%2F>%0D%0APREFIX+xsd%3A+<http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23>%0D%0APREFIX+local%3A+<http%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fresource%2F>%0D%0APREFIX+vcard%3A+<http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23>%0D%0APREFIX+cv%3A+<http%3A%2F%2Fkaste.lv%2F~captsolo%2Fsemweb%2Fresume%2Fcv.rdfs%23>%0D%0ASELECT+%3Fname+%3Flogo+%3Fpostalcode+%3Fprovince+%3Faddress+%3Ftype+%3Fsummary+WHERE+%7B%0D%0A++<' + encodeURIComponent(value) + '>+foaf%3Aname+%3Fname+.%0D%0A++<' + encodeURIComponent(value) + '>+foaf%3Athumbnail+%3Flogo+.%0D%0A++<' + encodeURIComponent(value) + '>+vcard%3ApostalCode+%3Fpostalcode+.%0D%0A++<' + encodeURIComponent(value) + '>+vcard%3Alocality+%3Fprovince+.%0D%0A++<' + encodeURIComponent(value) + '>+vcard%3AstreetAddress+%3Faddress+.%0D%0A++<' + encodeURIComponent(value) + '>+cv%3AjobTitle+%3Ftype+.%0D%0A++<' + encodeURIComponent(value) + '>+cv%3AcvDescription+%3Fsummary+.%0D%0A++%0D%0A%7D&output=json',
                    dataType: 'json',
                    success: function (allData) {
                        data = JSON.stringify(allData.results.bindings);
                        //console.log("Alldata es: " + data);
                        var parsedJSON = JSON.parse(data);
                        ko.mapping.fromJS(parsedJSON, self.companyDetails);
                    },
                    error: function (xhr, status) {
                        alert('Loading company ' + status);
                    },
                    data: {},
                    async: false
                });
                $.ajax({
                    type: 'GET',
                    url: endPoint + 'sparql/select?query=PREFIX+mao%3A+<http%3A%2F%2Fwww.w3.org%2Fns%2Fma-ont%23>%0D%0APREFIX+yt%3A+<http%3A%2F%2Fgdata.youtube.com%2Fschemas%2F2007%23>%0D%0APREFIX+rdfs%3A+<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23>%0D%0APREFIX+foaf%3A+<http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F>%0D%0APREFIX+ldp%3A+<http%3A%2F%2Fwww.w3.org%2Fns%2Fldp%23>%0D%0APREFIX+lmftypes%3A+<http%3A%2F%2Fwww.newmedialab.at%2Flmf%2Ftypes%2F1.0%2F>%0D%0APREFIX+dc%3A+<http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F>%0D%0APREFIX+skos%3A+<http%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23>%0D%0APREFIX+rdf%3A+<http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23>%0D%0APREFIX+owl%3A+<http%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23>%0D%0APREFIX+sioc%3A+<http%3A%2F%2Frdfs.org%2Fsioc%2Fns%23>%0D%0APREFIX+dcat%3A+<http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23>%0D%0APREFIX+dct%3A+<http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F>%0D%0APREFIX+context%3A+<http%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fcontext%2F>%0D%0APREFIX+xsd%3A+<http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23>%0D%0APREFIX+local%3A+<http%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fresource%2F>%0D%0APREFIX+cv%3A+<http%3A%2F%2Fkaste.lv%2F~captsolo%2Fsemweb%2Fresume%2Fcv.rdfs%23>%0D%0A%0D%0ASELECT+DISTINCT+%3Fskillname+%3Fskilllevel+WHERE+%7B%0D%0A+++<' + encodeURIComponent(value) + '>++cv%3AhasSkill+%3Fskill+.%0D%0A+++%3Fskill+cv%3AskillName+%3Fsn+.%0D%0A+++%3Fsn+skos%3AprefLabel+%3Fskillname+.%0D%0A+++%3Fskill+cv%3AskillLevel+%3Fsl+.%0D%0A+++%3Fsl+skos%3AprefLabel+%3Fskilllevel%0D%0A%7D&output=json',
                    dataType: 'json',
                    success: function (allData) {
                        data = JSON.stringify(allData.results.bindings);
                        //console.log("Alldata es: " + data);
                        var parsedJSON = JSON.parse(data);
                        ko.mapping.fromJS(parsedJSON, self.companyDetailsSkills);
                    },
                    error: function (xhr, status) {
                        alert('Loading company ' + status);
                    },
                    data: {},
                    async: false
                });
            }
            $('table tr:even').addClass('zebra_stripe');
            if (type == "help") {
                self.helpText(true);
            }
            self.help(!self.help());
            if (self.help()) {
                $("#blackDIV").hide().fadeIn();
            }
        };
        //<SEARCH FUNCTIONS>
        self.addSolrFilter = function (item, name) {
            self.currentSearch.changed('true');
            if (name() == "") return;
            item.push(name());
        };
        self.removeSolrFilter = function (item, name) {
            self.currentSearch.changed('true');
            item.remove(name);
        };
        self.addSemanticFilter = function (item, name, level) {
            self.currentSearch.changed('true');
            if (name() == "") return;
            var tmp = {
                "skill": name(),
                "level": level
            }
            item.push(ko.mapping.fromJS(tmp));
        };
        self.removeSemanticFilter = function (item, name) {
            self.currentSearch.changed('true');
            item.remove(name);
        };
        self.addEntity = function (item) {
            self.currentSearch.changed('true');
            var tmp = self.currentSearch.total();
            self.currentSearch.total(++tmp);
            templateEntity.id = tmp;
            var tmp2 = self.currentSearch.entityLastID();
            self.currentSearch.entityLastID(++tmp2);
            templateEntity.id = tmp2;
            var tmp3 = self.currentEntity();
            self.currentEntity(++tmp3);
            item.push(ko.mapping.fromJS(templateEntity));
            var nextEntity = $('.draggableEmpty').attr('index')
            if (nextEntity == undefined) {
                self.currentSearch.completed('true');
            } else {
                self.currentSearch.completed('false');
            }
            self.resetTab('gsi');
        };
        self.removeEntity = function (item, name) {
            self.currentSearch.changed('true');
            item.remove(name);
            var tmp = self.currentSearch.total();
            self.currentSearch.total(--tmp);
            var tmp3 = self.currentEntity();
            self.currentEntity(--tmp3);
            var nextEntity = $('.draggableEmpty').attr('index')
            if (nextEntity == undefined) {
                self.currentSearch.completed('true');
            } else {
                self.currentSearch.completed('false');
            }
        };
        $(document).ajaxStart(function () {});
        $(document).ajaxStart(function () {});
        self.doSearch = function (entityIndex) {
            self.loading('true');
            $.blockUI();
            var tempString = "";
            var i = 0;
            var entity_index = entityIndex;
            var tempURL = "";
            var query = "";
            ko.utils.arrayFilter(self.currentSearch.result()[entity_index].solr(), function (item) {
                //console.log(item);
                // Hacemos AND para diferentes propiedades y OR para los que estén activos dentro de una misma propiedad
                // Por ejemplo: province:Madrid OR province:Barcelona AND type:Universidad
                i = 0;
                tempString = "";
                if (item.field != undefined && item.type() != "inputText") {
                    var catParent = item.field();
                    $.each(item.values(), function (index2, item2) {
                        if (i == 0) {
                            tempString += catParent + ':"' + item2 + '"';
                            i++;
                        } else {
                            tempString += ' OR ' + catParent + ':"' + item2 + '"';
                        }
                    });
                    //////console.log(tempString);
                    tempURL += '&fq=' + tempString;
                }
                if (item.field != undefined && item.type() == "inputText") {
                    $.each(item.values(), function (index2, item2) {
                        query += item2 + " ";
                    });
                    if (query != "") {
                        query = '&q=' + query
                    } else {
                        query = '&q=*:*'
                    }
                }
            });
            // console.log(query);
            //console.log(tempURL);
            var finalQuery = endPointSOLR + query + tempURL;
            console.log(finalQuery);
            self.viewData.removeAll();
            self.companiesData.removeAll();
            self.recommendedData.removeAll();
            $.ajax({
                type: 'post',
                url: finalQuery,
                data: {},
                dataType: 'json',
                ContentType: 'text/html; charset=UTF-8',
                success: (function (allData) {
                    data = JSON.stringify(allData.response.docs);
                    //console.log(allData);
                    //console.log("Alldata es: " + data); 
                    var parsedJSON = JSON.parse(data);
                    if (self.currentSearch.result()[entity_index].semantic() != '' && self.currentSearch.result()[entity_index].isSemantic() == 'true') {
                        
                        $.growlUI(self.lang().m8 + ':', self.lang().m9);
                        var jsonEmpresas = JSON.stringify(parsedJSON);
                        var unmapped = ko.mapping.toJS(self.currentSearch);
                        var SearchJson = unmapped;
                        var searchName = self.currentSearch.name();
                        $.ajax({
                            type: 'get',
                            //url: 'http://lab.gsi.dit.upm.es/episteme/tomcat/Episteme/CompanyMatcher?offer='+JSON.stringify([SearchJson])+'&entity='+entity_index,
                          //  url: endPointSemanticMatcher+'?offer={"episteme.search.' + searchName + '":' + JSON.stringify([SearchJson]) + '}&entity=' + entity_index,
							  url: endPointSemanticMatcher+'{"episteme.search.new_search":' + JSON.stringify([SearchJson]) + '}',
                           // data: {
                           //    'json': jsonEmpresas
                           // },
                            dataType: 'json',
                            ContentType: 'text/html; charset=UTF-8',
                            success: (function (allData) {
                                data = JSON.stringify(allData);

                                var semanticJson = JSON.parse(data);
                                var parsedJSON = JSON.parse(jsonEmpresas);


                                for(var i=0; i < parsedJSON.length; i++){
                                	var uri = parsedJSON[i]["lmf.uri"];
                                	for(var j = 0; j < semanticJson.length; j++){
                                		if(semanticJson[j]["url"] == uri){
                                			parsedJSON[i]["weight"] = semanticJson[j]["sim"];
                                			break;
                                		}
                                	}
                                }
                                                              
                                
                                
                                //console.log(JSON.stringify(parsedJSON));
                                self.semanticOrder(true);
                                ko.mapping.fromJS(parsedJSON, self.companiesData);
                                ko.mapping.fromJS(parsedJSON, self.viewData);
                                ko.mapping.fromJS(parsedJSON, self.recommendedData);
                                self.recommendedData.sortByNumberAsc('Ranking');
                                self.viewData.sortByNumberAsc('weight');                                
                                $(".dragContainer").hide().fadeIn();
                                self.reload();
                            })
                        });
                    } else {
                        for(var i=0; i < parsedJSON.length; i++){
                            parsedJSON[i]["weight"] = "Off";
                        }
                        
                        self.semanticOrder(false);
                        ko.mapping.fromJS(parsedJSON, self.companiesData);
                        ko.mapping.fromJS(parsedJSON, self.viewData);
                        ko.mapping.fromJS(parsedJSON, self.recommendedData);
                        self.recommendedData.sortByNumberAsc('Ranking');
                        self.viewData.sortByPropertyAsc('name');                        
                        $(".dragContainer").hide().fadeIn();
                        self.reload();
                    }
                })
            });
        };
        self.doSaveJSON = function () {
            if(!demoMode){
                self.currentSearch.changed('false');
                var unmapped = ko.mapping.toJS(self.currentSearch);
                var data = JSON.stringify(unmapped);
                var name = self.currentSearch.name();
                var id = self.currentSearch.id();
                var tmp = {
                    "id": self.currentSearch.id(),
                    "name": self.currentSearch.name(),
                    "logo": self.currentSearch.logo(),
                    "about": self.currentSearch.about(),
                }
                self.addSearchJSON(id, data);
                self.currentSearches.values.remove(function (item) {
                    return item.id() == id
                })
                self.currentSearches.values.push(ko.mapping.fromJS(tmp));
                self.addSearchesJSON();
                infoModal(self.lang().j11);
            }else{
                infoModal(self.lang().demo);
            }
        };
        self.doLoadJSON = function (name) {
            self.getSearchJSON(name);
            sammyPlugin.trigger('redirectEvent', {
                url_data: '#/main/search'
            });
        };
        self.loadComposeSearch = function (name) {
            sammyPlugin.trigger('redirectEvent', {
                url_data: '#/main/' + name
            });
        };
        self.composeSearch = function (name) {
            sammyPlugin.trigger('redirectEvent', {
                url_data: '#/main/new_search'
            });
        };
        self.selectSearch = function (place) {
            self.status(0);
            if (self.currentSearch.changed() == 'false' || self.option() == 1) {
                sammyPlugin.trigger('redirectEvent', {
                    url_data: '#/main/' + place
                });
                return;
            }
            changesModal(function (result) {
                if (result) {
                    self.doSaveJSON();
                    sammyPlugin.trigger('redirectEvent', {
                        url_data: '#/main/' + place
                    });
                } else {
                    sammyPlugin.trigger('redirectEvent', {
                        url_data: '#/main/' + place
                    });
                }
            });
        };
        self.doDeleteJSON = function (item) {
            if(!demoMode){
                deleteOfferModal(function (result) {
                    if (result) {
                        self.deleteSearchJSON(item.id());
                        self.currentSearches.values.remove(item);
                        self.addSearchesJSON();
                        self.reload();
                    } else {}
                });
            }else{
                infoModal(self.lang().demo);
            }
        };
        self.deleteSearchJSON = function (name) {
            if(!demoMode){
                $.ajax({
                    type: "DELETE",
                    url: endPointJSON + "episteme.search." + name,
                    success: function (data) {},
                    error: function () {
                        //alert("Error al eliminar el JSON");
                    }
                });
            }else{
                console.log("Demo mode");
            }
        };
        self.getSearchJSON = function (name) {
            $.getJSON(endPointJSON + "episteme.search." + name, function (searchData) {
                console.log(searchData['episteme.search.' + name]);
                var searchDatos = searchData['episteme.search.' + name];
                var parsedJSON = JSON.parse(searchDatos);
                ko.mapping.fromJS(parsedJSON, self.currentSearch);
                self.resetTab(self.currentSearch.result()[self.currentEntity()].provenance());
            });
        };

        function loadSearches() {
            $.getJSON(endPointJSON + "episteme.searches", function (searchData) {
                //console.log(searchData['episteme.searches']);
                var searchDatos = searchData['episteme.searches'];
                var parsedJSON = JSON.parse(searchDatos);
                ko.mapping.fromJS(parsedJSON, self.currentSearches);
                self.reload();
            });
        }
        self.addSearchesJSON = function () {
            if(!demoMode){
            var unmapped = ko.mapping.toJS(self.currentSearches);
            var data = JSON.stringify(unmapped);
                $.ajax({
                    type: "POST",
                    url: endPointJSON + "episteme.searches",
                    data: JSON.stringify([data]),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        console.log("Subido");
                    },
                    error: function () {
                        //alert("Error al guardar");
                    }
                });
            }else{
                console.log("This is demo mode, no saving enabled");
            }
        };
        self.addSearchJSON = function (name, json) {
            if(!demoMode){
                $.ajax({
                    type: "POST",
                    url: endPointJSON + "episteme.search." + name,
                    data: JSON.stringify([json]),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        console.log("Subido");
                    },
                    error: function () {
                        //alert("Error al guardar");
                    }
                });
            }else{
                console.log("This is demo mode, no saving enabled");
            }
        };
        self.changeURL = function (url) {
            sammyPlugin.trigger('redirectEvent', {
                url_data: url
            });
        };
        self.changeFilters = function (index) {
            $(".entitytab").eq(index).trigger('click');
            sammyPlugin.trigger('redirectEvent', {
                url_data: '#/main/' + self.currentSearch.id()
            });
        };
        self.changeTab = function (index) {
            self.currentEntity(index);
            self.resetTab(self.currentSearch.result()[self.currentEntity()].provenance());
        };
        self.resetTab = function (provenance) {
            //alert(provenance);
            loadSkills(provenance);
            loadProvinces(provenance);
            loadTypes(provenance);
            $('.semanticInput').val('');
            $('.solrInput').val('');
        };
        /* Función que carga del endpoint la lista de skills */
        function loadSkills(graph) {
            templateSkills = []
            var graphINIT = ''
            var graphEND = ''
            if (graph != '') {
                graphINIT = '+++GRAPH+%3Chttp%3A%2F%2F' + graph + '%3E%7B%0D%0A'
                graphEND = '+++%7D%0D%0A'
            }
            var query = endPoint + 'sparql/select?query=PREFIX+mao%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fma-ont%23%3E%0D%0APREFIX+yt%3A+%3Chttp%3A%2F%2Fgdata.youtube.com%2Fschemas%2F2007%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+ldp%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fldp%23%3E%0D%0APREFIX+lmftypes%3A+%3Chttp%3A%2F%2Fwww.newmedialab.at%2Flmf%2Ftypes%2F1.0%2F%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+sioc%3A+%3Chttp%3A%2F%2Frdfs.org%2Fsioc%2Fns%23%3E%0D%0APREFIX+dcat%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23%3E%0D%0APREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX+context%3A+%3Chttp%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fcontext%2F%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0APREFIX+local%3A+%3Chttp%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fresource%2F%3E%0D%0ASELECT+%3Fskillname+WHERE+%7B%0D%0A++%3Fs+skos%3AprefLabel+%3Fskillname+.%0D%0A++%3Fs+skos%3Amember+%22skill%22+++%0D%0A%7D&output=json';
            $.getJSON(query, function (data) {
                $.each(data.results.bindings, function (key, val) {
                    var skill = val.skillname.value;
                    //console.log(skill);
                    templateSkills.push(skill);
                });
                var unique = templateSkills.filter(function (itm, i, a) {
                    return i == a.indexOf(itm);
                });
                self.Skill(unique);
            });
        }
        /* Función que carga del endpoint la lista de provinces */
        function loadProvinces(graph) {
            templateProvinces = []
            var graphINIT = ''
            var graphEND = ''
            if (graph != '') {
                graphINIT = '+++GRAPH+%3Chttp%3A%2F%2F' + graph + '%3E%7B%0D%0A'
                graphEND = '+++%7D%0D%0A'
            }
            var query = endPoint + 'sparql/select?query=PREFIX+mao%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fma-ont%23%3E%0D%0APREFIX+yt%3A+%3Chttp%3A%2F%2Fgdata.youtube.com%2Fschemas%2F2007%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+ldp%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fldp%23%3E%0D%0APREFIX+lmftypes%3A+%3Chttp%3A%2F%2Fwww.newmedialab.at%2Flmf%2Ftypes%2F1.0%2F%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+sioc%3A+%3Chttp%3A%2F%2Frdfs.org%2Fsioc%2Fns%23%3E%0D%0APREFIX+dcat%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23%3E%0D%0APREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX+context%3A+%3Chttp%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fcontext%2F%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0APREFIX+local%3A+%3Chttp%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fresource%2F%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0ASELECT+DISTINCT+%3Fprovince+WHERE+%7B%0D%0A++%3Fs+rdf%3Atype+foaf%3APerson++.%0D%0A++%3Fs+vcard%3Alocality+%3Fprovince%0D%0A%7D%0D%0AORDER+BY+%3Fprovince+ASC%28%3Fprovince%29&output=json';
            $.getJSON(query, function (data) {
                $.each(data.results.bindings, function (key, val) {
                    var province = val.province.value;
                    //console.log(skill);
                    templateProvinces.push(province);
                });
                var unique = templateProvinces.filter(function (itm, i, a) {
                    return i == a.indexOf(itm);
                });
                self.Province(unique);
            });
        }
        /* Función que carga del endpoint la lista de types */
        function loadTypes(graph) {
            templateTypes = []
            var graphINIT = ''
            var graphEND = ''
            if (graph != '') {
                graphINIT = '+++GRAPH+%3Chttp%3A%2F%2F' + graph + '%3E%7B%0D%0A'
                graphEND = '+++%7D%0D%0A'
            }
            var query = endPoint + 'sparql/select?query=PREFIX+mao%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fma-ont%23%3E%0D%0APREFIX+yt%3A+%3Chttp%3A%2F%2Fgdata.youtube.com%2Fschemas%2F2007%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+ldp%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fldp%23%3E%0D%0APREFIX+lmftypes%3A+%3Chttp%3A%2F%2Fwww.newmedialab.at%2Flmf%2Ftypes%2F1.0%2F%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+sioc%3A+%3Chttp%3A%2F%2Frdfs.org%2Fsioc%2Fns%23%3E%0D%0APREFIX+dcat%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23%3E%0D%0APREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX+context%3A+%3Chttp%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fcontext%2F%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0APREFIX+local%3A+%3Chttp%3A%2F%2Fkrusti.gsi.dit.upm.es%3A8080%2FLMF-3.0.0%2Fresource%2F%3E%0D%0APREFIX+cv%3A+%3Chttp%3A%2F%2Fkaste.lv%2F%7Ecaptsolo%2Fsemweb%2Fresume%2Fcv.rdfs%23%3E%0D%0ASELECT+DISTINCT+%3Ftype+WHERE+%7B%0D%0A++%3Fa+rdf%3Atype+foaf%3APerson+.%0D%0A++%3Fa+cv%3AjobTitle+%3Ftype++++%0D%0A%7D%0D%0AORDER+BY+%3Ftype+ASC%28%3Ftype%29&output=json';
            $.getJSON(query, function (data) {
                $.each(data.results.bindings, function (key, val) {
                    var type = val.type.value;
                    //console.log(skill);
                    templateTypes.push(type);
                });
                var unique = templateTypes.filter(function (itm, i, a) {
                    return i == a.indexOf(itm);
                });
                self.Type(unique);
            });
        }
        // <CLIENT SIDE ROUTES>
        sammyPlugin = $.sammy(function () {
            this.bind('redirectEvent', function (e, data) {
                this.redirect(data['url_data']);
            });
            //MAIN
            this.get('#/main/:param', function (context) {
                if (this.params.param == '') {
                    this.redirect('#/main/start');
                    return;
                }
                if (this.params.param == 'select') {
                    self.option(1);
                    self.page(0.5);
                    ko.mapping.fromJS(templateSelectedSearch, self.currentSearch);
                } else {
                    self.page(0);
                }
                if (this.params.param == 'new_search') {
                    self.currentSearch.id(Math.random());
                    self.resetTab('gsi');
                    self.status(1);
                    if (self.option() == 1) {
                        self.currentSearch.name('new_search');
                    }
                } else if (this.params.param == 'start') {
                    self.status(0);
                    self.option(0);
                    ko.mapping.fromJS(templateSelectedSearch, self.currentSearch);
                } else if (self.status() == 0 && self.page() != 0.5) {
                    self.status(1);
                    self.option(0);
                    self.getSearchJSON(this.params.param);
                }
                //self.viewOffers.sortByPropertyAsc('name');
                $("#droppableElements").animate({
                    height: "122px",
                    width: "0px"
                }, 200);
                $("#droppableElements").css('box-shadow', 'inset 0 0 3px #ccc');
                $(".dragContainer").hide().fadeIn();
                $(".dropContainer").hide();
                $(".lines").hide().fadeIn('slow');
                $(".menuItemArrow").stop().animate({
                    marginLeft: "50px",
                }, 300);
                //$(".filterPanel").stop().animate({marginLeft: "-250px"}, 300 );
                self.filter("");
                self.focusBar(true);
                self.reload();
            });
            //COMPOSER
            this.get('#/composer/:offerId/entity/:entityId', function (context) {
                if (self.status() == 0) {
                    this.redirect('#/main/' + this.params.offerId);
                    return;
                }
                self.status(1);
                self.page(1);
                self.currentEntity(this.params.entityId);
                self.doSearch(this.params.entityId);
                numBoxes = (self.currentSearch.total() - 1);
                droppwidth = 152 + (numBoxes * 152);
                $("#droppableElements").css('height', "122px");
                $("#droppableElements").css('width', droppwidth + "px");
                self.page(1);
                $(".controlContainer").fadeIn();
                $(".dropContainer").hide().fadeIn();
                $("#droppableElements").css('box-shadow', 'inset 0 0 3px #ccc');
                $(".menuItemArrow").stop().animate({
                    marginLeft: "170px"
                }, 300);
                self.filter("");
                self.focusBar(true);
            });
            //FINALIZE
            this.get('#/finalize', function (context) {
                if (self.status() == 0) {
                    this.redirect('#/main/start');
                    return;
                }
                self.page(2);
                if (self.status() > 0) {
                    $(".filterPanel").stop().animate({
                        marginLeft: "-250px"
                    }, 300);
                }
                $.each($('.droppableCompany'), function (indexa) {
                    var company = $(this);
                    $.each($('.finalizeCompany'), function (indexb) {
                        if (indexa == indexb) {
                            $(this).html(company.html());
                        }
                    });
                });
                $(".dropContainer").show();
                $('.finalize').hide().fadeIn();
                $(".menuItemArrow").stop().animate({
                    marginLeft: "290px",
                }, 300);
                $(".lines").hide().fadeIn('slow');
                self.filter("");
                self.focusBar(true);
                self.reload();
            });
            this.get('#/wizard', function (context) {
                self.page(3);
                self.filter("");
                self.reload();
            });
        }).run('#/main/select'); //END SAMMY
        // </CLIENT SIDE ROUTES>
    } //End model
    // Activates knockout.js
    ko.applyBindings(new AppViewModel());
});
