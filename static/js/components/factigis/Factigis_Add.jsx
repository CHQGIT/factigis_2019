
import React from 'react';
import ReactTabs from 'react-tabs';
import Select from 'react-select';
import {tipoCliente, tipoContribuyente, tipoEmpalme, tipoAereo, tipoSubterraneo, tipoMonoTri, tipoEmpalmeBTMT, tipoCantidadEmpalmes, tipoClasificacion} from '../../services/factigis_services/cbData-service';
import {factigis_validator} from '../../services/factigis_services/factigis_validator-service';
import makeSymbol from '../../utils/makeSymbol';
import {setLayers} from '../../services/layers-service';
import {factigis_findDireccion, factigis_findComuna, factigis_findRotulo, factigis_findNewDireccion, factigis_findTramo} from '../../services/factigis_services/factigis_find-service';
import Factigis_AddDireccion from '../factigis/Factigis_AddDireccion.jsx';
import toggleOff from '../../services/factigis_services/factigis_toggleBtnFx-service';
import validator from 'validator';
import {customerValidator} from '../../services/factigis_services/factigis_customerValidator';
import {getPotenciaEmpalme} from '../../services/factigis_services/factigis_potenciaEmpalmes';
import {factigis_addNuevaFactibilidad, factigis_addNuevaFactibilidad_especial} from '../../services/factigis_services/factigis_add-service';
import Modal from 'react-modal';
import Factigis_BusquedaFolio from '../factigis/Factigis_BusquedaFolio.jsx';
import Factigis_BusquedaPoste from '../factigis/Factigis_BusquedaPoste.jsx';
import Factigis_BusquedaRut from '../factigis/Factigis_BusquedaRut.jsx';
import {getZona} from '../../services/factigis_services/factigis_zonas';
import cookieHandler from 'cookie-handler';
import _ from 'lodash';
import Rut from 'rutjs';
//21 02 2017: añaddiendo progress bar
import ProgressBar from 'react-toolbox/lib/progress_bar';
import env from '../../services/factigis_services/config';


var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var visibilityStyle = {
  selectPotencia: {
    visibility: 'hidden',
    display: 'none'
  },
  txtPotencia:{
      visibility: 'hidden',
      display: 'none'
  }
};

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

class Factigis_Add extends React.Component {
  constructor(props){
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.onClickCliente = this.onClickCliente.bind(this);
    this.onClickDireccion = this.onClickDireccion.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.state = {
      factCartaComuna: '',
      numeroFactibilidad: '',
      //visibility for tabs due permission restrictions
      showA: false,
      showB: false,
      showC: false,
      showD: true,
      showE: true,
      visibilityStyle : visibilityStyle,

      open: false,
      btnModalCloseStatus: true,
      btnModalValidator: false,
      openModalValidator: false,
      problemsforAdding: '',
      problemsforAdding2: '',

      //selected tab in the beginning
      selectedTab: 0,
      //check states per validation zones
      zonaConcesion: false,
      zonaCampamentos: false,
      zonaRestringida: false,
      zonaVialidad: false,
      zonaTransmision: false,

      //save geometries selected
      factigis_geoCliente: '',
      factigis_geoPoste: '',
      factigis_geoDireccion: '',

      //save state for togglebuttons
      toggleCliente: 'OFF',
      togglePoste: 'OFF',
      toggleDireccion: 'OFF',
      toggleTramo: 'OFF',

      //disable - enable button event-handlers
      btnCliente: '',
      btnPoste: '',
      btnDireccion: '',
      btnTramo: '',

      // state values for textboxes
      factigisRut: '',
      factigisNombre: '',
      factigisApellido: '',
      factigisTelefono: '',
      factigisEmail: '',
      factigisRotulo: '',
      factigisTramo: '',
      factigisDireccion: '',  //per full name
      factigisIDDireccion: '', //per id dir
      factigisTipoEmpalme:'',
      factigisConexion: '',
      factigisIDNodo: '',
      factigisComuna: '',
      //27.10
      factigisClasificacion:  '',
      //30/11
      factigisPropiedadPoste: '',
      //data for comboboxes
      factigis_tipoCliente: [],
      factigis_tipoContribuyente: [] ,
      factigis_tipoEmpalme: [],
      factigis_tipoFase: [],
      factigis_tipoPotencia: [],
      factigis_cantidadEmpalmes : [],
      factigis_tipoEmpalmeBTMT: [],
      //27/10
      factigis_todasLasClasificaciones : [],

      //27/10
      factigis_todasLasClasificaciones : [],


      factigis_sed: '',
      factigis_cantEmpalmesEnabled: false,
      factiTipoFactibilidad: 'FACTIBILIDAD DIRECTA',

      //Radios empalmes
      radioEmpalmeDefinitivo: true,
      radioEmpalmeProvisorio: false,

      //selected values for comboboxes
      factigis_selectedValueCliente: '',
      factigis_selectedValueTipoContribuyente: '',
      factigis_selectedValueTipoEmpalme: '',
      factigis_selectedValueTipoEmpalmePotencia: '',
      factigis_selectedValueTipoEmpalmeBTMT: '',


      //validators:
      factigisRutValidator: false,
      factigisNombreValidator: false,
      factigisApellidoValidator: false,
      factigisTelefonoValidator: false,
      factigisEmailValidator: false,
      factigisRotuloValidator: false,
      factigisTramoValidator: false,
      factigisDireccionValidator: false,  //per full name
      factigisIDDireccionValidator: false, //per id dir
      factigisCantidadEmpalmesValidator: false,
      factigisPotenciaValidator: false,
      factigistxtPotenciaValidator: false,
      //27.10
      factigisClasificacionValidator: false,

      //27.10
      factigisClasificacionValidator: false,

      //validators for ddls
      factigisTipoClienteValidator: false,
      factigisTipoContribuyenteValidator: false,
      factigisTipoEmpalmeValidator:false,
      factigisTipoFaseValidator: false,
      factigisTipoBTMTValidator: false,

      //validators for geometries
      factigis_geoClienteValidator: false,
      factigis_geoPosteValidator: false,
      factigis_geoDireccionValidator: false,


      factigis_lineaCP: '',
      factigis_lineaCD: '',

      //disable toggles btn less select cliente
      btnDireccionDisabled: true,
      btnPosteDisabled: true,
      btnTramoDisabled: true,
      factigis_selectedValueTipoPotencia: 0,

      //2.1.2018: agregando multimempresa
      factigis_empresa: '',

      //17.7.2018: se agrega nivales de coci1, 2 y 3
      factigis_coci1: '',
      factigis_coci2: '',
      factigis_coci3: ''

    }
  }

  componentWillMount(){
    this.setState({
      factigis_tipoCliente: tipoCliente,
      factigis_tipoContribuyente:tipoContribuyente,
      factigis_tipoEmpalme: tipoEmpalme,
      factigis_tipoFase: tipoMonoTri,
      factigis_tipoPotencia: [],
      factigis_cantidadEmpalmes: tipoCantidadEmpalmes,
      factigis_tipoEmpalmeBTMT: tipoEmpalmeBTMT,
      radioEmpalmeDefinitivo: true,
      radioEmpalmeProvisorio: false,
      factigis_todasLasClasificaciones: tipoClasificacion,
      factigisClasificacion: 'NUEVO'

    });
  }

  componentDidMount(){
   
    /*
    var d = cookieHandler.get('wllExp');
      if(d > getFormatedDate()){
      //  console.log("dentro del rango");
        if(!cookieHandler.get('tkn')){
          console.log("no hay, redirect...");
          window.location.href = "index.html";
        }
      }else{
        console.log("Token expired");
        window.location.href = "index.html";
      }
      */
    //show widgets for each user permission available
    ////console.log(this.props.permissions);
    let showA = this.props.permissions.filter(p=>{
      return p=='CREAR_FACTIBILIDAD';
    });
    let showB = this.props.permissions.filter(p=>{
      return p=='BUSCAR_FOLIO';
    });
    let showC = this.props.permissions.filter(p=>{
      return p=='CREAR_DIRECCION';
    });
    if(showA.length){
        this.setState({showA: true});
    }
    if(showB.length){
        this.setState({showB: true});
    }
    if(showC.length){
        this.setState({showC: true});
    }

    /*
    var x = cookieHandler.get('usrprmssns').map(p=>{
      return p.empresa;
    });

    /*
    let unique = [...new Set(x)];
    console.log(unique);
    this.setState({factigis_empresa: unique});
    */
    var emp = cookieHandler.get('usrprfl');
    this.setState({factigis_empresa: emp.EMPRESA})
  }

  handleSelect(index, last){
    this.setState({
      selectedTab: index,
    });
  }

