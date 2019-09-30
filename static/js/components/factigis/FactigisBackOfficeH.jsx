import React from 'react';
import ReactDOM from 'react-dom';
import ReactTabs from 'react-tabs';
import Select from 'react-select';
import token from '../../services/token-service';
import cookieHandler from 'cookie-handler';
import Griddle from 'griddle-react';
import FG_GridPerZoneH2 from '../factigis/Factigis_GridPerZoneH2.jsx';
import FG_GridPerZoneH from '../factigis/Factigis_GridPerZoneH.jsx';
import mymap from '../../services/map-service';
import layers from '../../services/layers-service';
import {Navbar, Nav, NavItem, NavDropdown, DropdownButton,FormGroup,FormControl,MenuItem,Breadcrumb, CollapsibleNav} from 'react-bootstrap';
import Modal from 'react-modal';
import {agregarEstadoHistoria, agregarObservacionHistorial} from '../../services/factigis_services/factigis_add-service';
import LayerList from '../../components/LayerList.jsx';
import {loadCurrentHistoryData, loadFactStates} from '../../services/factigis_services/factigis_loadBackOfficeStates.js';
import _ from 'lodash';
import BasemapToggle from "esri/dijit/BasemapToggle";
import {saveGisredLogin, getFormatedDate, capitalize} from '../../services/login-service';
import {factigis_findSedProperties, factigis_findRotuloProperties } from  '../../services/factigis_services/factigis_dynamicElementQuery';
import {factigis_findRotulo} from '../../services/factigis_services/factigis_find-service';
import { updateAttributesPerFolio} from '../../services/factigis_services/factigis_loadBackofficeData';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import env from '../../services/factigis_services/config';
import {Button} from 'react-toolbox/lib/button';
//13.3.2018
import {formatDates} from  '../../utils/milliSecondsToDate';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/es';

import {factigis_findSGOCert, searchNivelesCoci} from '../../services/factigis_services/factigis_searchSGOCertificate';


function createDataObject(){
  return {
    'Folio' : 0 ,
    'Estado Tramite': 0,
    'Nombre': 0,
    'Apellido':0,
    'Tipo Mejora': 0 ,
    'Zona': 0,
    'Origen Factibilidad': 0,
    'Geometry': 0,
    'Alimentador' : 0,
    'Rut' : 0,
    'Telefono':  0,
    'Email': 0,
    'Tipo_cliente ':0,
    'Tipo_contribuyente ':0,
    'Rotulo ':0,
    'Tramo':0,
    'Empalme ':0,
    'Fase ':0,
    'Potencia ':0,
    'Capacidad_empalme ':0,
    'Capacidad_interruptor ':0,
    'Tiempo_empalme ':0,
    'Tipo_empalme ':0,
    'Cantidad_empalme ':0,
    'ID_Direccion ':0,
    'Direccion ':0,
    'Zona_campamentos':0,
    'Zona_concesion ':0,
    'Zona_restringida':0,
    'Zona_transmision ':0,
    'Zona_vialidad ':0,
    'Potencia_calculada ':0,
    'DistRotuloMedidor ':0,
    'DistDireccionMedidor ':0,
    'Comuna ':0,
    'Idnodo ':0,
    'Estado_tramite ':0,
    'Tipo_factibilidad ':0,
    'Sed ':0,
    'PotenciaDispSed ':0
  };
}

function createDataObject2(){
  return {
    'ID Factibilidad' : '' ,
    'Estado Tramite':  '',
    'Fecha Cambio':  '',
    'Usuario': '',
    'Observacion':  ''
  };
}

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const customStylesFormulario = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '50%',
    height                : '50%',
    textAlign             : 'center'
  }
};


var tipoEstado = [
	{ value: 'NUEVA', label: 'NUEVA' },
	{ value: 'EN TRAMITE', label: 'EN TRAMITE' },
	{ value: 'CERRADA', label: 'CERRADA' }
];

var tipoMejora = [
  { value: 'POR DEFINIR', label: 'POR DEFINIR' },
	{ value: 'MEJORA PREVIA', label: 'MEJORA PREVIA' },
	{ value: 'MEJORA POST', label: 'MEJORA POST' },
  { value: 'RECHAZADA', label: 'RECHAZADA'}
];

var tiposFase = [
  { value: 'A', label: 'A' },
	{ value: 'B', label: 'B' },
	{ value: 'C', label: 'C' },
  { value: 'ABC', label: 'ABC' }
];

var detalle1 = [
  {value: 'Extensión Red MT Aérea', label: 'Extensión Red MT Aérea'},
  {value: 'Extensión Red MT Subterránea', label: 'Extensión Red MT Subterránea'},
  {value: 'Extensión Red BT Aérea', label: 'Extensión Red BT Aérea'},
  {value: 'Extensión Red BT Subterránea', label: 'Extensión Red BT Subterránea'},
  {value: 'Aumento Capacidad Subestación Distribución', label: 'Aumento Capacidad Subestación Distribución'},
  {value: 'Instalación de Nueva Subestación Distribución', label: 'Instalación de Nueva Subestación Distribución'},
  {value: 'Refuerzo Red MT Aérea', label: 'Refuerzo Red MT Aérea'},
  {value: 'Refuerzo Red MT Subterránea', label: 'Refuerzo Red MT Subterránea'},
  {value: 'Refuerzo Red BT Aérea', label: 'Refuerzo Red BT Aérea'},
  {value: 'Refuerzo Red BT Subterránea', label: 'Refuerzo Red BT Subterránea'}
]


