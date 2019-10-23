'use strict';
/**
 * @file 
 * Helper functions to create template data for Sport In The Box HTML templates.
 * @author IC Control Media And Sport AB <info@iccmediasport.com>
 * @version "1.0.2"
 */


class SiBHelper {

    /**
     * Possible SIB editor types.
     * Editor types define when kind of control used to show the data.
     * @return {string} Settings field type.
     */
    static DATATYPES = {
        BOOL: "bool",
        STRING: "string",
        SELECT: "select",
        INTEGER: "integer",
        FLOAT: "float",
        DATE: "date",
        TIME: "time",
        COLOR: "color",
        FILE: "file",
    };


    constructor(){
        this.events = new EventHandler();
        this.templateinfo = new TemplateInfo();
        this.settings = new Settings();
        this.data = new Data();
        this.eventData = null;
        this.resultData = null;

        this.websocket = null;

        console.log("SiB Helper Initialized")
    }


    /**
     * 
     * @param {*} json json object representing a sib-template
     * @param {function} handler eventhandler that is used to emit events
     */
    parseJSONString(json) {
        if(JSON.parse(json).settings != null) {
            this.settings = JSON.parse(json).settings;
            console.log("Parsed settings");
            this.events.emit('updatedSettings');
        }
        if(JSON.parse(json).data != null) {
            this.data = JSON.parse(json).data;
            console.log("Parsed data");
            if(this.data)
                this.events.emit('updatedData');
        } 
        if(JSON.parse(json).eventData != null) {
            this.eventData = JSON.parse(json).eventData;
            console.log("Parsed eventData");
            if(this.eventData)
                this.events.emit('updatedEventData',this.eventData);
        }          
    }

    getSettings(category, field) {
        if(this.settings[category].rows[field])
            return this.settings[category].rows[field].value ? this.settings[category].rows[field].value : this.settings[category].rows[field].defaultValue;
        else {
            console.log('ERROR: Setting field or category not found!')
            return '';
        }
           
    }

    getData(category, field) {
        if(this.data[category].rows[field])
            return this.data[category].rows[field].value ? this.data[category].rows[field].value : '';
        else {
            console.log('ERROR: Data field or category <not found!')
            return '';
        }
    }


    /**
     * Converts the SiB-template-object and returns a string consisting of the JSON
     */
    getJSONString() {
        var obj = {
            'templateinfo' : this.templateinfo,
            'settings' : this.settings,
            'data' : this.data
        };
        return JSON.stringify(obj);
    }

    openResultData(host = "127.0.0.1", port = 8080){  
        this.websocket = new ReconnectingWebSocket('ws://' + host + ':' +port + '/resultdata');
        this.websocket.debug = false;

        this.websocket.onopen = (evt) => this.ResultDataonOpen(evt);
        this.websocket.onclose = (evt) => this.ResultDataonClose(evt);
        this.websocket.onmessage = (evt) => this.ResultDataonMessage(evt);
        this.websocket.onerror = (evt) => this.ResultDataonError(evt);       
    }

    ResultDataonOpen(evt)
    {
        console.log("ResultData CONNECTED");
    }

    ResultDataonClose(evt)
    {
        console.log("ResultData DISCONNECTED",evt);
    }

    ResultDataonMessage(evt)
    {
        try { 
            this.resultData = JSON.parse(evt.data);
            this.events.emit('updatedResultData',this.resultData);
        } catch (error) { 
            console.log("ERROR: no json object!",evt.data);
        }        
    }

    ResultDataonError(evt)
    {
        //console.log("ERROR",evt);
    }

    ResultDatadoSend(message)
    {
        this.websocket.send(message);
    }
}

class EventHandler {
    
    constructor() {
        this.events = [];
    }

    on(event, func) {

        if(typeof func !== 'function') {
            throw new TypeError('callback must be a function');
        }
        this.events[event] = func;        
    }

    emit(event, data) {
        if(event)
            this.events[event](data);
    }
}

class TemplateInfo {
    /**
     * Constructs a new TemplateInfo-object
     * @param {*} name 
     * @param {*} desc 
     * @param {*} resolution 
     * @param {*} testedWithSiBVersion 
     * @param {*} templateVersion 
     * @param {*} templateUpdated 
     * @param {*} contactName 
     * @param {*} contactEmail 
     */
    constructor(name, desc, resolution, testedWithSiBVersion, templateVersion, templateUpdated, contactName, contactEmail) {
        this.name = name ? name : '';
        this.desc = desc ? desc : '';
        this.resolution = resolution ? resolution : '';
        this.testedWithSiBVersion = testedWithSiBVersion ? testedWithSiBVersion : '';
        this.templateVersion = templateVersion ? templateVersion : '';
        this.templateUpdated = templateUpdated ? templateUpdated : '';
        this.contactName = contactName ? contactName : '';
        this.contactEmail = contactEmail ? contactEmail : '';
    }
}

class Settings {
    
    constructor() {
    }

    /**
     * Add a Category to the Settings
     * @param {*} name Unique name of Category
     * @param {*} desc Short description of Category
     */
    addCategory(name, desc) {
        this[name] = new Category(name, desc);
        return this[name];
    }
}

class Data {

    addCategory(name, desc) {
        return this[name] = new Category(name, desc);
    }
}

class DataRows {
    constructor() {
        
    }
}

class Category {
    /**
     * Constructs a Category-object
     * @param {*} name Unique name of the Category
     * @param {*} desc Short Description of the Category
     */
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
        this.rows = new DataRows();  
    }

    /**
     * Adds a DataRow to the Category-Object
     * @param {*} newrow A DataRow object to be added to the Category
     */
    addRow(name = '') {  
        this.rows[name] = new DataRow(name);
        //this[newrow.name] = newrow;
        return this.rows[name];
    }
}

class DataRow {

    /**
     * Constructs a new DataRow-object
     * @param {*} name Unique name of DataRow
     * @param {*} desc Short description of DataRow
     * @param {*} datatype Specification of what Datatype DataRow consists of
     * @param {*} value Value of DataRow
     * @param {*} selectValue (Optional) if DataRow is a Select-element: SelectValues of Object
     */
    constructor(name = '', desc = '', datatype = '', value = '', selectValue = '', defaultValue = '') {
        this.name = name;
        this.desc = desc ;
        this.datatype = datatype;
        this.defaultValue = defaultValue;
        this.value = value;
        this.selectValue = selectValue;        
    }
}