  onKeyTelefono(e){
    const re = /[0-9]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  onChange(e){

    switch (e.currentTarget.id) {
      case 'factigis_txtRut':
        this.setState({factigisRut: e.currentTarget.value});
      break;
      case 'factigis_txtNombre':
        this.setState({factigisNombre: e.currentTarget.value});
      break;
      case 'factigis_txtApellido':
        this.setState({factigisApellido: e.currentTarget.value});
      break;
      case 'factigis_txtTelefono':
        this.setState({factigisTelefono: e.currentTarget.value});
      break;
      case 'factigis_txtEmail':
        this.setState({factigisEmail: e.currentTarget.value});
      break;
      case 'factigis_txtCantEmpalmes':
        this.setState({factigisCantidadEmpalmes: e.currentTarget.value});
      break;
      case 'factigis_txtTramo':
        this.setState({factigisTramo: e.currentTarget.value});
      break;
      case 'factigis_checkEmpalmeDefinitivo':
      this.setState({radioEmpalmeDefinitivo: true, radioEmpalmeProvisorio:false});
      break;
      case 'factigis_checkEmpalmeProvisorio':
      this.setState({radioEmpalmeProvisorio: true, radioEmpalmeDefinitivo:false});
      break;
      case 'factigis_txtPotencia':
      this.setState({factigis_selectedValueTipoPotencia: e.currentTarget.value});
      break;

      default:
    }
  }

  //for validations
  onBlur(e){

    switch (e.currentTarget.id) {
      case 'factigis_txtRut':
        var rut = new Rut(this.state.factigisRut);
        if (rut.isValid){
          //////console.log("rut valido", rut.getNiceRut(false));
          this.setState({
            factigisRut: rut.getNiceRut(false),
            factigisRutValidator: true
          });
          //here put the color green to the field for validation ok
        }else{
          //////console.log("rut invalido");
          this.setState({factigisRutValidator: false});
          //here put the color red to the field for wrong validation.
        }

      break;

      case 'factigis_txtNombre':
        if(!this.state.factigisNombre==''){
          //////console.log("si factigisNombre",this.state.factigisNombre.toUpperCase());
          this.setState({
            factigisNombre:this.state.factigisNombre.toUpperCase(),
            factigisNombreValidator: true
          });
        }else{
          //////console.log("no factigisNombre",this.state.factigisNombre);
          this.setState({factigisNombreValidator: false});
        }
      break;

      case 'factigis_txtApellido':
        if(!this.state.factigisApellido==''){
          //////console.log("si factigisApellido",this.state.factigisApellido.toUpperCase());
          this.setState({
            factigisApellido:this.state.factigisApellido.toUpperCase(),
            factigisApellidoValidator: true});
        }else{
          //////console.log("no factigisApellido",this.state.factigisApellido.toUpperCase());
          this.setState({factigisApellidoValidator: false});
        }
      break;

      case 'factigis_txtTelefono':
        if(!this.state.factigisTelefono==''){
          let telefono = "+56" + this.state.factigisTelefono
            if(telefono.length==12){
                //console.log("si factigisTelefono", telefono, telefono.length);
                  this.setState({factigisTelefonoValidator: true});
            }else{
                this.setState({factigisTelefonoValidator: false});
                  //console.log("no factigisTelefono", telefono, telefono.length);
            }
        }else{
          //////console.log("no factigisTelefono",this.state.factigisTelefono);
          this.setState({factigisTelefonoValidator: false});
        }
      break;

      case 'factigis_txtEmail':
        if(!this.state.factigisEmail==''){
          if(validator.isEmail(this.state.factigisEmail.toUpperCase())){
            //////console.log("email valido:",this.state.factigisEmail.toUpperCase());

            if(this.state.factigisEmail.includes("chilquinta")){
              this.setState({factigisEmailValidator: false});
              return;

            }
            this.setState({factigisEmailValidator: true,
            factigisEmail: this.state.factigisEmail.toUpperCase()});

          }else{
            //////console.log("email no valido, factigisEmail",this.state.factigisEmail.toUpperCase());
            this.setState({factigisEmailValidator: false});
          }
        }else{
          //////console.log("no factigisEmail",this.state.factigisEmail.toUpperCase());
          this.setState({factigisEmailValidator: false});
        }
      break;

      case 'factigis_txtTramo':
        if(!this.state.factigisTramo==''){
          //////console.log("si factigisTramo",this.state.factigisTramo);
          this.setState({factigisTramoValidator: true});
        }else{
          //////console.log("no factigisTramo",this.state.factigisTramo);
          this.setState({factigisTramoValidator: false});
        }
      break;

      case 'factigis_txtCantEmpalmes':
        if(!this.state.factigisCantidadEmpalmes==''){
          //////console.log("si factigis_cantidadEmpalmes",this.state.factigisCantidadEmpalmes);
          this.setState({factigisCantidadEmpalmesValidator: true});
        }else{
          //////console.log("no factigis_cantidadEmpalmes",this.state.factigisCantidadEmpalmes);
          this.setState({factigisCantidadEmpalmesValidator: false});
        }
      break;
      case 'factigis_txtPotencia':
        if(!this.state.factigis_selectedValueTipoPotencia==''){
          if(this.state.factigis_selectedValueTipoPotencia>0){
            this.setState({factigistxtPotenciaValidator: true});

          }else{
            this.setState({factigis_selectedValueTipoPotencia: Math.abs(this.state.factigis_selectedValueTipoPotencia)});
            this.setState({factigistxtPotenciaValidator: true});
          }
        }else{
          this.setState({factigis_selectedValueTipoPotencia: 0});
          this.setState({factigistxtPotenciaValidator: false});
        }
      break;
      default:

    }


  }

  //Functions for each button that get the map coordinates and validate the Factibility info.
  onClickCliente(e){

    var map = this.props.themap;

    //turn off the other toggle buttons from the same window.
    toggleOff('direccion', this.state.btnDireccion);
    toggleOff('poste', this.state.btnPoste, this.state.togglePoste);
    toggleOff('tramo', this.state.btnTramo, this.state.toggleTramo);

    this.setState({togglePoste: 'OFF', toggleDireccion: 'OFF', toggleTramo: 'OFF',
    btnPosteDisabled: true,btnTramoDisabled: true, btnDireccionDisabled: true});

    if (this.state.toggleCliente =='OFF'){
      this.setState({toggleCliente: 'ON'});
      $('.factigis_btnSelectCliente').css('color',"crimson").css('border-color','red');

      var map_click_handle = dojo.connect(map, 'onClick', (g)=>{
      //  $("#iframeloadingAdd").show();
        $(".drawer_progressBar").css('visibility','visible');
        //saves geometry point for customer.
        this.setState({factigis_geoCliente: g.mapPoint, factigis_geoClienteValidator:true});

        factigis_findComuna(g.mapPoint, (cb)=>{
          if(!cb.length){
            this.setState({
              open: true,
              problemsforAdding: 'No se ha podido encontrar la comuna, intente nuevamente.',
              btnModalCloseStatus: false
            });
              //$("#iframeloadingAdd").hide();
              $(".drawer_progressBar").css('visibility','hidden');
              this.setState({toggleCliente: 'OFF'});
              dojo.disconnect(this.state.btnCliente);
              $('.factigis_btnSelectCliente').css('color',"black").css('border-color','initial');
            return;
          }
          //console.log("comuna",cb[0].attributes.nombre);
          let comunaa = cb[0].attributes.nombre;
          //getting zone due to user click on map.
          var zona = getZona(cb[0].attributes.nombre);
          //console.log("my zone",zona);

          //validar factibilidad.
          var zones = factigis_validator(g.mapPoint, (callbackMain)=>{
            //console.log("zonas:", callbackMain);
            this.setState({
              factCartaComuna: comunaa,
              zonaConcesion: callbackMain.zonaConcesion,
              zonaCampamentos: callbackMain.zonaCampamentos,
              zonaRestringida: callbackMain.zonaRestringida,
              zonaVialidad: callbackMain.zonaVialidad,
              zonaTransmision: callbackMain.zonaTransmision,
                //clear fields for pipes
                factigis_geoPoste: '',
                factigisRotulo: '',
                factigisRotuloValidator: false,
                factigis_geoPosteValidator: false,
                //clear fields for addresses
                factigis_geoDireccion: '',
                factigisDireccion: '',
                factigisIDDireccion: '',
                factigisDireccionValidator: false,
                factigis_geoDireccionValidator: false,
                btnPosteDisabled: false,
                btnDireccionDisabled: true,
                factigis_sed: '',
                factigis_selectedValueTipoEmpalmeBTMT: '',
                factigisTipoBTMTValidator: false,
                factigisTramo: '',
                factigis_alimentador: '',
                factigisComuna: cb[0].attributes.nombre,
                factigisZona: zona
            });
          });

          //draw customer location on the map.
          map.graphics.clear();
          let pointSymbol = makeSymbol.makePointCustomer();
          map.graphics.add(new esri.Graphic(g.mapPoint,pointSymbol));
        //  $("#iframeloadingAdd").hide();
          $(".drawer_progressBar").css('visibility','hidden');
        });

      });
      //change the state from toggle handler and save it for removing later
      this.setState({btnCliente: map_click_handle});


    }else{
      this.setState({toggleCliente: 'OFF'});
      $('.factigis_btnSelectCliente').css('color',"black").css('border-color','initial');
      dojo.disconnect(this.state.btnCliente);
      //$("#iframeloadingAdd").hide();
      $(".drawer_progressBar").css('visibility','hidden');
      ////////console.log("this is my saved point for cliente", this.state.factigis_geoCliente);
    }
  }

  onClickPoste(e){

    var map = this.props.themap;
    //turn off the other toggle buttons from the same window.
    toggleOff('cliente', this.state.btnCliente, this.state.toggleCliente);
    toggleOff('direccion', this.state.btnDireccion, this.state.toggleDireccion);
    toggleOff('tramo', this.state.btnTramo, this.state.toggleTramo);
    //limpiar campos relacionados a direccion y tipo de rotulo
    this.setState({
      factigis_geoDireccion: '',
      factigisDireccion: '',
      factigisIDDireccion: '',
      factigisDireccionValidator: false,
      factigis_geoDireccionValidator: false,
      btnDireccionDisabled: true,
      factigis_selectedValueTipoEmpalmeBTMT: '',
      factigisTipoBTMTValidator: false,
      factigisTramo: '',
      factiTipoFactibilidad: 'FACTIBILIDAD DIRECTA',
      btnTramoDisabled: true
    });

    this.setState({toggleCliente: 'OFF',  toggleTramo: 'OFF', toggleDireccion: 'OFF'});

    if (this.state.togglePoste =='OFF'){
      this.setState({togglePoste: 'ON'});
        $('.factigis_btnSelectPoste').css('color',"crimson").css('border-color','red');

        var map_click_handle = dojo.connect(map, 'onClick', (g)=>{
          //$("#iframeloadingAdd").show();
          $(".drawer_progressBar").css('visibility','visible');
          factigis_findRotulo(g.mapPoint, (featureSetFeatures)=>{
            if(!featureSetFeatures.length){
              this.setState({
                open: true,
                problemsforAdding: 'No se ha podido encontrar el rótulo, intente nuevamente.',
                btnModalCloseStatus: false
              });
              //$("#iframeloadingAdd").hide();
              $(".drawer_progressBar").css('visibility','hidden');
                this.setState({togglePoste: 'OFF'});
                dojo.disconnect(this.state.btnPoste);
                $('.factigis_btnSelectPoste').css('color',"black").css('border-color','initial');
              return;
            }
            // verificar si es camara o poste
            if(featureSetFeatures[0].attributes['tipo_nodo']=="ele!camara"){
              //es camara
              this.setState({factigis_tipoEmpalme: tipoSubterraneo});
            }if(featureSetFeatures[0].attributes['tipo_nodo']=="ele!poste"){
              //es poste
              this.setState({factigis_tipoEmpalme: tipoEmpalme});
            }
            //30/11
            this.setState({factigisPropiedadPoste: featureSetFeatures[0].attributes['propiedad']});
            //console.log("propiedad poste:", featureSetFeatures[0].attributes['propiedad']);
            //verificar si el rotulo es particular/otro u empresa: si es empresa, la factibilidad es normal, si es particular/otro, es asistida.
            if((featureSetFeatures[0].attributes['propiedad']=="Particular") || (featureSetFeatures[0].attributes['propiedad']=="Empresa que no presta Servicio Distribucion") ){
              //console.log("poste es ",featureSetFeatures[0].attributes['propiedad'], featureSetFeatures);
              this.setState({factiTipoFactibilidad: 'FACTIBILIDAD ASISTIDA'});
            }else{
              ////console.log("poste es empresa" ,featureSetFeatures[0].attributes['propiedad'], featureSetFeatures);
              this.setState({factiTipoFactibilidad: 'FACTIBILIDAD DIRECTA'});
            }
            //dibujar linea entre poste y cliente
            var line = new esri.geometry.Polyline(map.spatialReference);
            map.graphics.clear();
            map.graphics.add(new esri.Graphic(this.state.factigis_geoCliente,makeSymbol.makePointCustomer()));
            line.addPath([this.state.factigis_geoCliente, featureSetFeatures[0].geometry]);
            let lineSymbol = makeSymbol.makeTrackLine();
            map.graphics.add(new esri.Graphic(line,lineSymbol));
            //10.5.2018: agregar validacion para dejar asistidos los empalmes que intersecten linea de
            this.setState({factigis_lineaCP: line});
            //console.log(this.state.factigis_lineaCP,"linea cp");
            //extrae datos de rotulo
            let rotulo = featureSetFeatures[0].attributes['rotulo'];
            var sed = featureSetFeatures[0].attributes['sed'];
            let alimentador = featureSetFeatures[0].attributes['alimentador'];
            //console.log(sed,"tengo SED EN 0?")
            this.setState({
              factigis_geoPoste: featureSetFeatures[0].geometry,
              factigisRotulo: rotulo,
              factigisRotuloValidator: true,
              factigis_geoPosteValidator: true,
              factigis_sed: (sed != "" || sed != null)? sed : "0",
              factigis_alimentador: alimentador,
              btnTramoDisabled: false,
              btnDireccionDisabled: true,
              factigisIDNodo: featureSetFeatures[0].attributes['id_nodo']
            });
            //$("#iframeloadingAdd").hide();
              $(".drawer_progressBar").css('visibility','hidden');
          });

        });
        this.setState({btnPoste: map_click_handle});
    }else{
      this.setState({togglePoste: 'OFF'});
        $('.factigis_btnSelectPoste').css('color',"black");
          $(".drawer_progressBar").css('visibility','hidden');
        dojo.disconnect(this.state.btnPoste);
        ////////console.log("this is my saved point for poste", this.state.factigis_geoPoste);
    }
  }

  onClickTramo(e){
    var map = this.props.themap;

    //TURN ON THE RED BT Y MT layers
    var addbtayer = setLayers().factigis_BT();
    document.getElementById('check_BT').checked=true;
    map.addLayer(addbtayer,1);
    var addmtayer = setLayers().factigis_MT();
    document.getElementById('check_MT').checked=true;
    map.addLayer(addmtayer,1);
    $(".drawer_progressBar").css('visibility','visible');
    //turn off the other toggle buttons from the same window.
    toggleOff('cliente', this.state.btnCliente, this.state.toggleCliente);
    toggleOff('poste', this.state.btnPoste, this.state.togglePoste);
    toggleOff('direccion', this.state.btnDireccion, this.state.toggleDireccion);
    //limpiar campos relacionados a direccion y tipo de rotulo
    this.setState({
      factigis_geoDireccion: '',
      factigisDireccion: '',
      factigisIDDireccion: '',
      factigisDireccionValidator: false,
      factigis_geoDireccionValidator: false,
      btnDireccionDisabled: true,
      factigisTramo: ''
    });

    this.setState({toggleCliente: 'OFF',  togglePoste: 'OFF', toggleDireccion: 'OFF'});

    if (this.state.toggleTramo =='OFF'){
      this.setState({toggleTramo: 'ON'});
        $('.factigis_btnSelectTramo').css('color',"crimson").css('border-color','red');

        var map_click_handle = dojo.connect(map, 'onClick', (g)=>{
          //$("#iframeloadingAdd").show();

          if(this.state.factigis_selectedValueTipoEmpalmeBTMT==""){
            this.setState({
              open: true,
              problemsforAdding: 'Seleccione un tipo de tramo',
              numeroFactibilidad: '',
              btnModalCloseStatus: false,
            });
              $(".drawer_progressBar").css('visibility','hidden');
            return;

          }else{
            factigis_findTramo(g.mapPoint, this.state.factigis_selectedValueTipoEmpalmeBTMT, (featureSetFeatures)=>{
            //  console.log(this.state.factiTipoFactibilidad,"tengo hasta ahora esto!!");
              if(featureSetFeatures.tipoFactibilidad=='FACTIBILIDAD ASISTIDA'){
                this.setState({
                  factigisTramoValidator: true,
                  factigisTramo: featureSetFeatures.descripcion,
                  btnDireccionDisabled: false,
                  factiTipoFactibilidad: featureSetFeatures.tipoFactibilidad
                });
              }else{
                this.setState({
                  factigisTramoValidator: true,
                  factigisTramo: featureSetFeatures.descripcion,
                  btnDireccionDisabled: false
                  /*,
                  factiTipoFactibilidad: featureSetFeatures.tipoFactibilidad
                  */

                });
                //  console.log(this.state.factiTipoFactibilidad,"me quede con ...");
              }
              //$("#iframeloadingAdd").hide();
              $(".drawer_progressBar").css('visibility','hidden');
            });

          }
        });
        this.setState({btnPoste: map_click_handle});
    }else{
      this.setState({togglePoste: 'OFF'});
        $('.factigis_btnSelectPoste').css('color',"black");
        dojo.disconnect(this.state.btnPoste);
        $(".drawer_progressBar").css('visibility','hidden');
        ////////console.log("this is my saved point for poste", this.state.factigis_geoPoste);
    }
  }

  onClickDireccion(e){
    var map = this.props.themap;

    //turn off the other toggle buttons from the same window.
    toggleOff('cliente', this.state.btnCliente, this.state.toggleCliente);
    toggleOff('poste', this.state.btnPoste, this.state.togglePoste);
    toggleOff('tramo', this.state.btnTramo, this.state.toggleTramo);
    this.setState({toggleCliente: 'OFF',togglePoste: 'OFF', toggleTramo:'OFF'});

    if (this.state.toggleDireccion =='OFF'){
      this.setState({toggleDireccion: 'ON'});
        $('.factigis_btnSelectDireccion').css('color',"crimson");

        var map_click_handle = dojo.connect(map, 'onClick', (g)=>{
          //$("#iframeloadingAdd").show();
          $(".drawer_progressBar").css('visibility','visible');
          factigis_findDireccion(g.mapPoint, (featureSetFeatures)=>{
            //if theres no results for old addresses, search in new ones.
            if(!featureSetFeatures.length){
              //////console.log("searching in new addresses");
              factigis_findNewDireccion(g.mapPoint, (featureSetFeatures)=>{
                if(!featureSetFeatures.length){
                  //////console.log("not detected any in old or new adresses");
                  this.setState({
                    open: true,
                    problemsforAdding: 'Problema encontrando dirección, intente nuevamente',
                    numeroFactibilidad: '',
                    btnModalCloseStatus: false,
                  });
                    $(".drawer_progressBar").css('visibility','hidden');
                  return;
                }else{
                  //////console.log("detected in new addresses");
                  let direccion = featureSetFeatures[0].attributes['CALLE'] + " " + featureSetFeatures[0].attributes['NUMERO'];
                  this.setState({
                    factigis_geoDireccion: featureSetFeatures[0].geometry,
                    factigisDireccion: direccion,
                    factigisIDDireccion: featureSetFeatures[0].attributes['OBJECTID'],
                    factigisDireccionValidator: true,
                    factigis_geoDireccionValidator: true
                  });
                  var line = new esri.geometry.Polyline(map.spatialReference);
                  var line2 = new esri.geometry.Polyline(map.spatialReference);
                  map.graphics.clear();
                  map.graphics.add(new esri.Graphic(this.state.factigis_geoCliente,makeSymbol.makePointCustomer()));
                  line.addPath([this.state.factigis_geoCliente, this.state.factigis_geoPoste]);
                  let lineSymbol = makeSymbol.makeTrackLine();
                  map.graphics.add(new esri.Graphic(line,lineSymbol));
                  line2.addPath([this.state.factigis_geoCliente, this.state.factigis_geoDireccion]);
                  map.graphics.add(new esri.Graphic(line2,lineSymbol));
                  //$("#iframeloadingAdd").hide();
                  $(".drawer_progressBar").css('visibility','hidden');
                }
              });
            //else , change the values for states and display the old address found.
            }else{
              //////console.log("detected in old addresses");
              let direccion = featureSetFeatures[0].attributes['nombre_calle'] + " " + featureSetFeatures[0].attributes['numero'];
              this.setState({
                factigis_geoDireccion: featureSetFeatures[0].geometry,
                factigisDireccion: direccion,
                factigisIDDireccion: featureSetFeatures[0].attributes['id_direccion'],
                factigisDireccionValidator: true,
                factigis_geoDireccionValidator: true
              });
              var line = new esri.geometry.Polyline(map.spatialReference);
              var line2 = new esri.geometry.Polyline(map.spatialReference);
              map.graphics.clear();
              map.graphics.add(new esri.Graphic(this.state.factigis_geoCliente,makeSymbol.makePointCustomer()));
              line.addPath([this.state.factigis_geoCliente, this.state.factigis_geoPoste]);
              let lineSymbol = makeSymbol.makeTrackLine();
              map.graphics.add(new esri.Graphic(line,lineSymbol));
              line2.addPath([this.state.factigis_geoCliente, this.state.factigis_geoDireccion]);
              map.graphics.add(new esri.Graphic(line2,lineSymbol));
              //$("#iframeloadingAdd").hide();
              $(".drawer_progressBar").css('visibility','hidden');
            }
          });


        //save the handler for removing it later (in the off)
        this.setState({btnDireccion: map_click_handle});

        });

    }else{
      this.setState({toggleDireccion: 'OFF'});
        $('.factigis_btnSelectDireccion').css('color',"black");
        $(".drawer_progressBar").css('visibility','hidden');
        dojo.disconnect(this.state.btnDireccion);
        ////////console.log("this is my saved point for poste", this.state.factigis_geoPoste);
    }
  }

  onChangeComboBox(type, val){
    switch (type) {
      case 'tipoCliente':
        //////console.log("haciendo click en tipo cliente", type,val);
        if(!val){
          //////console.log("no hay value" , val);
          this.setState({factigis_selectedValueCliente: 'NODEFINIDO', factigisTipoClienteValidator: false});
          return;
        }
        this.setState({factigis_selectedValueCliente: val, factigisTipoClienteValidator: true});
      break;

      case 'tipoContribuyente':
        //////console.log("haciendo click en tipoContribuyente", type,val);
        if(!val){
          //////console.log("no hay value" , val);
          this.setState({factigis_selectedValueTipoContribuyente: 'NODEFINIDO', factigisTipoContribuyenteValidator: false});
          return;
        }
        this.setState({factigis_selectedValueTipoContribuyente: val, factigisTipoContribuyenteValidator: true});
      break;

      case 'tipoEmpalme':
        //////console.log("haciendo click en ", type,val);
        if(!val){
          //////console.log("no hay value" , val);
          this.setState({factigis_selectedValueTipoEmpalme: 'NODEFINIDO', factigisTipoEmpalmeValidator: false, factigis_tipoPotencia: []});
          return;
        }
        this.setState({factigis_selectedValueTipoEmpalme: val, factigisTipoEmpalmeValidator:true, factigis_tipoPotencia: []});
      break;

      case 'tipoFase':
        //////console.log("haciendo click en ", type,val);
        if(!val){
          //////console.log("no hay value" , val);
          this.setState({factigis_selectedValueTipoFase: 'NODEFINIDO', factigisTipoFaseValidator: false, factigis_tipoPotencia: []});
          return;
        }
        this.setState({factigis_selectedValueTipoFase: val, factigisTipoFaseValidator:true, factigis_tipoPotencia: []});
      break;

      case 'tipoPotencia':
        ////console.log("haciendo click en ",val);
        if(!val){
        ////console.log("no hay value" , val);
          this.setState({factigis_selectedValueTipoPotencia: 'NODEFINIDO', factigisPotenciaValidator: false, factigistxtPotenciaValidator: true});
          return;
        }
        this.setState({factigis_selectedValueTipoPotencia: val, factigisPotenciaValidator: true, factigistxtPotenciaValidator: true});
      break;

      case 'tipoEmpalmeBTMT':

        if(!val){
          ////console.log("no hay value" , val);
          this.setState({
            factigis_selectedValueTipoEmpalmeBTMT: '',
            factigisTipoBTMTValidator: false,
            factigisTramo: '',
            factigisTramoValidator: false
          });
          return;
        }
        this.setState({factigis_selectedValueTipoEmpalmeBTMT: val, factigisTipoBTMTValidator:true, factigisTramoValidator: true});
        if(val=='BT'){
          ////console.log("seleccionado", val, "abriendo combo de potencia bt");
          this.setState({visibilityStyle:
            {
              selectPotencia: {
                visibility: 'visible'
              },
              txtPotencia:{
                  visibility: 'hidden',
                  display: 'none',
                  height: 0
              }
            },
            factigis_selectedValueTipoPotencia: '',
            factigisPotenciaValidator: false,
            factigistxtPotenciaValidator: true
          });

          $('.factigisPotencia2').css('border-color','initial').css('border-style', 'groove');

          //ENABLE QTTY WHEN SELECT bt
          this.setState({factigis_cantEmpalmesEnabled: false, factigisCantidadEmpalmes: 0});
        }else{
          ////console.log("seleccionado", val, "abriendo txt para escribir potencia");
          this.setState({visibilityStyle:
            {
              selectPotencia: {
                visibility: 'hidden',
                display: 'none',
                height: 0
              },
              txtPotencia:{
                  visibility: 'visible',
                  display: 'flex'
              }
            },

            factigis_selectedValueTipoPotencia: '',
            factigistxtPotenciaValidator: false,
            factigisPotenciaValidator: true
          });
          $('.factigisPotencia').css('border-color','initial').css('border-style', 'hidden').css('border-width', '0px');

          //DISABLE QTTY WHEN SELECT MT
          this.setState({factigis_cantEmpalmesEnabled: true, factigisCantidadEmpalmes: '1', factigisCantidadEmpalmesValidator: true });

        }
      break;

      case 'ddlCantidadEmpalmes':
        ////console.log("haciendo click en ",val);
        if(!val){
        ////console.log("no hay value" , val);
          this.setState({factigisCantidadEmpalmes: 'NODEFINIDO', factigisCantidadEmpalmesValidator: false});
          return;
        }
        this.setState({factigisCantidadEmpalmes: val, factigisCantidadEmpalmesValidator: true});

        break;

      case 'ddlClasificacion':
      //console.log("haciendo click en ",val);
        if(!val){
        ////console.log("no hay value" , val);
          this.setState({factigisClasificacion:  'NODEFINIDO', factigisClasificacionValidator: false});
          return;
        }
        this.setState({factigisClasificacion: val, factigisClasificacionValidator: true});
        break;


      default:

    }
  }

  onOpen(){

    if( (this.state.factigis_selectedValueTipoEmpalme=='' || this.state.factigis_selectedValueTipoEmpalme=="") || (this.state.factigis_selectedValueTipoFase=='NODEFINIDO' || this.state.factigis_selectedValueTipoFase=="")){
      ////////console.log("no hay valor de tipo Empalme para calcular potencia.", this.state.factigis_selectedValueTipoFase, this.state.factigis_selectedValueTipoEmpalme);
      return
    }else{
      getPotenciaEmpalme(this.state.factigis_selectedValueTipoEmpalme,this.state.factigis_selectedValueTipoFase, (cb)=>{
        //////console.log(cb);
        this.setState({factigis_tipoPotencia: cb})
      });

    }
  }

  //Function that adds a new customer but has to validate the other fields yet.
  onClickAgregarCliente(){
    var myFact2, myFact = {}
    $(".drawer_progressBar").css('visibility','visible');
    let tipoProvisorioDefinitivo = 'DEFINITIVO';
    if(this.state.radioEmpalmeProvisorio){
      tipoProvisorioDefinitivo="PROVISORIO";
    }

    let txtValidators = {
      rut: this.state.factigisRutValidator,
      nombre: this.state.factigisNombreValidator,
      apellido: this.state.factigisApellidoValidator,
      telefono: this.state.factigisTelefonoValidator,
      email: this.state.factigisEmailValidator,
      tramo: this.state.factigisTramoValidator,
      cantidadEmpalmes: this.state.factigisCantidadEmpalmesValidator,
      direccion: this.state.factigisDireccionValidator,
      poste: this.state.factigisRotuloValidator,
      potencia: this.state.factigisPotenciaValidator,
      potencia2: this.state.factigistxtPotenciaValidator,
      //comboboxes
      tipoCliente: this.state.factigisTipoClienteValidator,
      tipoContribuyente: this.state.factigisTipoContribuyenteValidator,
      tipoEmpalme: this.state.factigisTipoEmpalmeValidator,
      tipoFase: this.state.factigisTipoFaseValidator,
      tipoBTMT: this.state.factigisTipoBTMTValidator,
      tipoProvisorioDefinitivo: tipoProvisorioDefinitivo,
      //geometries
      geoCliente: this.state.factigis_geoClienteValidator,
      geoRotulo: this.state.factigis_geoPosteValidator,
      geoDireccion: this.state.factigis_geoDireccionValidator

    };
    
    customerValidator(txtValidators,(callback, callback2)=>{
      //Si todos los campos estan llenos
      if(callback){

        let factArr = [];
        //datos a mostrar en modal para indicar que existen problemas de factibilidad en ciertas zonas.
        if(this.state.zonaCampamentos==false){
          factArr.push("campamentos");
        }

        if(this.state.zonaConcesion==false){
          factArr.push("concesion");
        }

        if(this.state.zonaRestringida==false){
          factArr.push("restringida");
        }

        if(this.state.zonaTransmision==false){
          factArr.push("transmision");
        }
        /*
        if(this.state.zonaVialidad==false){
          factArr.push("vialidad");
        }
        */
        //console.log("Problemas zonas encontrados:" , factArr);
      
        //Si no hay problemas de zonas, pasa a factibilidad NORMAL (directa), transitoriamente ya que esto puede cambiar dentro de la función de guardado.
        //FACTIBILIDAD NORMAL
        //console.log("Problemas zonas encontrados", factArr);
        if(!factArr.length){
          //primeros campos a definir para agregar (se agregan más luego en la otra función addNuevaFactibilidad)
          myFact = {
            factigisRut: this.state.factigisRut,
            factigisNombre: this.state.factigisNombre,
            factigisApellido: this.state.factigisApellido,
            factigisTelefono: this.state.factigisTelefono,
            factigisEmail: this.state.factigisEmail,
            factigisTipoCliente: this.state.factigis_selectedValueCliente,
            factigisContribuyente: this.state.factigis_selectedValueTipoContribuyente,
            factigisRotulo: this.state.factigisRotulo,
            factigisTramo: this.state.factigisTramo,
            factigisEmpalme: this.state.factigis_selectedValueTipoEmpalme,
            factigisFase: this.state.factigis_selectedValueTipoFase,
            factigisPotencia: this.state.factigis_selectedValueTipoPotencia,
            factigisTiempoEmpalme: tipoProvisorioDefinitivo,
            factigisTipoEmpalme: this.state.factigis_selectedValueTipoEmpalmeBTMT,
            factigisCantidadEmpalmes: this.state.factigisCantidadEmpalmes,
            factigisDireccion: this.state.factigisDireccion,
            factigisIDDireccion: this.state.factigisIDDireccion,
            factigisZonaConcesion: this.state.zonaConcesion,
            factigisZonaTransmision: this.state.zonaTransmision,
            factigisZonaRestringida: this.state.zonaRestringida,
            factigisZonaVialidad: this.state.zonaVialidad,
            factigisZonaCampamentos: this.state.zonaCampamentos,
            factigisGeoCliente: this.state.factigis_geoCliente,
            factigisGeoPoste: this.state.factigis_geoPoste,
            factigisGeoDireccion: this.state.factigis_geoDireccion,
            factigis_Sed: this.state.factigis_sed,
            factigisTipoFactibilidad: this.state.factiTipoFactibilidad,
            factigisAlimentador: this.state.factigis_alimentador,
            factigisIDNodo: this.state.factigisIDNodo,
            factigisComuna: this.state.factigisComuna,
            factigisZona: this.state.factigisZona,
            factigisClasificacion: this.state.factigisClasificacion,
            factigisEmpresa: this.state.factigis_empresa
            }

            
            //se pasan los primeros campos para agregar
            this.setState({
              open: true,
              problemsforAdding: 'Procesando factibilidad, espere un momento'
            });

            //26/1/2017: BUG: problemas con las direcciones largas.
            if(this.state.factigisDireccion.length>=75){
              console.log("problemas de dirección en largo.", this.state.factigisDireccion.length);
              this.setState({
                open: true,
                problemsforAdding: 'La dirección para la factibilidad excede el largo (75) permitido. No se puede agregar.',  numeroFactibilidad: '',
                btnModalCloseStatus: false
              });
              //$("#iframeloadingAdd").hide();
              $(".drawer_progressBar").css('visibility','hidden');
              return;
            }
           
            factigis_addNuevaFactibilidad(myFact, (cb)=>{

              //si fue grabado se abre modal indicando el tipo de factibilidad y el objectid con el que fue grabado.
              if(cb[0]){
                this.setState({
                  open: true,
                  problemsforAdding: 'La factibilidad  ha sido agregada. Tipo: ' + cb[2]['Tipo_factibilidad'] ,
                  numeroFactibilidad: 'N°' + cb[1],
                  btnModalCloseStatus: false
                });

                //$("#iframeloadingAdd").hide();
                $(".drawer_progressBar").css('visibility','hidden');
                //GENERAR CARTA: guardar en cookie los parametros con que fue generada la factibilidad para crear la carta.
                let usrprfl = cookieHandler.get('usrprfl');
                cookieHandler.set('myLetter',[this.state.factigisDireccion + ", " + this.state.factCartaComuna ,
                      this.state.factigisNombre + " " + this.state.factigisApellido,
                      usrprfl.NOMBRE_COMPLETO,
                      cb[1],
                      usrprfl.CARGO,
                      usrprfl.LUGAR_DE_TRABAJO,
                      usrprfl.DEPARTAMENTO,
                      usrprfl.COMUNA]);
                    //this.render(); //renderizar el componente
                    window.open("factigisCarta.html");
              //si no fue grabado mostrar que hubo problemas en modal
              }else{
                this.setState({
                  open: true,
                  problemsforAdding: 'Hubo un problema al agregar la factibilidad',  numeroFactibilidad: '',
                  btnModalCloseStatus: false
                });
                // $("#iframeloadingAdd").hide();
                $(".drawer_progressBar").css('visibility','hidden');
              }

            });


        //FACTIBILIDAD ASISTIDA: cuando hay problemas con las zonas
        }else{
          //console.log(this.state, this.state.factigis_sed,"tengo esto asignado en asistidas")
          let fArr = [];
          //26/1/2017: BUG: problemas con las direcciones largas.
          if(this.state.factigisDireccion.length>=75){
            //console.log("problemas de dirección en largo.", this.state.factigisDireccion.length);
            this.setState({
              open: true,
              problemsforAdding: 'La dirección para la factibilidad excede el largo (75) permitido. No se puede agregar.',  numeroFactibilidad: '',
              btnModalCloseStatus: false
            });
            $(".drawer_progressBar").css('visibility','hidden');
            return;
          }
           
          myFact2 = {
            factigisRut: this.state.factigisRut,
            factigisNombre: this.state.factigisNombre,
            factigisApellido: this.state.factigisApellido,
            factigisTelefono: this.state.factigisTelefono,
            factigisEmail: this.state.factigisEmail,
            factigisTipoCliente: this.state.factigis_selectedValueCliente,
            factigisContribuyente: this.state.factigis_selectedValueTipoContribuyente,
            factigisRotulo: this.state.factigisRotulo,
            factigisTramo: this.state.factigisTramo,
            factigisEmpalme: this.state.factigis_selectedValueTipoEmpalme,
            factigisFase: this.state.factigis_selectedValueTipoFase,
            factigisPotencia: this.state.factigis_selectedValueTipoPotencia,
            factigisTiempoEmpalme: tipoProvisorioDefinitivo,
            factigisTipoEmpalme: this.state.factigis_selectedValueTipoEmpalmeBTMT,
            factigisCantidadEmpalmes: this.state.factigisCantidadEmpalmes,
            factigisDireccion: this.state.factigisDireccion,
            factigisIDDireccion: this.state.factigisIDDireccion,
            factigisZonaConcesion: this.state.zonaConcesion,
            factigisZonaTransmision: this.state.zonaTransmision,
            factigisZonaRestringida: this.state.zonaRestringida,
            factigisZonaVialidad: this.state.zonaVialidad,
            factigisZonaCampamentos: this.state.zonaCampamentos,
            factigisGeoCliente: this.state.factigis_geoCliente,
            factigisGeoPoste: this.state.factigis_geoPoste,
            factigisGeoDireccion: this.state.factigis_geoDireccion,
            factigis_Sed: this.state.factigis_sed,
            factigisTipoFactibilidad: 'FACTIBILIDAD ASISTIDA',
            factigisAlimentador: this.state.factigis_alimentador,
            factigisIDNodo: this.state.factigisIDNodo,
            factigisComuna: this.state.factigisComuna,
            factigisZona: this.state.factigisZona,
            factigisClasificacion: this.state.factigisClasificacion,
            factigisPropiedadPoste: this.state.factigisPropiedadPoste,
            factigisEmpresa: this.state.factigis_empresa
            }
          //Si dentro del array de zonas hay problemas
          //Si está FUERA de la zona concesión ----------------------------------------
          if($.inArray("concesion",factArr)>-1){

              //Si esta dentro de la zona de transmisión = No agregar
              if($.inArray("transmision",factArr)>-1){

                //no agregar
                //console.log("No agregar porque está dentro de zona transmisión y fuera de concesión");
                this.setState({
                  open: true,
                  problemsforAdding: 'No se puede agregar porque está dentro de zona transmisión y fuera de concesión',
                  btnModalCloseStatus: false
                });
                //$("#iframeloadingAdd").hide();
                $(".drawer_progressBar").css('visibility','hidden');
                return;

              }
              //Si está fuera de la zona de concesión y fuera o dentro de zona restringida = Asistida y fuera de transmision
              else{
                this.setState({
                  open: true,
                  problemsforAdding: 'Procesando factibilidad, espere un momento'
                });

                factigis_addNuevaFactibilidad_especial(myFact2, (cb)=>{
                  if(cb[0]){
                    this.setState({
                    open: true,
                    problemsforAdding: 'La factibilidad  ha sido agregada. Tipo: ' + cb[2]['Tipo_factibilidad'] ,
                    numeroFactibilidad: 'N°' + cb[1],
                    btnModalCloseStatus: false
                    });

                    //$("#iframeloadingAdd").hide();
                    $(".drawer_progressBar").css('visibility','hidden');

                    //GENERAR CARTA: guardar en cookie los parametros con que fue generada la factibilidad para crear la carta.
                    let usrprfl = cookieHandler.get('usrprfl');
                    cookieHandler.set('myLetter',[this.state.factigisDireccion + ", " + this.state.factCartaComuna ,
                      this.state.factigisNombre + " " + this.state.factigisApellido,
                      usrprfl.NOMBRE_COMPLETO,
                      cb[1],
                      usrprfl.CARGO,
                      usrprfl.LUGAR_DE_TRABAJO,
                      usrprfl.DEPARTAMENTO,
                      usrprfl.COMUNA]);

                      window.open("factigisCarta.html");
                  //si no fue grabado mostrar que hubo problemas en modal
                  }else{
                    this.setState({
                      open: true,
                      problemsforAdding: cb[1],  numeroFactibilidad: '',
                      btnModalCloseStatus: false
                    });
                    $(".drawer_progressBar").css('visibility','hidden');
                  }
                });
                return;
              }

          }

          //Si está DENTRO de concesión y también dentro de transmisión = No agregar --------------------------------------------
          if ($.inArray("transmision",factArr)>-1) {

              //en zona transmisión
              //console.log("No se puede agregar debido a que está en zona de transmisión, pese a que está dentro de la concesión");
              this.setState({
                open: true,
                problemsforAdding: 'No se puede agregar debido a que está en zona de transmisión, pese a que está dentro de la concesión',
                btnModalCloseStatus: false
              });
              $(".drawer_progressBar").css('visibility','hidden');
              return;
          }
          //Si está dentro de concesión y también dentro de campamentos = Asistida
          if ($.inArray("campamentos",factArr)>-1) {
                fArr.push("campamentos");
                this.setState({
                  open: true,
                  problemsforAdding: 'Procesando factibilidad, espere un momento'
                });
               
                factigis_addNuevaFactibilidad_especial(myFact2, (cb)=>{
                  if(cb[0]){
                    this.setState({
                    open: true,
                    problemsforAdding: 'La factibilidad  ha sido agregada. Tipo: ' + cb[2]['Tipo_factibilidad'] ,
                    numeroFactibilidad: 'N°' + cb[1],
                    btnModalCloseStatus: false
                    });

                    //$("#iframeloadingAdd").hide();
                    $(".drawer_progressBar").css('visibility','hidden');

                    //GENERAR CARTA: guardar en cookie los parametros con que fue generada la factibilidad para crear la carta.
                    let usrprfl = cookieHandler.get('usrprfl');
                    cookieHandler.set('myLetter',[this.state.factigisDireccion + ", " + this.state.factCartaComuna ,
                      this.state.factigisNombre + " " + this.state.factigisApellido,
                      usrprfl.NOMBRE_COMPLETO,
                      cb[1],
                      usrprfl.CARGO,
                      usrprfl.LUGAR_DE_TRABAJO,
                      usrprfl.DEPARTAMENTO,
                      usrprfl.COMUNA]);

                      window.open("factigisCarta.html");
                      //si no fue grabado mostrar que hubo problemas en modal
                  }else{
                    this.setState({
                      open: true,
                      problemsforAdding: cb[1],  numeroFactibilidad: '',
                      btnModalCloseStatus: false
                    });
                    //$("#iframeloadingAdd").hide();
                    $(".drawer_progressBar").css('visibility','hidden');
                  }
                });
                return;
          }

          //3.10.2015: agregar capa de zona restringida
          //En concesión y en zona restringida = Ingresar asistida.
          if($.inArray("restringida",factArr)>-1){
           // console.log("dentro de concesión pero en zona restringida");
            this.setState({
              open: true,
              problemsforAdding: 'Procesando factibilidad, espere un momento'
            });
           
            factigis_addNuevaFactibilidad_especial(myFact2, (cb)=>{
              if(cb[0]){
                this.setState({
                open: true,
                problemsforAdding: 'La factibilidad  ha sido agregada. Tipo: ' + cb[2]['Tipo_factibilidad'] ,
                numeroFactibilidad: 'N°' + cb[1],
                btnModalCloseStatus: false
                });

                //$("#iframeloadingAdd").hide();
                $(".drawer_progressBar").css('visibility','hidden');

                //GENERAR CARTA: guardar en cookie los parametros con que fue generada la factibilidad para crear la carta.
                let usrprfl = cookieHandler.get('usrprfl');
                cookieHandler.set('myLetter',[this.state.factigisDireccion + ", " + this.state.factCartaComuna ,
                  this.state.factigisNombre + " " + this.state.factigisApellido,
                  usrprfl.NOMBRE_COMPLETO,
                  cb[1],
                  usrprfl.CARGO,
                  usrprfl.LUGAR_DE_TRABAJO,
                  usrprfl.DEPARTAMENTO,
                  usrprfl.COMUNA]);

                  window.open("factigisCarta.html");
                  //si no fue grabado mostrar que hubo problemas en modal
              }else{
                this.setState({
                  open: true,
                  problemsforAdding: cb[1],  numeroFactibilidad: '',
                  btnModalCloseStatus: false
                });
                //$("#iframeloadingAdd").hide();
                $(".drawer_progressBar").css('visibility','hidden');
              }
            });
            return;
          }
          console.log("Problemas de zonas:", factArr);
        }


      //si falta algun campo que rellenar se muestra una ventana modal.
      }else{
        this.setState({openModalValidator: true, problemsforAdding2: 'Por favor ingrese los campos que faltan (en rojo)'});

        if(this.state.visibilityStyle.selectPotencia.visibility=='hidden'){
          $(".factigisPotencia").css('border-style','initial').css('border-width','0px');
        }
        $(".drawer_progressBar").css('visibility','hidden');
      }
    });

  }

  openModal () { this.setState({open: true}); }

  closeModal () { this.setState({open: false});  this.onClickLimpiarDatos();}

  closeModalValidator(){
    this.setState({openModalValidator: false});
  }

  onClickLimpiarDatos(){
    var map = this.props.themap;
    map.graphics.clear();

    this.setState({
      btnModalCloseStatus: true,
      numeroFactibilidad: '',
      factCartaComuna: '',
      problemsforAdding: '',
      zonaConcesion: false,
      zonaCampamentos: false,
      zonaRestringida: false,
      zonaVialidad: false,
      zonaTransmision: false,
      factigis_geoCliente: '',
      factigis_geoPoste: '',
      factigis_geoDireccion: '',
      toggleCliente: 'OFF',
      togglePoste: 'OFF',
      toggleDireccion: 'OFF',
      toggleTramo: 'OFF',
      btnCliente: '',
      btnPoste: '',
      btnDireccion: '',
      btnTramo: '',
      factigisRut: '',
      factigisNombre: '',
      factigisApellido: '',
      factigisTelefono: '',
      factigisEmail: '',
      factigisRotulo: '',
      factigisTramo: '',
      factigisDireccion: '',  //per full name
      factigisIDDireccion: '', //per id dir
      factigisTipoEmpalme:'',
      factigisConexion: '',
      factigisComuna: '',
      factigis_tipoPotencia: [],
      factigis_cantidadEmpalmes: tipoCantidadEmpalmes,
      factigis_selectedValueCliente: '',
      factigis_selectedValueTipoContribuyente: '',
      factigis_selectedValueTipoEmpalme: '',
      factigis_selectedValueTipoEmpalmePotencia: '',
      factigis_selectedValueTipoEmpalmeBTMT: '',
      factigis_selectedValueTipoFase: '',
      factigis_selectedValueTipoPotencia: 0,
      factigisCantidadEmpalmes: '',
      factigisRutValidator: false,
      factigisNombreValidator: false,
      factigisApellidoValidator: false,
      factigisTelefonoValidator: false,
      factigisEmailValidator: false,
      factigisRotuloValidator: false,
      factigisTramoValidator: false,
      factigisDireccionValidator: false,  //per full name
      factigisIDDireccionValidator: false, //per id dir
      factigisCantidadEmpalmesValidator: false,
      //validators for ddls
      factigisTipoClienteValidator: false,
      factigisTipoContribuyenteValidator: false,
      factigisTipoEmpalmeValidator:false,
      factigisTipoFaseValidator: false,
      factigisTipoBTMTValidator: false,
      //validators for geometries
      factigis_geoClienteValidator: false,
      factigis_geoPosteValidator: false,
      factigis_geoDireccionValidator: false,
      btnPosteDisabled: true,
      btnDireccionDisabled: true,
      btnTramoDisabled: true,
      factigis_sed: '',
      factiTipoFactibilidad: 'FACTIBILIDAD DIRECTA',
      factigis_alimentador: '',
      factigisIDNodo: '',
      factigisZona: '',
      factigis_coci1: '',
      factigis_coci2: '',
      factigis_coci3: ''
    });

    $('.factigisRut').css('border-color','initial').css('border-style', 'groove');
    $('.factigisNombre').css('border-color','initial').css('border-style', 'groove');
    $('.factigisApellido').css('border-color','initial').css('border-style', 'groove');
    $('.factigisTelefono').css('border-color','initial').css('border-style', 'groove');
    $('.factigisEmail').css('border-color','initial').css('border-style', 'groove');
    $('.factigisTramo').css('border-color','initial').css('border-style', 'groove');
    $('.factigisCantidadEmpalmes').css('border-color','initial').css('border-style', 'groove');
    $('.factigisDireccion').css('border-color','initial').css('border-style', 'groove');
    $('.factigisRotulo').css('border-color','initial').css('border-style', 'groove');
    $('.factigis_tipoCliente').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_tipoContribuyente').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisTipoEmpalme').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_tipoFase').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_tipoPotencia').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisPotencia').css('border-color','initial').css('border-style', 'hidden');
    $('.factigisPotencia2').css('border-color','initial').css('border-style', 'groove');
    $('.factigisTipo').css('border-color','initial').css('border-style', 'hidden');
    $('.factigis_btnSelectCliente').css('border-color','initial').css('border-style', 'solid');
    $('.factigis_btnSelectPoste').css('border-color','initial').css('border-style', 'solid');
    $('.factigis_btnSelectDireccion').css('border-color','initial').css('border-style', 'solid');

