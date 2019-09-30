import React from 'react';
import ReactDOM from 'react-dom';
import Factigis_Add from '../factigis/Factigis_Add.jsx';
import mymap from '../../services/map-service';
import LayerList from '../../components/LayerList.jsx';
import layers from '../../services/layers-service';
import FModal from '../factigis/Factigis_Modal.jsx';
import cookieHandler from 'cookie-handler';
import BasemapToggle from "esri/dijit/BasemapToggle";
import {Navbar, Nav, NavItem, NavDropdown, DropdownButton,FormGroup,FormControl, MenuItem,Breadcrumb, CollapsibleNav} from 'react-bootstrap';
import Search from 'esri/dijit/Search';
import {saveGisredLogin, getFormatedDate, capitalize} from '../../services/login-service';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import env from '../../services/factigis_services/config';
import {Button} from 'react-toolbox/lib/button';
/**
 * @class La clase Factigis crea nuevas instancias con un radio y altura determinada
 */


class Factigis extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      themap: {},
      permissions: []
    }
  }
  //Dependiendo si hay permisos de usuario o no, redirecciona a la web principal.
  componentWillMount(){
    if(!cookieHandler.get('usrprmssns')){
      window.location.href = "index.html";
      return;
    }

    if(!cookieHandler.get('usrprmssns').length){
      window.location.href = "index.html";
      return;
    }

    let modulePermissions = cookieHandler.get('usrprmssns');
    let widgetPermissions = modulePermissions.map(wp=>{
      return wp.widget;
    });
    //console.log("my w.permis",widgetPermissions);
    this.setState({permissions: widgetPermissions});
  }
  //Agrega los layers para ser mostrados.
  componentDidMount(){
    var user = cookieHandler.get('usrprfl');
    var empresaCapitalized = capitalize(user.EMPRESA.toString());
    console.log(empresaCapitalized,"capitalized")
   
    var mapp = mymap.createMap("factigis_map_div","topo",-71.2905 ,-33.1009,9);
    this.setState({themap: mapp});

    //Add layer for old addresses
    var layerDirecciones = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_direccionesDyn(),{id:"factigis_direcciones"});
    layerDirecciones.setImageFormat("png32");
    layerDirecciones.setVisibleLayers([0]);

    mapp.addLayer(layerDirecciones);

    // add layer for new ones
    var layerDireccionesNew = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_direccionesNuevasMobile(),{id:"factigis_direccionesNew", minScale: 15000});
    layerDireccionesNew.setImageFormat("png32");
    layerDireccionesNew.setVisibleLayers([2]);
    mapp.addLayer(layerDireccionesNew);
  
    // add layer for pipes
    var layerRotulos = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_rotulos(),{id:"factigis_rotulos"});
    console.log(user.EMPRESA,"empresa?")
    layerRotulos.setImageFormat("png32");
    layerRotulos.setVisibleLayers([0]);
    var layerDefs = [];
    layerDefs[0] = "tipo_nodo ='ele!poste' or tipo_nodo='ele!camara' and nm_empresa='"+ empresaCapitalized +"'";
    layerRotulos.setLayerDefinitions(layerDefs);
    mapp.addLayer(layerRotulos,2);

    var toggle = new BasemapToggle({
      map: mapp,
      basemap: "hybrid"
    }, "BasemapToggle");
    toggle.startup();

    var search = new Search({
      map: mapp
      }, "search");
    search.startup();

    const page = env.SAVEAPPLICATIONNAME;
    const module = "FACTIGIS_CREAR_FACTIBILIDAD";
    const date = getFormatedDate();

    const myToken = cookieHandler.get('tkn');

    //console.log(user['USUARIO']);
  saveGisredLogin(user['USUARIO'],date,page,module,myToken);

  }

  onLoggOff(){
      cookieHandler.remove('myLetter');
      cookieHandler.remove('usrprfl');
      cookieHandler.remove('usrprmssns');
      cookieHandler.remove('wllExp');
      localStorage.removeItem('token');
      window.location.href = "index.html";
  }

  onClickDashboard(e){
    if(e==""){
        return;
    }
      window.location.href = e;
  }
  
  render(){
    let whoLogged = cookieHandler.get('usrprfl');
    whoLogged = whoLogged.NOMBRE_COMPLETO.split(" ");
    let src = env.CSSDIRECTORY+'images/logo_factigis.png';
    const factigisRender =
          <div className="wrapper_factigis">
            <Panel>
              <AppBar>
                <div className="wrapperTop">
                  <div className="logo_content">
                    <img className="img_logo" src={src} ></img>
                    <div className="breadcrumbs_custom">
                      <Button className="btn_dashboard" icon='home' label='Inicio' accent onClick={this.onClickDashboard.bind(this,"index.html")}  />
                      <Button className="btn_dashboard" icon='explore' label='Dashboard' accent onClick={this.onClickDashboard.bind(this,"factigisDashboard.html")}  />
                      <Button className="btn_dashboard" icon='note_add' label={'Crear Factibilidad'} accent onClick={this.onClickDashboard.bind(this,"")}/>
                       <div id="search"></div>
                    </div>
                  </div>
                  <div className="welcome_logout_wrapper">
                    <h6>Bienvenido:  {whoLogged[0]}</h6>
                    <IconButton icon='settings_power' inverse={ true } onClick={this.onLoggOff.bind(this)}/>
                  </div>
                </div>
              </AppBar>
            </Panel>

            <div className="wrapper_factibilidadContent">
              <div className="wrapper_factibilidadLeft">
                <Factigis_Add themap={this.state.themap} permissions={this.state.permissions}/>
              </div>
              <div className="wrapper_factibilidadRight">
                <LayerList show={["check_factigis_transmision", "check_factigis_distribucion", "check_factigis_vialidad", "check_campamentos", "check_factigis_restringida","check_chqbasemap",
                "check_subestaciones","check_MT","check_BT"]} />
                <div className="factigis_map_div" id="factigis_map_div">
                  <div id="BasemapToggle" ></div>
                </div>
              </div>
            </div>
          </div>

    if(!cookieHandler.get('usrprmssns')){
      window.location.href = "index.html";
      return;
    }else {
      return (
        <div className="factigis_f">{factigisRender}</div>
      );
    }


  }
}

export default Factigis;