class FactigisBackOfficeH extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      facb_observaciones: '',
      open: false,
      modalStatus: '',
      opcionesEstado: tipoEstado,
      opcionesMejora: tipoMejora,
      cbEstadoValue: '',
      cbMejoraValue: '',
      loadData: [{}],
      facB_rut: '',
      facB_folio: '',
      facB_nombre: '',
      facB_apellido: '',
      facB_telefono: '',
      facB_email: '',
      facB_tipoCliente: '',
      facB_tipoContribuyente: '',
      facB_tipoFactibilidad: '',
      facB_tipoMejora: '',
      facB_estadoTramite: '',
      facB_origenFactibilidad: '',
      facB_rotulo: '',
      facB_direccion: '',
      facB_tipoBTMT: '',
      facB_tramo: '',
      facB_sed: '',
      facB_tipoEmpalme: '',
      facB_fase: '',
      facB_potencia: '',
      facB_tiempoEmpalme: '',
      facB_cantidadEmpalme: '',
      facB_potenciaSolicitada: '',
      facB_potenciaDisponible: '',
      facB_potenciaCalculada: '',
      facB_zona: '',
      facB_concesion: '',
      facB_restringida: '',
      facB_vialidad: '',
      facB_campamento: '',
      facB_transmision: '',
      myDataEstados: [{}],
      factB_distanciaRM: '',
      factB_distanciaDM: '',
      facB_tiposFase: '',
      facB_puntoConexion: '',
      //dynamic query
      facB_sedNombre: '',
      facB_sedKVA: '',
      facB_tiposFase: '',
      facB_clasificacion: '',
      obsDisable: true,
      btnGuardarState: true,
      faseSelected: '',
      togglePoste: 'OFF',
      rotuloFinal: '',
      btnGuardarState2: true,
      btnGuardarState3: true,
      fases: [],
      selectedRowId: '',
      openFiltro: false,
      factB_comuna: '',
      //Certificado SGO
      facB_formularioObrasAvailable: 'Elija una factibilidad',
      facB_formularioObrasVer: true,
      factiCert_diasVialidad: 0,
      factiCert_diasPlazo: 0,
      factiCert_diasMunicipales: 0,
      factiCert_diasTerceros: 0,
      factiCert_diasCalculados: 0,
      factiCert_costoCompania: '',
      factiCert_detalle1: detalle1,
      factiCert_detalle2: [],
      factiCert_detalle3: [],
      factiCert_observacion: '',

      facB_ubicacionMedidorTerreno: ''

    }
    this.loadDataa = this.loadDataa.bind(this);
    this.clearFieldsAttr = this.clearFieldsAttr.bind(this);
    this.handleDayChangeStart = this.handleDayChangeStart.bind(this);
    this.handleDayChangeEnd = this.handleDayChangeEnd.bind(this);
  }

  onChildChanged(newState){

    this.setState({
      facB_rut: newState[0]['Rut'],
      facB_folio: newState[0]['Folio'],
      facB_nombre: newState[0]['Nombre'],
      facB_apellido: newState[0]['Apellido'],
      facB_telefono: newState[0]['Telefono'],
      facB_email: newState[0]['Email'],
      facB_tipoCliente: newState[0]['Tipo Cliente'],
      facB_tipoContribuyente: newState[0]['Tipo Contribuyente'],
      facB_tipoFactibilidad: newState[0]['Tipo Factibilidad'],
      facB_tipoMejora: newState[0]['Tipo Mejora'],
      facB_estadoTramite: newState[0]['Estado Tramite'],
      facB_origenFactibilidad: newState[0]['Origen Factibilidad'],
      facB_rotulo: newState[0]['Rotulo'],
      facB_direccion: newState[0]['Direccion'],
      facB_tipoBTMT: newState[0]['Tipo Empalme'],
      facB_tramo: newState[0]['Tramo'],
      facB_sed: newState[0]['Sed'],
      facB_tipoEmpalme: newState[0]['Empalme'],
      facB_fase: newState[0]['Fase'],
      facB_potencia: newState[0]['Potencia'],
      facB_tiempoEmpalme: newState[0]['Tiempo Empalme'],
      facB_cantidadEmpalme: newState[0]['Cantidad Empalme'],
      facB_potenciaSolicitada: newState[0]['Potencia'],
      facB_potenciaDisponible: newState[0]['PotenciaDispSed'],
      facB_potenciaCalculada: newState[0]['Potencia Calculada'],
      facB_zona: newState[0]['Zona'],
      facB_concesion: newState[0]['Zona Concesion'],
      facB_restringida: newState[0]['Zona Restringida'],
      facB_vialidad: newState[0]['Zona Vialidad'],
      facB_campamento: newState[0]['Zona Campamentos'],
      facB_transmision: newState[0]['Zona Transmision'],
      factB_distanciaDM: newState[0]['DistDireccionMedidor'],
      factB_distanciaRM: newState[0]['DistRotuloMedidor'],
      facB_clasificacion: newState[0]['Clasificacion'],
      facB_tiposFase:  newState[0]['Tipos Fase'],
      facB_puntoConexion:  String(newState[0]['Punto Conexion']),
      selectedRowId: newState[0]['Folio'],
      facB_coci1: newState[0]['Coci1'],
      facB_coci2: newState[0]['Coci2'],
      facB_coci3: newState[0]['Coci3'],
      factB_comuna: newState[0]['Comuna'],
      facB_ubicacionMedidorTerreno: newState[0]['ubicacion_medidor_terreno']
    });
      this.setState({
        cbEstadoValue: newState[0]['Estado Tramite'],
        cbMejoraValue: newState[0]['Tipo Mejora']
      });

      //load states for the selected factibilidad.
      loadFactStates(newState[0]['Folio'], (callback)=>{
        if(!callback.length){
            this.setState({myDataEstados: []});
          return;
        }else{

          let loadDataEstados = callback.map(estado=>{
            //console.log(estado.attributes);
            let thestatus = {
              'ID Factibilidad' : estado.attributes["ID_Factibilidad"],
              'Estado Tramite':  estado.attributes["Estado_tramite"],
              'Fecha Cambio':  estado.attributes["Fecha_cambio"],
              'Usuario': estado.attributes["Usuario"],
              'Observacion':  estado.attributes["Observacion"]
            }
            return thestatus;
          });
          this.setState({myDataEstados: loadDataEstados, obsDisable: false, btnGuardarState: false, btnGuardarState2: false, btnGuardarState3: false});
        }

      });

      //query for getting the SED name and kva.
       //if 0 = 'NO NAME AVAILABLE' and no kva available
       factigis_findSedProperties(newState[0]['Sed'],(sedprops)=>{

         if(!sedprops.length){
           this.setState({facB_sedNombre: "N/A", facB_sedKVA: 'N/A' });
           return;
         }
          this.setState({facB_sedNombre: sedprops[0].attributes['nombre'] , facB_sedKVA:  sedprops[0].attributes['kva']});
       });

      //query for getting propiedad from POSTE
       factigis_findRotuloProperties(newState[0]['Rotulo'], (rotuloprops)=>{
         if(!rotuloprops.length){
           this.setState({facB_rotuloPropiedad: "N/A"});
           return;
         }
          this.setState({facB_rotuloPropiedad: rotuloprops[0].attributes['propiedad']});
           $("#iframeloadingBO1").hide();
       });

       //Buscar si factibilidad seleccionada tiene formulario obras adicionales:
       var cert = factigis_findSGOCert(newState[0]['Folio'])
       .then(sgoCertificate=>{
         console.log(sgoCertificate, "found?");
         if(sgoCertificate.length>0){
           //Si tiene certificado , ver el contenido en la ventana.
           this.setState({facB_formularioObrasAvailable: 'Sí', facB_formularioObrasVer: false});
           //set los valores para mostrar en modal (VER)
           this.setState({
             factiCert_diasPlazo: sgoCertificate[0].attributes.DIAS_PLAZO,
             factiCert_diasVialidad: sgoCertificate[0].attributes.DIAS_VIALIDAD,
             factiCert_diasMunicipales: sgoCertificate[0].attributes.DIAS_MUNICIPALES,
             factiCert_diasTerceros: sgoCertificate[0].attributes.DIAS_TERCEROS,
             factiCert_diasCalculados: sgoCertificate[0].attributes.TOTAL_DIAS_CALCULADO,
             factiCert_costoCompania:sgoCertificate[0].attributes.COSTO_COMPANIA,
             factiCert_detalle1:sgoCertificate[0].attributes.DETALLE1,
             factiCert_detalle2:sgoCertificate[0].attributes.DETALLE2,
             factiCert_detalle3:sgoCertificate[0].attributes.DETALLE3,
             factiCert_observacion:sgoCertificate[0].attributes.OBSERVACION,
             facB_certificadoNumero: sgoCertificate[0].attributes.OBJECTID
           })

         }else{
           //Si no existe certificado, crear uno nuevo.
           this.setState({facB_formularioObrasAvailable: 'No', facB_formularioObrasVer: true})
           //Si hay SED y es tipo BT, generar certificado de cortocircuito para SED y BT
           if(newState[0]['Sed']>0){
             if(newState[0]['Tipo Empalme']=='BT'){
               this.setState({facB_formularioObrasCrear: false})
               //Se crea para BT
               //SE LIMPIAN LOS CAMPOS
               this.setState({
                 factiCert_diasPlazo: 0,
                 factiCert_diasVialidad: 0,
                 factiCert_diasMunicipales: 0,
                 factiCert_diasTerceros: 0,
                 factiCert_diasCalculados: 0,
                 factiCert_costoCompania: 0,
                 factiCert_observacion: ""
               })
             }else{
               //Se crea para MT
                 this.setState({facB_formularioObrasCrear: false})
             }
           }else{
             //Si no hay sed, no se crea formulario de obras ad.
             this.setState({facB_formularioObrasAvailable: 'No', facB_formularioObrasVer: true})
           }


         }
       }).catch(error=>{
         console.log(error,"no cert.");
       })
  }

  componentWillMount(){
    this.setState({
        myData: [createDataObject()],
        myDataEstados: [createDataObject2()],
        fases: tiposFase
    });


  }

  componentDidMount(){
    var user = cookieHandler.get('usrprfl');
    var empresaCapitalized = capitalize(user.EMPRESA.toString());

    /*
    var d = cookieHandler.get('wllExp');
      if(d > getFormatedDate()){

        if(!cookieHandler.get('tkn')){
          console.log("no hay, redirect...");
          window.location.href = "index.html";
        }
      }else{
        console.log("Token Expired");
        window.location.href = "index.html";
      }*/

      var usrprfl = cookieHandler.get('usrprfl');
    //ADD LAYER TO SHOW IN THE MAP
    $("#iframeloadingBO1").show();
      var mapp = mymap.createMap("factigis_bo2_map","topo",-71.2905 ,-33.1009,9);


      //Add layer for old addresses
      var layerDirecciones = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_direccionesDyn(),{id:"factigis_direcciones"});
      layerDirecciones.setImageFormat("png32");
      layerDirecciones.setVisibleLayers([0]);

      mapp.addLayer(layerDirecciones);

      // add layer for new ones
      var layerDireccionesNew = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_direccionesNuevasMobile(),{id:"factigis_direccionesNew", minScale: 11000});
      layerDireccionesNew.setImageFormat("png32");
      layerDireccionesNew.setVisibleLayers([2]);
      mapp.addLayer(layerDireccionesNew);

      // add layer for pipes
      var layerRotulos = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_rotulos(),{id:"factigis_rotulos"});
      layerRotulos.setImageFormat("png32");
      layerRotulos.setVisibleLayers([0]);
      var layerDefs = [];
      layerDefs[0] = "tipo_nodo ='ele!poste' or tipo_nodo='ele!camara'  and nm_empresa='"+ empresaCapitalized+"'";
      layerRotulos.setLayerDefinitions(layerDefs);
      mapp.addLayer(layerRotulos);

      //LOAD FACTIBILIDAD FOR CURRENT USER : RULES: PER HIS/HER ZONE and <> of FACTIBILIDAD DIRECTA


      var toggle = new BasemapToggle({
        map: mapp,
        basemap: "hybrid"
      }, "BMToggle2");
      toggle.startup();

      const page = env.SAVEAPPLICATIONNAME;
      const module = "FACTIGIS_REVISAR_HISTORIAL_FACTIBILIDAD";
      const date = getFormatedDate();

      const myToken = cookieHandler.get('tkn');

      //console.log(user['USUARIO']);
    saveGisredLogin(user['USUARIO'],date,page,module,myToken);



  }

  loadDataa(dateRange){
    this.setState({myDataEstados: []});
    loadCurrentHistoryData(dateRange, (data)=>{
      let loadData = data.map(result=>{

        let theData = {
          'Folio' : result.attributes['OBJECTID'],
          'Estado Tramite': result.attributes['Estado_tramite'],
          'Nombre': result.attributes['Nombre'],
          'Apellido':result.attributes['Apellido'],
          'Tipo Mejora': result.attributes['Tipo_mejora'] ,
          'Zona': result.attributes['Zona'],
          'Origen Factibilidad': result.attributes['Origen_factibilidad'],
          'Geometry': result.geometry,
          'Alimentador' : result.attributes['Alimentador'],
          'Rut' : result.attributes['Rut'],
          'Telefono': result.attributes['Telefono'],
          'Email': result.attributes['Email'],
          'Tipo Cliente': result.attributes['Tipo_cliente'],
          'Tipo Contribuyente': result.attributes['Tipo_contribuyente'],
          'Rotulo': result.attributes['Rotulo'],
          'Tramo': result.attributes['Tramo'],
          'Empalme': result.attributes['Empalme'],
          'Fase': result.attributes['Fase'],
          'Potencia': result.attributes['Potencia'],
          'Capacidad Empalme': result.attributes['Capacidad_empalme'],
          'Capacidad Interruptor': result.attributes['Capacidad_interruptor'],
          'Tiempo Empalme': result.attributes['Tiempo_empalme'],
          'Tipo Empalme': result.attributes['Tipo_empalme'],
          'Cantidad Empalme': result.attributes['Cantidad_empalme'],
          'IDDireccion': result.attributes['ID_Direccion'],
          'Direccion': result.attributes['Direccion'],
          'Zona Campamentos': result.attributes['Zona_campamentos'],
          'Zona Concesion': result.attributes['Zona_concesion'],
          'Zona Restringida': result.attributes['Zona_restringida'],
          'Zona Transmision': result.attributes['Zona_transmision'],
          'Zona Vialidad': result.attributes['Zona_vialidad'],
          'Potencia Calculada': result.attributes['Potencia_calculada'],
          'DistRotuloMedidor': result.attributes['DistRotuloMedidor'],
          'DistDireccionMedidor': result.attributes['DistDireccionMedidor'],
          'Comuna': result.attributes['Comuna'],
          'Idnodo': result.attributes['Idnodo'],
          'Estado Tramite': result.attributes['Estado_tramite'],
          'Tipo Factibilidad': result.attributes['Tipo_factibilidad'],
          'Sed': result.attributes['Sed'],
          'PotenciaDispSed': result.attributes['PotenciaDispSed'],
          'Zona': result.attributes['Zona'],
          'Creador': result.attributes['created_user'],
          'Clasificacion': result.attributes['Clasificacion'],
          'Tipos Fase':  result.attributes['Tipo_fase'],
          'Punto Conexion':  String(result.attributes['Poste_cnx_final']),
          'Coci1': result.attributes['Coci1f'],
          'Coci2': result.attributes['Coci2f'],
          'Coci3': result.attributes['Coci3f'],
          'ubicacion_medidor_terreno': result.attributes['ubicacion_medidor_terreno']

        }

        return theData;
      });
        this.setState({myData: loadData});
          // Agregar defs al mapa segun busqueda de factibilidades:
          var prof = cookieHandler.get('usrprfl');
          var mapa = mymap.getMap();
          if(mapa.getLayer("factigis_factibilidades")){
            //console.log("habilitado veroad");
            mapa.removeLayer(mapa.getLayer("factigis_factibilidades"));
          }
          var layerFactibilidad = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_factibilidad(),{id:"factigis_factibilidades"});
          layerFactibilidad.setImageFormat("png32");
          layerFactibilidad.setVisibleLayers([0]);
          var layerDefs = [];
          layerDefs[0] = "Estado_tramite = 'CERRADA' AND Empresa='"+ prof.EMPRESA + "' " + dateRange;
          layerFactibilidad.setLayerDefinitions(layerDefs);
          console.log(layerDefs,"defs");
          /*layerFactibilidad.setInfoTemplates({
            0: {infoTemplate: myinfotemplate.getAlimentadorInfoWindow()}
          });
          */
          mapa.addLayer(layerFactibilidad);

        $("#iframeloadingBO1").hide();
    });
  }

  onChange(e){this.setState({cbEstadoValue: e});}

  onChange2(e){this.setState({cbMejoraValue: e});}

  onChangeObs(e){
    this.setState({facb_observaciones: e.currentTarget.value });

    if(e.currentTarget.value==""){
      this.setState({btnGuardarState: true});
    }else{
        this.setState({btnGuardarState: false});
    }
  }

  openModal () { this.setState({open: true}); }
  openFiltro() { this.setState({openFiltro: true}); }
  closeModal () { this.setState({open: false}); }
  closeModalFiltro() { this.setState({openFiltro: false}); }

  onLoggOff(){
      cookieHandler.remove('myLetter');
      cookieHandler.remove('usrprfl');
      cookieHandler.remove('usrprmssns');
      cookieHandler.remove('wllExp');
      localStorage.removeItem('token');
      window.location.href = "index.html";
  }
  //04/01/2017
  onClickGuardarObservacion(){
    console.log(this.state.facB_folio);

    agregarObservacionHistorial(this.state.facB_folio, this.state.facb_observaciones, (callback)=>{
      if(!callback){
        console.log("Problemas agregando observacion");

        return;
      }
      //load states for the selected factibilidad.
      loadFactStates(this.state.facB_folio, (callback)=>{
        if(!callback.length){
            this.setState({myDataEstados: []});
          return;
        }else{

          let loadDataEstados = callback.map(estado=>{
            //console.log(estado.attributes);
            let thestatus = {
              'ID Factibilidad' : estado.attributes["ID_Factibilidad"],
              'Estado Tramite':  estado.attributes["Estado_tramite"],
              'Fecha Cambio':  estado.attributes["Fecha_cambio"],
              'Usuario': estado.attributes["Usuario"],
              'Observacion':  estado.attributes["Observacion"]
            }
            return thestatus;
          });
          this.setState({myDataEstados: loadDataEstados, obsDisable: false});
        }
          this.setState({
            open: true,
            modalStatus: 'Observación agregada para folio ' + this.state.facB_folio,
            facb_observaciones: ''
          });
          $('.fact_bo_poste').css('color',"black").css('border-color','black');
        });


    });
  }

  onChangeFase(e){
    console.log(e);
    this.setState({faseSelected: e});
  }

  onClickPuntoConexion(){
    var map = mymap.getMap();
    console.log("toggleposte", this.state.togglePoste)
    if (this.state.togglePoste =='OFF'){
      this.setState({togglePoste: 'ON'});
        $('.fact_bo_poste').css('color',"crimson").css('border-color','red');

        var map_click_handle = dojo.connect(map, 'onClick', (g)=>{
          console.log(g);
        $("#iframeloadingBO1").show();
          factigis_findRotulo(g.mapPoint, (featureSetFeatures)=>{

            //extrae datos de rotulo
            let rotulo = featureSetFeatures[0].attributes['rotulo'];
            this.setState({
              rotuloFinal: rotulo
            });
            $("#iframeloadingBO1").hide();
          });

        });
        this.setState({btnPoste: map_click_handle});
    }else{
      this.setState({togglePoste: 'OFF'});
        $('.fact_bo_poste').css('color',"black").css('border-color','black');
        dojo.disconnect(this.state.btnPoste);

    }
  }

  onClickGuardarAtributos(){
    if( (this.state.facB_folio=='') || (this.state.faseSelected=='') || (this.state.rotuloFinal=='') ){
      this.setState({open: true, modalStatus: 'Por favor seleccione el punto de conexión y/o tipo de fase de conexión antes de modificar.'});
      return;
    }

    let myDataUpdate = {
      "OBJECTID": this.state.facB_folio,
      "Poste_cnx_final": this.state.rotuloFinal,
      "Tipo_fase": this.state.faseSelected
    }
    updateAttributesPerFolio(myDataUpdate, (cb)=>{
      if(!cb){
        this.setState({
          open: true,
          modalStatus: 'No se pudo guardar los cambios, intente nuevamente.'

        });
        return;
      }
      this.setState({
        open: true,
        modalStatus: 'Cambios en Folio ' + this.state.facB_folio +  ' han sido guardados'
      });
      $('.fact_bo_poste').css('color',"black").css('border-color','black');
      this.clearFieldsAttr();
      //LOAD FACTIBILIDAD FOR CURRENT USER : RULES: PER HIS/HER ZONE and <> of FACTIBILIDAD DIRECTA
      const {selectedDayStart, selectedDayEnd} = this.state;
      console.log(selectedDayStart, selectedDayEnd);
      //asumir mismo día
      if(selectedDayStart == selectedDayEnd){
        this.loadDataa("AND created_date >= '"+ selectedDayStart + " 00:00:00' AND created_date <= '" + selectedDayEnd +" 23:59:59'")
      }else{
        this.loadDataa("AND created_date >= '"+ selectedDayStart +" 00:00:00' AND created_date <='" + selectedDayEnd + " 23:59:59'");
      }

    });

  }

  clearFieldsAttr(){
    this.setState({
      facB_tiposFase: this.state.faseSelected,
      facB_puntoConexion: this.state.rotuloFinal,
      faseSelected: '',
      rotuloFinal: '',
      factB_comuna: '',
      facB_ubicacionMedidorTerreno: ''

    });
  }

  onClickDashboard(e){
    if(e==""){
        return;
    }
      window.location.href = e;
  }

  handleDayChangeStart(day) {

    this.setState({ selectedDayStart: formatDates(day) });
  }

  handleDayChangeEnd(day) {

    this.setState({ selectedDayEnd: formatDates(day) });
  }

  FiltrarFactibilidades(){
    const {selectedDayStart, selectedDayEnd} = this.state;

    if((typeof selectedDayStart=='undefined') || (typeof selectedDayEnd=='undefined')|| (selectedDayStart == "NaN/NaN/NaN") || (selectedDayEnd == "NaN/NaN/NaN")) {
      console.log("all");
      this.setState({modalStatusFiltro: "Debe elegir una fecha inicial y final para buscar factibilidades."})
      this.openFiltro();
      return;
    }

    //asumir mismo día
    if(selectedDayStart == selectedDayEnd){
      this.loadDataa("AND created_date >= '"+ selectedDayStart + " 00:00:00' AND created_date <= '" + selectedDayEnd +" 23:59:59'")
    }else{
      this.loadDataa("AND created_date >= '"+ selectedDayStart +" 00:00:00' AND created_date <='" + selectedDayEnd + " 23:59:59'");
    }
  }

  onClickOpenFormulario(e){
    console.log(e,"form");

    if(e=='ver'){
      this.setState({openFormularioVer: true});
    }
  }

  closeModalFormulario(e) {
    if (e=='ver') {
        this.setState({openFormularioVer: false});
    }
  }


    onChangeCert(e){
      var totalCalculado = 0;
      var valorFormateado = 0;

      console.log(e.currentTarget.value, e.currentTarget.id, "1");
      switch (e.currentTarget.id) {
        case 'diasPlazo':
          this.setState({
            factiCert_diasPlazo: e.currentTarget.value,
          });
          totalCalculado = parseInt(this.state.factiCert_diasVialidad) +
          parseInt(this.state.factiCert_diasMunicipales) +
          parseInt(this.state.factiCert_diasTerceros) +
          parseInt(e.currentTarget.value);
          this.setState({factiCert_diasCalculados: totalCalculado})
        break;

        case "diasVialidad":
          this.setState({factiCert_diasVialidad: e.currentTarget.value})
          totalCalculado = parseInt(this.state.factiCert_diasPlazo) +
          parseInt(this.state.factiCert_diasMunicipales) +
          parseInt(this.state.factiCert_diasTerceros) +
          parseInt(e.currentTarget.value);
          this.setState({factiCert_diasCalculados: totalCalculado})
        break;

        case "diasMunicipales":
          this.setState({factiCert_diasMunicipales: e.currentTarget.value})
          totalCalculado = parseInt(this.state.factiCert_diasPlazo) +
          parseInt(this.state.factiCert_diasVialidad) +
          parseInt(this.state.factiCert_diasTerceros) +
          parseInt(e.currentTarget.value);
          this.setState({factiCert_diasCalculados: totalCalculado})
        break;

        case "diasTerceros":
          this.setState({factiCert_diasTerceros: e.currentTarget.value})
          totalCalculado = parseInt(this.state.factiCert_diasPlazo) +
          parseInt(this.state.factiCert_diasVialidad) +
          parseInt(this.state.factiCert_diasMunicipales) +
          parseInt(e.currentTarget.value);
          this.setState({factiCert_diasCalculados: totalCalculado})
        break;

        case "diasCalculados":
        break;

        case "costoCompania":

          this.setState({factiCert_costoCompania: e.currentTarget.value})
        break;

        case "observacion":
          this.setState({factiCert_observacion: e.currentTarget.value})
        break;

        default:

      }
    }
  render(){
    if(!cookieHandler.get('usrprmssns') || (!cookieHandler.get('usrprfl'))){
      window.location.href = "index.html";
      return;
    }

    let prof = cookieHandler.get('usrprfl');

    let name = prof.NOMBRE_COMPLETO.split(" ");

    let permissions = cookieHandler.get('usrprmssns');

    var p = _.filter(permissions, function(o) {
      return o.module=='REVISAR_HISTORIAL_FACTIBILIDAD';
    });
    if(!p.length){
      window.location.href = "index.html";
      return;
    }

    let src = env.CSSDIRECTORY+'images/logo_factigis.png';
    return (
      <div className="wrapper_factigis_bo2">
        <Panel>
          <AppBar>
            <div className="wrapperTop">
              <div className="logo_content">
                <img className="img_logo" src={src} ></img>
                <div className="breadcrumbs_custom">
                  <Button className="btn_dashboard" icon='home' label='Inicio' accent onClick={this.onClickDashboard.bind(this,"index.html")}  />
                  <Button className="btn_dashboard" icon='explore' label='Dashboard' accent onClick={this.onClickDashboard.bind(this,"factigisDashboard.html")}  />
                  <Button className="btn_dashboard" icon='lock' label={'Revisión Historial Factibilidades'} accent onClick={this.onClickDashboard.bind(this,"")}/>
                </div>
              </div>
              <div className="welcome_logout_wrapper">
                <h6>Bienvenido:  {name[0]} / Empresa: {prof.EMPRESA}</h6>
                <IconButton icon='settings_power' inverse={ true } onClick={this.onLoggOff.bind(this)}/>
              </div>
            </div>
          </AppBar>
        </Panel>
        {/*Agregado panel de filtro de busqueda*/}
        <div className="bo2_table">
          <div>
            <h1 className="factigisBO2_h1">Filtro de Búsqueda: <b className="factigis_bo2-b"></b></h1>
          </div>
          <div className="factigisBO2_filtro_wrapper">
            <h4 className="h4_filter_titles">Desde: </h4>
            <DayPickerInput
              onDayChange = {this.handleDayChangeStart.bind(this)}
              formatDate={formatDate}
              parseDate={parseDate}
              format="L"
              placeholder={`${formatDate(new Date(), 'LL', 'es')}`}
                     dayPickerProps={{
                       locale: 'es',
                       localeUtils: MomentLocaleUtils,
                     }}
            />
            <h4 className="h4_filter_titles padding_left_elm">Hasta: </h4>
            <DayPickerInput
                id="dpEnd"
               onDayChange = {this.handleDayChangeEnd.bind(this)}
               formatDate={formatDate}
               parseDate={parseDate}
               format="L"
               placeholder={`${formatDate(new Date(), 'LL', 'es')}`}
                      dayPickerProps={{
                        locale: 'es',
                        localeUtils: MomentLocaleUtils,
                      }}

            />
              <button className="factigis_submitButton btn btn-info margin_left_elm" onClick={this.FiltrarFactibilidades.bind(this)}>Filtrar Búsqueda</button>
          </div>


        </div>

        <div className="bo2_table">
          <FG_GridPerZoneH2 title={"Factibilidades"} data={this.state.myData}  callbackParent={this.onChildChanged.bind(this)}/>
          <div>
            <h1 className="factigisBO2_h1">Historial de Estados: <b className="factigis_bo2-b"></b></h1>
          </div>
          <FG_GridPerZoneH title={"Factibildades Estados"} data={this.state.myDataEstados} />
        </div>
        <div className="wrapper_mid">
          <div className="wrapper_mid-left">


            <div>
              <h1 className="factigisBO2_h1">Datos Factibilidad > Folio: <b className="factigis_bo2-b">{this.state.facB_folio}</b></h1>
            </div>
            <div className="wrapper_mid-split">
              <div className="wrapper_mid-split-1">
                <h6 className="factigis_bo2-h6"><b>Datos de Cliente</b></h6>
                <h8 className="">Rut: {this.state.facB_rut}</h8>
                <h8 className="">Nombre Cliente: {this.state.facB_nombre}  </h8>
                <h8 className="">Apellido: {this.state.facB_apellido}</h8>
                <h8 className="">Dirección: {this.state.facB_direccion}</h8>
                <h8 className="">Telefono: {this.state.facB_telefono}</h8>
                <h8 className="">Email: {this.state.facB_email}</h8>
                <h8 className="">Tipo Cliente: {this.state.facB_tipoCliente}</h8>
                <h8 className="">Tipo Contribuyente: {this.state.facB_tipoContribuyente}</h8>
                <h6 className="factigis_bo2-h6"><b>Factibilidad: </b></h6>
                <h8 className="">Tipo Factibilidad: {this.state.facB_tipoFactibilidad}</h8>
                <h8 className="">Tipo Mejora: {this.state.facB_tipoMejora}</h8>
                <h8 className="">Estado Tramite: {this.state.facB_estadoTramite}</h8>
                <h8 className="">Origen Factibilidad: {this.state.facB_origenFactibilidad}</h8>
                <h6 className="factigis_bo1-h6"><b>Extras: </b></h6>
                <h8 className="">Clasificación: {this.state.facB_clasificacion}</h8>
                <h8 className="">Fases Conexión: {this.state.facB_tiposFase}</h8>
                <h8 className="">Punto Conexión: {this.state.facB_puntoConexion}</h8>
                <h6 className="factigis_bo1-h6"><b>Niveles Cortocircuito: </b></h6>
                <h8 className="">Coci1: {this.state.facB_coci1}</h8>
                <h8 className="">Coci2: {this.state.facB_coci2}</h8>
                <h8 className="">Coci3: {this.state.facB_coci3}</h8>
              </div>
                <div className="wrapper_mid-split-1">
                <h6 className="factigis_bo2-h6"><b>Datos de Red</b></h6>
                <h8 className="">Rótulo: {this.state.facB_rotulo}</h8>
                <h8 className="">Propiedad: {this.state.facB_rotuloPropiedad}</h8>
                <h8 className="">Tipo: {this.state.facB_tipoBTMT}</h8>
                <h8 className="">Tramo Conexion: {this.state.facB_tramo}</h8>
                <h8 className="">SED: {this.state.facB_sed}</h8>
                <h8 className="">SED Nombre: {this.state.facB_sedNombre}</h8>
                <h8 className="">SED KVA (Potencia Nominal): {this.state.facB_sedKVA}</h8>
                <h8 className="">Tipo (Empalme): {this.state.facB_tipoEmpalme}</h8>
                <h8 className="">Fase: {this.state.facB_fase}</h8>
                <h8 className="">Potencia:{this.state.facB_potencia}</h8>
                <h8 className="">Empalme (Prov-Defi): {this.state.facB_tiempoEmpalme}</h8>
                <h8 className="">Cantidad: {this.state.facB_cantidadEmpalme}</h8>
                <h8 className="">Potencia Solicitada: {this.state.facB_potenciaSolicitada}</h8>
                <h8 className="">Potencia Disponible: {this.state.facB_potenciaDisponible}</h8>
                <h8 className="">Potencia Calculada: {this.state.facB_potenciaCalculada}</h8>
                <h8 className="">Zona: {this.state.facB_zona}</h8>
                <h8 className="">Distancia Rotulo - Medidor (m): {this.state.factB_distanciaRM}</h8>
                <h8 className="">Distancia Dirección - Medidor (m): {this.state.factB_distanciaDM}</h8>
                <h8 className="">Comuna: {this.state.factB_comuna}</h8>

                <h6 className="factigis_bo1-h6"><b>¿Medidor en Terreno?  {this.state.facB_ubicacionMedidorTerreno} </b></h6>


                <h6 className="factigis_bo1-h6"><b>Formulario de Obras Adicionales</b></h6>
                <h8 className="">¿Disponible?: {this.state.facB_formularioObrasAvailable}</h8>

                <div className="factigisCert_wrapperButtons">
                  <button onClick={this.onClickOpenFormulario.bind(this, "ver")} disabled={this.state.facB_formularioObrasVer} className="factigis_bo_btnFormulario factiCert_btn btn btn-info" title="Selección de Rótulo " type="button" >
                    <span><i className="fa fa-eye"></i>Ver</span>
                  </button>

                </div>

              </div>
            </div>
            <div className="wrapper_mid_splitbot">
              <div>
                <h1 className="factigisBO2_h1">Zonas Factibilidad</h1>
              </div>
              <div className="factigis_bo2_wrapper-zonas">
                <div><h8 className="factigis_bo2_zonas">Concesión: <b>{this.state.facB_concesion}</b></h8></div>
                <div><h8 className="factigis_bo2_zonas">Restringida: <b>{this.state.facB_restringida}</b></h8></div>
                <div><h8 className="factigis_bo2_zonas">Vialidad: <b>{this.state.facB_vialidad}</b></h8></div>
                <div><h8 className="factigis_bo2_zonas">Campamentos: <b>{this.state.facB_campamento}</b></h8></div>
                <div><h8 className="factigis_bo2_zonas">Transmisión: <b>{this.state.facB_transmision}</b></h8></div>
              </div>
            </div>
          </div>
          <div className="factigisBO2_wrapper_mid-right">
            <div><h1 className="factigisBO2_h1">Mapa - Ubicación</h1></div>
            <LayerList show={["check_factigis_transmision", "check_factigis_distribucion", "check_factigis_vialidad", "check_campamentos", "check_chqbasemap",
            "check_subestaciones","check_MT","check_BT"]} />
            <div id="factigis_bo2_map" className="factigis_bo2_map">
              <div id="BMToggle2"></div>
            </div>
            <div>
              <h1 className="factigisBO2_h1 factigis_h1_edited">Cambiar Atributos > Folio: {this.state.facB_folio}</h1>
              <div className="factigis_rows">
                <div className="factigis_row1">
                  <div><h8 className="factigis_bo1-h6">Punto Conexión: <b></b></h8></div>
                  <div>
                    <input id="factigis_txtRotulo" disabled={true} className="factigis_bo_txt" type="text" placeholder="Seleccione rótulo" value={this.state.rotuloFinal}  />
                    <button disabled={this.state.btnGuardarState2} onClick={this.onClickPuntoConexion.bind(this)} className="fact_bo_poste btn btn-default" title="Selección de Rótulo " type="button">
                      <span><i className="fa fa-map-signs"></i></span>
                    </button>
                  </div>
                </div>
                <div className="factigis_row2">
                  <div><h8>Fases de Conexión:</h8></div>
                  <div><Select className="ddlTipoCliente factigis_tipoCliente" name="form-field-name" options={this.state.fases} value={this.state.faseSelected} onChange={this.onChangeFase.bind(this)}
                    simpleValue clearable={true} searchable={false} placeholder="Seleccione las fases de conexión"/>
                  </div>
                </div>
                <div className="factigis_row3_2">
                  <button  disabled={this.state.btnGuardarState3} className="factigis_bo_btnModified btn btn-info" title="Selección de Rótulo " type="button" onClick={this.onClickGuardarAtributos.bind(this)} >
                    <span><i className="fa fa-floppy-o"></i> Guardar</span>
                  </button>
                </div>


              </div>
            </div>
          </div>
        </div>

        <div className="factigisBO2_wrapper_bot">
          <div className="wrapper_bot_title">
            <h1 className="factigis_bo1-h1 factigis_h1_edited">Agregar Observación > Folio: {this.state.facB_folio}</h1>
          </div>
          <div className="wrapper_bot_content">
            <h8 className="factigis_bo2-h8">Observaciones:</h8>

            <input onChange={this.onChangeObs.bind(this)} maxLength="100" id="factigis_txtObservacion" disabled={this.state.obsDisable} className="factigis_bo_txt" type="text" placeholder="Escriba observacion" value={this.state.facb_observaciones}  />
            <button onClick={this.onClickGuardarObservacion.bind(this)} disabled={this.state.btnGuardarState} className="factigis_bo_btnModified btn btn-info" title="Guardar observación " type="button" >
              <span><i className="fa fa-floppy-o"></i> Guardar Observación</span>
            </button>
            </div>

        </div>


        <Modal isOpen={this.state.open} style={customStyles}>
          <h2 className="factigis_h2">Revisión Factibilidades</h2>
          <p>{this.state.modalStatus}</p>
          <br />
          <button className="factigis_submitButton btn btn-info" onClick={this.closeModal.bind(this)}>Close</button>
        </Modal>

        <Modal isOpen={this.state.openFiltro} style={customStyles}>
          <h2 className="factigis_h2">Filtro Búsquedas</h2>
          <p>{this.state.modalStatusFiltro}</p>
          <br />
          <button className="factigis_submitButton btn btn-info" onClick={this.closeModalFiltro.bind(this)}>Close</button>
        </Modal>

        {/*Form Ver Cert.*/}
        <Modal isOpen={this.state.openFormularioVer} style={customStylesFormulario}>
          <h2 className="factigis_h2">(VER) Formulario Obras Adicionales</h2>

          <h5 className="factigis_bo1_zonas">ID Factibilidad: <b>{this.state.facB_folio}</b></h5>
          <h5 className="factigis_bo1_zonas">Certificado N°: <b>{this.state.facB_certificadoNumero}</b></h5>
          <br />
          <div className="factiCert_wrapper">

            <div className="factiCert_left">
              <h8 className="factiCert_h8">Plazo Ejecución Obras Adicionales (días):</h8>
              <h8 className="factiCert_h8">Plazo Trámites Vialidad (días):</h8>
              <h8 className="factiCert_h8">Plazo Permisos Municipales (días):</h8>
              <h8 className="factiCert_h8">Plazo Autorización Terceros (días):</h8>
              <h8 className="factiCert_h8">Plazo Total (días):</h8>
              <h8 className="factiCert_h8">Costo Compañía ($):</h8>
              <h8 className="factiCert_h8">Detalle 1:</h8>
              <h8 className="factiCert_h8">Detalle 2:</h8>
              <h8 className="factiCert_h8">Detalle 3:</h8>
              <h8 className="factiCert_h8">Observación:</h8>
            </div>

            <div className="factiCert_right">
              <input id="diasPlazo" className="input_cert" type="number" min="0" placeholder="Seleccione Días" value={this.state.factiCert_diasPlazo}  title="Días Plazo" disabled={true}/>
              <input id="diasVialidad" className="input_cert" type="number" min="0" placeholder="Seleccione Días" value={this.state.factiCert_diasVialidad}  onChange={this.onChangeCert.bind(this)} title="Días Vialidad"  disabled={true} />
              <input id="diasMunicipales" className="input_cert" type="number" min="0" placeholder="Seleccione Días" value={this.state.factiCert_diasMunicipales}  onChange={this.onChangeCert.bind(this)} title="Días Municipales"  disabled={true} />
              <input id="diasTerceros" className="input_cert" type="number" min="0" placeholder="Seleccione Días" value={this.state.factiCert_diasTerceros}  onChange={this.onChangeCert.bind(this)} title="Días Terceros"  disabled={true} />
              <input id="diasCalculados" className="input_cert" type="number" min="0" placeholder="Seleccione Días" value={this.state.factiCert_diasCalculados}  onChange={this.onChangeCert.bind(this)} title="Días Calculados"  disabled={true}/>
              <input id="costoCompania" step="any" className="input_cert" type="number" min="0" placeholder="Ingrese Costo" value={this.state.factiCert_costoCompania}  onChange={this.onChangeCert.bind(this)} title="Costo Compañia"  disabled={true}/>
              <input id="txtDetalle1" className="input_cert" type="text"  placeholder="" value={this.state.factiCert_detalle1}  onChange={this.onChangeCert.bind(this)} title="Detalle 1"  disabled={true}/>
              <input id="txtDetalle2" className="input_cert" type="text"  placeholder="" value={this.state.factiCert_detalle2}  onChange={this.onChangeCert.bind(this)} title="Detalle 2"  disabled={true}/>
              <input id="txtDetalle3" className="input_cert" type="text"  placeholder="" value={this.state.factiCert_detalle3}  onChange={this.onChangeCert.bind(this)} title="Detalle 3"  disabled={true}/>
              <input id="observacion" className="input_cert" type="text" placeholder="" value={this.state.factiCert_observacion}  onChange={this.onChangeCert.bind(this)} title="Observación"  disabled={true}/>
            </div>

          </div>
          <div className="factiCert_admButtons_wrapper">
              <button className="factigis_submitButton btn btn-info" onClick={this.closeModalFormulario.bind(this,'ver')}>Close</button>
          </div>
          <br />

        </Modal>
      </div>
    );
  }
}

export default FactigisBackOfficeH;