    toggleOff('poste', this.state.btnPoste, this.state.togglePoste);
    toggleOff('direccion', this.state.btnDireccion, this.state.toggleDireccion);
    toggleOff('tramo', this.state.btnTramo, this.state.toggleTramo);
  }


  onKeyDownPositive(e){
    var number = document.getElementById('number');

    number.onkeydown = function(e) {
        if(!((e.keyCode > 95 && e.keyCode < 106)
          || (e.keyCode > 47 && e.keyCode < 58)
          || e.keyCode == 8)) {
            return false;
        }
    }
  }

  render(){

    //if theres no cookie, the user cannot be in dashboard.
    if(!cookieHandler.get('usrprmssns') || (!cookieHandler.get('usrprfl'))){
      window.location.href = "index.html";
      return;
    }
    return (
      <div className="wrapper_factigisAdd">
      <ProgressBar className="drawer_progressBar" type="linear" mode="indeterminate" />
      <Tabs onSelect={this.handleSelect} selectedIndex={this.state.selectedTab}>
        <TabList>
          {this.state.showA && <Tab><i className="fa fa-plus"></i></Tab>}
          {this.state.showB && <Tab><i className="fa fa-search" aria-hidden="true"></i></Tab>}
          {this.state.showC && <Tab><i className="fa fa-plus"></i> <i className="fa fa-home" aria-hidden="true"></i></Tab>}
          {this.state.showD && <Tab><i className="fa fa-map-signs" aria-hidden="true"></i></Tab>}
          {this.state.showE && <Tab><i className="fa fa-id-card-o" aria-hidden="true"></i></Tab>}

        </TabList>
        {/* Tab cliente */}
        {this.state.showA && <TabPanel>
          <div className="factigisVE_pasoDiv">
            <div className="factigisAdd_searchTitle">
              <h7><b>Ingrese datos del contacto y ubicación del medidor:</b></h7>
              <img className="factigisAdd_imgLoader" src={env.CSSDIRECTORY+"images/ajax-loader.gif"} alt="loading" id="iframeloadingAdd"/>
            </div>
            {/*<hr className="factigis_hr-subtitle factigis_hr"/>*/}
            <div className="factigis_BigGroupbox">
              {/*<h8>Rut:</h8>*/}
              <div className="factigis_groupbox">
                <input  id="factigis_txtRut" className="factigis-input factigisRut" onChange={this.onChange.bind(this)} onBlur={this.onBlur} value={this.state.factigisRut} title="Ingrese Rut e indique ubicación del cliente" type="text" placeholder="Ingrese Rut e indique ubicación del cliente"  />
                <button onClick={this.onClickCliente} className="factigis-selectFromMapButton factigis_btnSelectCliente btn btn-default" title="Ir " type="button" >
                  <span><i className="fa fa-map-marker"></i></span>
                </button>
                <h8 className="factigis__toggleBtnLabel">{this.state.toggleCliente}</h8>
              </div>

              <div className="factigis_groupbox">
                <div className="factigis_group">
                  <h8>Nombre Cliente:</h8>
                  <input id="factigis_txtNombre" onChange={this.onChange.bind(this)} value={this.state.factigisNombre} onBlur={this.onBlur} className="factigis-input factigis_input-solo factigisNombre" title="Escriba el nombre del cliente" type="text" placeholder="Nombre Completo"  />
                </div>

                <div className="factigis_group">
                  <h8>Apellido:</h8>
                  <input id="factigis_txtApellido" onChange={this.onChange.bind(this)} value={this.state.factigisApellido} onBlur={this.onBlur} className="factigis-input factigis_input-solo factigisApellido" title="Escriba el primer apellido del cliente" type="text" placeholder="Apellido Paterno"  />
                </div>
              </div>

              <div className="factigis_groupbox">
                <div className="factigis_group">
                  <h8>Telefono:</h8>
                  <input type="tel" id="factigis_txtTelefono" onKeyPress={this.onKeyTelefono.bind(this)}  maxLength="9"  className="factigis-input factigis_input-solo factigisTelefono" onChange={this.onChange.bind(this)}  value={this.state.factigisTelefono} onBlur={this.onBlur} title="Ingrese teléfono del cliente Ej.:(984031777) RF: (322222336)" placeholder="9 Dígitos, ej.: Cel: 984587445, RF: 322222336"  />
                </div>

                <div className="factigis_group">
                  <h8>Email:</h8>
                  <input id="factigis_txtEmail" className="factigis-input factigis_input-solo factigisEmail" onChange={this.onChange.bind(this)}  value={this.state.factigisEmail} onBlur={this.onBlur} title="Escriba el email de contacto" type="text" placeholder="ejemplo@email.com (No ingresar correo Chilquinta)"  />

                </div>
              </div>
              <div className="factigis_groupbox">
                <div className="factigis_group">
                  <h8>Tipo Cliente:</h8>
                  <Select className="ddlTipoCliente factigis_tipoCliente" name="form-field-name" options={this.state.factigis_tipoCliente} onChange={this.onChangeComboBox.bind(this,"tipoCliente")}
                    value={this.state.factigis_selectedValueCliente} simpleValue clearable={true} searchable={false} placeholder="Seleccione el tipo de cliente"/>
                </div>
                <div className="factigis_group">
                  <h8>Tipo Contribuyente:</h8>
                  <Select id="ddlTipoContribuyente" className="factigis_selectInput factigis_tipoContribuyente" name="form-field-name" options={this.state.factigis_tipoContribuyente} onChange={this.onChangeComboBox.bind(this,"tipoContribuyente")}
                    value={this.state.factigis_selectedValueTipoContribuyente} simpleValue clearable={true} searchable={false} placeholder="Seleccione el tipo de contribuyente"/>
                </div>
              </div>
            </div>
          </div>

          <div className="factigisVE_pasoDiv">
            <div className="factigisAdd_searchTitle">
              <h7><b>Seleccione datos de red para el estudio:</b></h7>
            </div>
            <div className="factigis_BigGroupbox">
              <h8>Rótulo Conexión:</h8>
              <div className="factigis_groupbox">
                <input id="factigis_txtRotulo" className="factigis-input factigisRotulo"  value={this.state.factigisRotulo} ref="rotuloValue" title="Poste o Cámara" disabled={true} type="text" placeholder="Poste o cámara encontrado" />
                <button onClick={this.onClickPoste.bind(this)} disabled={this.state.btnPosteDisabled} className="factigis-selectFromMapButton factigis_btnSelectPoste btn btn-default" title="Ir " type="button" >
                  <span><i className="fa fa-map-signs"></i></span>
                </button>
                <h8 className="factigis__toggleBtnLabel">{this.state.togglePoste}</h8>
              </div>
              <div className="factigis_groupbox">
              <div className="factigis_group">
              <h8>Nivel de Tensión:</h8>

                <div className="factigis_group " >
                  <Select id="dllTipoBTMT" className="factigis_selectEmpalme factigis_selectInput factigisTipo " name="dllTipoBTMT" options={this.state.factigis_tipoEmpalmeBTMT} onChange={this.onChangeComboBox.bind(this,"tipoEmpalmeBTMT")}
                  value={this.state.factigis_selectedValueTipoEmpalmeBTMT} simpleValue clearable={true} searchable={false} placeholder="Seleccione BT/MT"/>
                </div>
              </div>
              <div className="factigis_group">
                  <h8>Tramo de Conexión:</h8>
                <div className="factigis_group ">
                  <input id="factigis_txtTramo" value={this.state.factigisTramo} disabled={true} onChange={this.onChange.bind(this)} onBlur={this.onBlur} className="factigis-input factigis_input-solo factigisTramo factigisTramo2" title="Poste o Cámara" type="text" placeholder="Poste o cámara encontrado" />
                  <h8 className="factigis__toggleBtnLabel">{this.state.toggleDireccion}</h8>
                </div>
              </div>
                <div className="factigis_groupEspecial">
                <button onClick={this.onClickTramo.bind(this)} disabled={this.state.btnTramoDisabled} className="factigis-selectFromMapButton factigis_btnSelectTramo btn btn-default" title="Selecciona Tramo " type="button" >
                  <span><i className="fa fa-code-fork"></i></span>
                  <h8 className="factigis__toggleBtnLabel">{this.state.toggleTramo}</h8>
                </button>
                </div>
              </div>
              <h8>Dirección:</h8>
              <div className="factigis_groupbox">
                <input id="factigis_txtDireccion" className="factigis-input factigisDireccion" title="Dirección" disabled={true} type="text" placeholder="Dirección encontrada" value={this.state.factigisDireccion} />
                <button onClick={this.onClickDireccion} disabled={this.state.btnDireccionDisabled} className="factigis-selectFromMapButton factigis_btnSelectDireccion btn btn-default factigisDireccion" title="Selecciona Dirección " type="button" >
                  <span><i className="fa fa-home"></i></span>
                </button>
                <h8 className="factigis__toggleBtnLabel">{this.state.toggleDireccion}</h8>
              </div>
              <div className="factigis_groupbox">
                <div className="factigis_group">
                  <h8>Empalme:</h8>
                  <Select id="ddlTipoEmpalme" className="factigis_selectEmpalme factigis_selectInput factigisTipoEmpalme" name="ddlTipoEmpalme" options={this.state.factigis_tipoEmpalme} onChange={this.onChangeComboBox.bind(this,"tipoEmpalme")}
                    value={this.state.factigis_selectedValueTipoEmpalme} simpleValue clearable={true} searchable={false} placeholder="Seleccione tipo empalme"/>
                </div>
                <div className="factigis_group">
                  <h8>Fase:</h8>
                  <Select id="ddlFase" className="factigis_selectEmpalme factigis_selectInput factigis_tipoFase " name="ddlFase" options={this.state.factigis_tipoFase} onChange={this.onChangeComboBox.bind(this,"tipoFase")}
                    value={this.state.factigis_selectedValueTipoFase} simpleValue clearable={true} searchable={false} placeholder="Seleccione tipo fase"/>
                </div>
                <div className="factigis_group">
                  <h8>Potencia (kW):</h8>
                  <Select style={this.state.visibilityStyle.selectPotencia} onOpen={this.onOpen.bind(this)} id="ddlPotencia" disabled={false} className="factigis_selectEmpalme factigis_selectInput factigisPotencia " name="ddlPotencia" options={this.state.factigis_tipoPotencia} onChange={this.onChangeComboBox.bind(this,"tipoPotencia")}
                    value={this.state.factigis_selectedValueTipoPotencia} simpleValue clearable={true} searchable={false} placeholder="Seleccione potencia"/>
                  <input
                  style={this.state.visibilityStyle.txtPotencia}
                    id="factigis_txtPotencia"
                    value={this.state.factigis_selectedValueTipoPotencia}
                    disabled={false}
                    onChange={this.onChange.bind(this)}
                    onBlur={this.onBlur}
                    className="factigis-input factigis_input-solo factigisPotencia2"
                    title="Ingrese potencia"
                    placeholder="Potencia solicitada"
                    type="number"
                    min="0"
                  />

                </div>
              </div>
              <div className="factigis_groupbox">
                <div className="factigis_group factigis_radiobuttonGroup">
                  <input type="radio" id="factigis_checkEmpalmeDefinitivo" className="factigis_radiobutton" name="permanenciaEmpalme" value="DEFINITIVO" defaultChecked={this.state.radioEmpalmeDefinitivo} onChange={this.onChange.bind(this)} />Definitivo<br />
                  <input type="radio" id="factigis_checkEmpalmeProvisorio" className="factigis_radiobutton" name="permanenciaEmpalme" value="PROVISORIO" defaultChecked={this.state.radioEmpalmeProvisorio} onChange={this.onChange.bind(this)}/>Provisorio<br />
                </div>

                <div className="factigis_group">
                  <h8>Cantidad Empalmes:</h8>
                  <Select id="ddlCantidadEmpalmes" className="factigis_selectEmpalme factigis_selectInput factigisCantidadEmpalmes"
                    disabled={this.state.factigis_cantEmpalmesEnabled}  name="ddlPotencia" options={this.state.factigis_cantidadEmpalmes} onChange={this.onChangeComboBox.bind(this,"ddlCantidadEmpalmes")}
                    value={this.state.factigisCantidadEmpalmes} simpleValue clearable={true} searchable={false} placeholder="Seleccione cantidad"/>

                </div>
              </div>
              <div className="factigis_groupbox">
                <div className="factigis_group">
                  <h8>Clasificación:</h8>
                  <Select id="ddlClasificacion" className="factigis_selectEmpalme factigis_selectInput factigisCantidadEmpalmes"
                    name="ddlClasificacion" options={this.state.factigis_todasLasClasificaciones} onChange={this.onChangeComboBox.bind(this,"ddlClasificacion")}
                    value={this.state.factigisClasificacion} simpleValue clearable={true} searchable={false} placeholder="Seleccione clasificacion"/>
                </div>
              </div>
            </div>
            </div>
            <div className="factigisVE_pasoDiv">
              {/*<hr className="factigis_hr"/>*/}
              <div className="factigisAdd_searchTitle">
                <h7><b>Verifique restricciones para la emisión de certificado:</b></h7>
              </div>

              <div className="factigis_listbox">
                <ul className="factigis_ul">
                  <div>
                    <li>
                      <input type="checkbox" name="manager" id="manager" disabled="true" checked={this.state.zonaConcesion} />
                      <label htmlFor="manager" id="lblConcesion">Zona Concesión</label>
                    </li>
                    <li>
                      <input type="checkbox" name="csr" id="csr" disabled="true" checked={this.state.zonaTransmision} />
                      <label htmlFor="csr2" id="lblTransmision">Zona Transmisión</label>
                    </li>
                    <li>
                      <input type="checkbox" name="webdesigner" id="webdesigner" disabled="true" checked={this.state.zonaRestringida} />
                      <label htmlFor="webdesigner" id="lblRestringida">Zona Restringida</label>
                    </li>

                  </div>
                  <div>
                    <li>
                      <input type="checkbox" name="webdev" id="webdev"  disabled="true" checked={this.state.zonaVialidad}/>
                      <label htmlFor="webdev" id="lblVialidad">Zona Vialidad</label>
                    </li>
                    <li>
                      <input type="checkbox" name="csr" id="csr" disabled="true" checked={this.state.zonaCampamentos} />
                      <label htmlFor="csr" id="lblCampamentos">Zona Campamentos</label>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            {/*<hr className="factigis_hr"/>*/}
            <div className="factigis_buttons">
              <button onClick={this.onClickAgregarCliente.bind(this)}
                className="factigis_submitButton btn btn-success factigisBtnAgregar" title="Agregar Factibilidad " type="button" >
                <span><i className="fa fa-plus"></i> Agregar</span>
              </button>

              <button onClick={this.onClickLimpiarDatos.bind(this)}
                className="factigis_submitButton btn btn-info factigisBtnLimpiar" title="Limpiar campos " type="button" >
                <span><i className="fa fa-eraser" aria-hidden="true"></i> Limpiar</span>
              </button>
            </div>
              <Modal isOpen={this.state.open} style={customStyles}>
                <h2 className="factigis_h2">Factibilidad {this.state.numeroFactibilidad}</h2>
                <p>{this.state.problemsforAdding}</p>
                <br />
                <button disabled={this.state.btnModalCloseStatus} className="factigis_submitButton btn btn-info" onClick={this.closeModal.bind(this)}>Close</button>
              </Modal>
              <Modal isOpen={this.state.openModalValidator} style={customStyles}>
                <h2 className="factigis_h2">Factibilidad : Validador</h2>
                <p>{this.state.problemsforAdding2}</p>
                <br />
                <button disabled={this.state.btnModalValidator} className="factigis_submitButton btn btn-info" onClick={this.closeModalValidator.bind(this)}>Close</button>
              </Modal>
              </TabPanel>}

        {/* Tab busquedas */}
        {this.state.showB && <TabPanel>
          <Factigis_BusquedaFolio themap={this.props.themap} />
        </TabPanel>}

        {/* Tab direcciones */}
        {this.state.showC && <TabPanel>
          <Factigis_AddDireccion themap={this.props.themap} />
        </TabPanel>}

        {/* Tab direcciones */}
        {this.state.showD && <TabPanel>
          <Factigis_BusquedaPoste themap={this.props.themap} />
        </TabPanel>}

        {/* Tab busqueda por rut */}
        {this.state.showE && <TabPanel>
          <Factigis_BusquedaRut themap={this.props.themap} />
        </TabPanel>}

        </Tabs>

      </div>
    );
  }
}

export default Factigis_Add;
