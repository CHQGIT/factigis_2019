import token from '../services/token-service';
import myinfotemplate from '../utils/infoTemplates';
import mymap from '../services/map-service';
import {ap_infoWindow, factigis_tramosInfo} from '../utils/makeInfowindow';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import env from '../services/factigis_services/config';
import cookieHandler from 'cookie-handler';

var empresa_ = 'chilquinta';


function myLayers(){


  var graphicLayer = new GraphicsLayer;
  var serviceMain , serviceURL;

  if(env.BUILDFOR=="INTERNA"){
    serviceMain = env.SSL+'gisredeo.chilquinta.cl/public/';
  }else{
    serviceMain = env.SSL+'gisredeo.chilquinta.cl/public/';
  }
   serviceURL = serviceMain + 'rest/services/';


  return {
    read_service_url(){
      return serviceURL;
    },
    //Get the token used in the whole app.
    read_tokenURL(){ //using
      return "https://gisredeo.chilquinta.cl/portal/sharing/rest/generatetoken"
      //return serviceMain + "tokens/generateToken";
    },
    //Reads the permissions for each module
    read_logAccess(){
      return serviceURL + "ADMIN/LogAccesos/FeatureServer/2?f=json&token=" + token.read();
      //return serviceURL + "Admin/LogAccesos/FeatureServer/2";
    },
    //Shows the Chilquita Basemap for layerlist
    read_mapabase(){
      return serviceURL + "MapaBase/MapServer?f=json&token=" + token.read();
    },
    //dmps adresses
    read_cartography(){
      return serviceURL + "Cartografia/DMPS/MapServer?f=json&token=" + token.read();
    },
    save_graphicLayer(myGraphicsLayer){  /*using*/
      graphicLayer = myGraphicsLayer;
    },
    read_graphicLayer(){  /*using*/
      return graphicLayer;
    },
    write_logAccess(){  /*using*/
        return serviceURL + "Admin/LogAccesos/FeatureServer/1/applyEdits?f=json&token=" + token.read();
    },
    /* FACTIGIS LAYERS*/
    read_factigis_transmision(){
        return serviceURL + "Varios/FACTIBILIDAD/MapServer/0?f=json&token=" + token.read();
    },
    read_factigis_vialidad(){
        return serviceURL + "Test/Vialidad_test/MapServer/0?f=json&token=" + token.read();
    },
    read_factigis2(){
        return serviceURL + "Test/Vialidad_test/MapServer?f=json&token=" + token.read();
    },
    read_factigis_restringida(){
        return serviceURL + "Varios/ZONAS_RESTRICCION/MapServer/0?f=json&token=" + token.read();
    },
    read_campamentos(){
      return serviceURL + "MANTENIMIENTO/Otras_Capas/MapServer/4?f=json&token=" + token.read();
    },
    read_direcciones(){
      return serviceURL + "Cartografia/DMPS/MapServer/0?f=json&token=" + token.read();
    },
    read_direccionesNuevasMobile(){
      return serviceURL + "Mobile/Ingreso_externo_nuevo/MapServer?f=json&token=" + token.read();
    },
    read_calles(){
        return serviceURL + "MapaBase/MapServer/2?f=json&token=" + token.read();
    },
    read_direccionesNuevasQuery(){
      return serviceURL + "Mobile/Ingreso_externo_nuevo/FeatureServer/2?f=json&token=" + token.read();
    },
    read_comuna(){
        return serviceURL + "MapaBase/MapServer/4?f=json&token=" + token.read();
    },
    read_agregarFactibilidad(){
        return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/0?f=json&token=" + token.read();
    },
    read_factigisUserProfile(){
      return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/2?f=json&token=" + token.read();
    },
    read_factibilidad(){
        return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/MapServer?f=json&token=" + token.read();
    },
    read_updateFactibilidad(){
      return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/0/applyedits";
    },
    read_direccionesDyn(){
      return serviceURL + "Cartografia/DMPS/MapServer?f=json&token=" + token.read();
    },
    read_historial_factibilidad(){
      return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/1?f=json&token=" + token.read();
    },
    read_factigis_addDireccion(){
      return serviceURL + "Mobile/Ingreso_externo_nuevo/FeatureServer/2/applyedits";
    },
    read_factigis_addEstadoHistoria(){
      return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/1/applyedits";
    },
    read_factigis_addFactibilidad(){
      return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/0/applyedits";
    },
    read_logAccessFactigis(){
      return serviceURL + "ADMIN/LogAccesos/FeatureServer/1/applyedits";
    },
    read_chqTramosBT(){

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
          case 'chilquinta':
            return serviceURL + "Chilquinta_006/Tramos_006/MapServer/1?f=json&token=" + token.read();
          break;
          case 'litoral':
            return serviceURL + "Chilquinta_009/Tramos_009/MapServer/1?f=json&token=" + token.read();
          break;
          case 'linares':
            return serviceURL + "Chilquinta_031/Tramos_031/MapServer/1?f=json&token=" + token.read();
          break;
          case 'parral':
            return serviceURL + "Chilquinta_032/Tramos_032/MapServer/1?f=json&token=" + token.read();
          break;
          case 'casablanca':
            return serviceURL + "Chilquinta_028/Tramos_028/MapServer/1?f=json&token=" + token.read();
          break;
        default:

      }

    },
    read_chqTramosMT(){

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
        case 'chilquinta':
          return serviceURL + "Chilquinta_006/Tramos_006/MapServer/0?f=json&token=" + token.read();
        break;
        case 'litoral':
          return serviceURL + "Chilquinta_009/Tramos_009/MapServer/0?f=json&token=" + token.read();
        break;
        case 'linares':
          return serviceURL + "Chilquinta_031/Tramos_031/MapServer/0?f=json&token=" + token.read();
        break;
        case 'parral':
          return serviceURL + "Chilquinta_032/Tramos_032/MapServer/0?f=json&token=" + token.read();
        break;
        case 'casablanca':
          return serviceURL + "Chilquinta_028/Tramos_028/MapServer/0?f=json&token=" + token.read();
        break;
      }
    },
    read_subestaciones(){

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
        case 'chilquinta':
            return serviceURL + "Chilquinta_006/Equipos_pto_006/MapServer?f=json&token=" + token.read();
        break;
        case 'litoral':
            return serviceURL + "Chilquinta_009/Equipos_pto_009/MapServer?f=json&token=" + token.read();
        break;
        case 'linares':
            return serviceURL + "Chilquinta_031/Equipos_pto_031/MapServer?f=json&token=" + token.read();
        break;
        case 'parral':
            return serviceURL + "Chilquinta_032/Equipos_pto_032/MapServer?f=json&token=" + token.read();
        break;
        case 'casablanca':
            return serviceURL + "Chilquinta_028/Equipos_pto_028/MapServer?f=json&token=" + token.read();
        break;
      }
    },
    read_sep(){

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
        case 'chilquinta':
          return serviceURL + "Chilquinta_006/Equipos_pto_006/MapServer/1?f=json&token=" + token.read();
        break;
        case 'litoral':
          return serviceURL + "Chilquinta_009/Equipos_pto_009/MapServer/1?f=json&token=" + token.read();
        break;
        case 'linares':
          return serviceURL + "Chilquinta_031/Equipos_pto_031/MapServer/1?f=json&token=" + token.read();
        break;
        case 'parral':
          return serviceURL + "Chilquinta_032/Equipos_pto_032/MapServer/1?f=json&token=" + token.read();
        break;
        case 'casablanca':
          return serviceURL + "Chilquinta_028/Equipos_pto_028/MapServer/1?f=json&token=" + token.read();
        break;
      }
    },
    read_rotulos(){
          return serviceURL + "STANDARD/Nodos/MapServer?f=json&token=" + token.read();
    },
    read_rotulos2(){
          return serviceURL + "Chilquinta_006/Nodos_006/MapServer/0?f=json&token=" + token.read();
    },
    read_SSEE(){

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
        case 'chilquinta':
          return serviceURL + "Chilquinta_006/Equipos_pto_006/MapServer?f=json&token=" + token.read();
        break;
        case 'litoral':
          return serviceURL + "Chilquinta_009/Equipos_pto_009/MapServer?f=json&token=" + token.read();
        break;
        case 'linares':
          return serviceURL + "Chilquinta_031/Equipos_pto_031/MapServer?f=json&token=" + token.read();
        break;
        case 'parral':
          return serviceURL + "Chilquinta_032/Equipos_pto_032/MapServer?f=json&token=" + token.read();
        break;
        case 'casablanca':
          return serviceURL + "Chilquinta_028/Equipos_pto_028/MapServer?f=json&token=" + token.read();
        break;
      }
    },
    read_factigis_distribucion(){

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
        case 'chilquinta':
          return serviceURL + "Chilquinta_006/Concesiones006/MapServer/0?f=json&token=" + token.read();
        break;
        case 'litoral':
          return serviceURL + "Chilquinta_009/Concesiones009/MapServer/0?f=json&token=" + token.read();
        break;
        case 'linares':
          return serviceURL + "Chilquinta_031/Concesiones031/MapServer/0?f=json&token=" + token.read();
        break;
        case 'parral':
          return serviceURL + "Chilquinta_032/Concesiones032/MapServer/0?f=json&token=" + token.read();
        break;
        case 'casablanca':
          return serviceURL + "Chilquinta_028/Concesiones028/MapServer/0?f=json&token=" + token.read();
        break;
      }
    },
    read_ap_rotulos(){

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
        case 'chilquinta':
          return serviceURL + "Chilquinta_006/Nodos_006/MapServer/0?f=json&token=" + token.read();
        break;
        case 'litoral':
          return serviceURL + "Chilquinta_009/Nodos_009/MapServer/0?f=json&token=" + token.read();
        break;
        case 'linares':
          return serviceURL + "Chilquinta_031/Nodos_031/MapServer/0?f=json&token=" + token.read();
        break;
        case 'parral':
          return serviceURL + "Chilquinta_032/Nodos_032/MapServer/0?f=json&token=" + token.read();
        break;
        case 'casablanca':
          return serviceURL + "Chilquinta_028/Nodos_028/MapServer/0?f=json&token=" + token.read();
        break;


      }

    },
    read_layer_infoSED(){/*using for getting the sed information and location*/

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
        case 'chilquinta':
          return serviceURL + "Chilquinta_006/Equipos_pto_006/MapServer/1?f=json&token=" + token.read();
        break;
        case 'litoral':
          return serviceURL + "Chilquinta_009/Equipos_pto_009/MapServer/1?f=json&token=" + token.read();
        break;
        case 'linares':
          return serviceURL + "Chilquinta_031/Equipos_pto_031/MapServer/1?f=json&token=" + token.read();
        break;
        case 'parral':
          return serviceURL + "Chilquinta_032/Equipos_pto_032/MapServer/1?f=json&token=" + token.read();
        break;
        case 'casablanca':
          return serviceURL + "Chilquinta_028/Equipos_pto_028/MapServer/1?f=json&token=" + token.read();
        break;


      }

    },
    read_layerAlimentador(){  /*using*/

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
          case 'chilquinta':
            return serviceURL + "Chilquinta_006/Tramos_006/MapServer?f=json&token=" + token.read();
          break;
          case 'litoral':
            return serviceURL + "Chilquinta_009/Tramos_009/MapServer?f=json&token=" + token.read();
          break;
          case 'linares':
            return serviceURL + "Chilquinta_031/Tramos_032/MapServer?f=json&token=" + token.read();
          break;
          case 'parral':
            return serviceURL + "Chilquinta_032/Tramos_032/MapServer?f=json&token=" + token.read();
          break;
          case 'casablanca':
            return serviceURL + "Chilquinta_028/Tramos_032/MapServer?f=json&token=" + token.read();
          break;

      }

    },
    read_layer_nisInfo(){

        var e = cookieHandler.get('usrprfl');
        empresa_ = e.EMPRESA;

      switch (empresa_) {
        case 'chilquinta':
            return serviceURL + "Chilquinta_006/ClientesV2/MapServer/0?f=json&token=" + token.read();
        break;
        case 'litoral':
            return serviceURL + "Chilquinta_009/ClientesV2/MapServer/0?f=json&token=" + token.read();
        break;
        case 'linares':
            return serviceURL + "Chilquinta_031/ClientesV2/MapServer/0?f=json&token=" + token.read();
        break;
        case 'parral':
            return serviceURL + "Chilquinta_032/ClientesV2/MapServer/0?f=json&token=" + token.read();
        break;
        case 'casablanca':
            return serviceURL + "Chilquinta_028/ClientesV2/MapServer/0?f=json&token=" + token.read();
        break;

      }

    },
    read_obrasAdicionales(){
      return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/4?f=json&token=" + token.read();
    },
    read_addSGOCertificate(){
      return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/4/applyedits";
    },
    read_cortocircuito_sed(){
      return serviceURL + "FACTIBILIDAD/"+env.SAVEAPPLICATIONMODULE+"/FeatureServer/3?f=json&token=" + token.read();
    }

  };
}

//TO DO: this function sets the layers that will be added in the app, integrating the infowindow and their special properties.
function setLayers(){
  //check n°7
  return {
    alimentadores(){
      var layerAlimentador = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_layerAlimentador(),{id:"gis_alimentadores"});
      layerAlimentador.setImageFormat("png32");
      layerAlimentador.setVisibleLayers([0]);
      layerAlimentador.setInfoTemplates({
        0: {infoTemplate: myinfotemplate.getAlimentadorInfoWindow()}
      });

      return layerAlimentador;
    },
    interrupciones(){
      var interrClienteSED = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_dyn_layerClieSED(),{id:"po_interrupciones"});
      interrClienteSED.setInfoTemplates({
        3: {infoTemplate: myinfotemplate.getNisInfo()},
        1: {infoTemplate: myinfotemplate.getIsolatedNisFailure()},
        0: {infoTemplate: myinfotemplate.getSubFailure()}
      });
      interrClienteSED.refreshInterval = 1;
      interrClienteSED.setImageFormat("png32");
      interrClienteSED.on('update-end', (obj)=>{
        if(obj.error){
          console.log("Redirecting to login page, token for this session is ended...");
          window.location.href = "index.html";
        }
      });
        return interrClienteSED;
    },
    cuadrillas(){
      var cuadrillasLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_dyn_layerClieSED(),{id:"po_cuadrillas"});
      /*cuadrillasLayer.setInfoTemplates({
        3: {infoTemplate: myinfotemplate.getNisInfo()},
        1: {infoTemplate: myinfotemplate.getIsolatedNisFailure()},
        0: {infoTemplate: myinfotemplate.getSubFailure()}
      });
      */
      //interrClienteSED.refreshInterval = 1;
      cuadrillasLayer.setImageFormat("png32");
      return cuadrillasLayer;
    },
    ap_comuna(whereRegion){
      var apComunaLayer = new esri.layers.FeatureLayer(myLayers().read_ap_comuna(),{id:"ap_comuna"});
      apComunaLayer.setDefinitionExpression(whereRegion);
      console.log(whereRegion);
      return apComunaLayer;
    },
    ap_modificaciones(whereRegion, layerNumber){
      var apModificacionesLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_ap_modificaciones(),{id:"ap_modificaciones"});
      apModificacionesLayer.setImageFormat("png32");
      apModificacionesLayer.setVisibleLayers([0]);
      var layerDefinitions = [];
      layerDefinitions[0] = whereRegion;
      apModificacionesLayer.setLayerDefinitions(layerDefinitions);

      return apModificacionesLayer;
    }/*,
    ap_luminarias(whereRegion, layerNumber){
      var apLuminariasLayer = new esri.layers.FeatureLayer(myLayers().read_ap_luminarias(),{id:"ap_luminarias",
      mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      minScale: 9000,
      outFields: ["*"]});
      apLuminariasLayer.setDefinitionExpression(whereRegion);

      //ON MOUSE OVER EVENT
      apLuminariasLayer.on('mouse-over',(evt)=>{

        ap_infoWindow(evt.graphic.attributes['ID_LUMINARIA'],
          evt.graphic.attributes['ROTULO'],
          evt.graphic.attributes['TIPO_CONEXION'],
          evt.graphic.attributes['TIPO'],
          evt.graphic.attributes['PROPIEDAD'],
          evt.graphic.attributes['MEDIDO_TERRENO'],
          evt.graphic.geometry);

      });
      apLuminariasLayer.on('click', (evt)=>{
        ap_showEditor(evt);
      });

      return apLuminariasLayer;
    },
    */
    ,
    ap_luminarias(whereRegion, layerNumber){
      var apLuminariasLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_ap_luminarias(),{id:"ap_luminarias",
      minScale: 9000});
      apLuminariasLayer.setImageFormat("png32");
      apLuminariasLayer.setVisibleLayers([1,2]);
      var layerDefinitions = [];
      layerDefinitions[1] = whereRegion;
      layerDefinitions[2] = whereRegion;

      apLuminariasLayer.setLayerDefinitions(layerDefinitions);

      /*//ON MOUSE OVER EVENT
      apLuminariasLayer.on('mouse-over',(evt)=>{

        ap_infoWindow(evt.graphic.attributes['ID_LUMINARIA'],
          evt.graphic.attributes['ROTULO'],
          evt.graphic.attributes['TIPO_CONEXION'],
          evt.graphic.attributes['TIPO'],
          evt.graphic.attributes['PROPIEDAD'],
          evt.graphic.attributes['MEDIDO_TERRENO'],
          evt.graphic.geometry);

      });
      apLuminariasLayer.on('click', (evt)=>{
        ap_showEditor(evt);
      });
      */
      return apLuminariasLayer;
    },
    ap_tramos(whereRegion, layerNumber){
      var apTramosLayer = new esri.layers.FeatureLayer(myLayers().read_ap_tramos(),{id:"ap_tramos",
      mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      minScale: 9000});

      apTramosLayer.setDefinitionExpression(whereRegion);
      console.log(whereRegion);

      return apTramosLayer;
    },
    /* factigis module */
    factigis_transmision(whereRegion, layerNumber){
      var fDistribucionsLayer = new esri.layers.FeatureLayer(myLayers().read_factigis_transmision(),{id:"factigis_transmision"
      });

      return fDistribucionsLayer;
    },
    factigis_distribucion(whereRegion, layerNumber){
      var fTransmisionLayer = new esri.layers.FeatureLayer(myLayers().read_factigis_distribucion(),{id:"factigis_distribucion",
      opacity:0.3
      });
      //fTransmisionLayer.setImageFormat("png32");
      //fTransmisionLayer.setVisibleLayers([1]);
      return fTransmisionLayer;
    },
    factigis_restringida(whereRegion, layerNumber){
      var fRestringidaLayer = new esri.layers.FeatureLayer(myLayers().read_factigis_restringida(),{id:"factigis_restringida",
      opacity:0.7
      });
      //fTransmisionLayer.setImageFormat("png32");
      //fTransmisionLayer.setVisibleLayers([1]);
      return fRestringidaLayer;
    },
    factigis_vialidad(whereRegion, layerNumber){
      var fVialidadsLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_factigis2(),{id:"factigis_vialidad",
      opacity:0.3});
      fVialidadsLayer.setVisibleLayers([0]);
      fVialidadsLayer.setImageFormat("png32");
      return fVialidadsLayer;
    },
    gis_SSEE(whereRegion, layerNumber){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_SSEE(),{id:"gis_SSEE"});
      fSSEELayer.setVisibleLayers([0]);
      fSSEELayer.setImageFormat("png32");
      return fSSEELayer;
    },
    gis_campamentos(whereRegion, layerNumber){
      var fcampamentosLayer = new esri.layers.FeatureLayer(myLayers().read_campamentos(),{id:"gis_campamentos",
      mode: esri.layers.FeatureLayer.MODE_ONDEMAND});

      return fcampamentosLayer;
    },
    gis_rotulos(){
      var frotulosLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_rotulos(),{id:"gis_rotulos"});
      frotulosLayer.setVisibleLayers([0]);
      frotulosLayer.setImageFormat("png32");
      return frotulosLayer;
    },
    gis_direcciones(){
      var fdireccionesLayer = new esri.layers.FeatureLayer(myLayers().read_direcciones(),{id:"gis_direcciones",
      outFields: ["id_direccion","comuna","nombre_calle","numero"]});

      return fdireccionesLayer;
    },
    gis_cartografia(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_cartography(),{id:"gis_cartografia"});
      fSSEELayer.setVisibleLayers([0]);
      fSSEELayer.setImageFormat("png32");
      return fSSEELayer;

    },
    gis_chqbasemap(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_mapabase(),{id:"gis_chqbasemap"});

      fSSEELayer.setImageFormat("png32");
      return fSSEELayer;

    },
    mobile_direccionesNuevas(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_direccionesNuevasMobile(),{id:"mobile_direccionesNuevas",
      minScale: 3000});
      fSSEELayer.setImageFormat("png32");
      fSSEELayer.setVisibleLayers([2]);
      return fSSEELayer;

    },
    factigis_subestaciones(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_subestaciones(),{id:"factigis_subestaciones",
      minScale: 3000});
      fSSEELayer.setImageFormat("png32");
      fSSEELayer.setVisibleLayers([1]);
      return fSSEELayer;
    },
    factigis_MT(){
      var e = '006';
      switch (empresa_) {
        case 'chilquinta':
          e = '006'
        break;
        case 'litoral':
          e = '009'
        break;
        case 'linares':
          e = '031'
        break;
        case 'parral':
          e = '032'
        break;
        case 'casablanca':
          e = '028'
        break;

      }
      var fSSEELayer = new esri.layers.FeatureLayer(myLayers().read_chqTramosMT(),{
        id:"factigis_MT",
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        minScale: 4000,
        outFields: [
          `ARCGIS.DBO.Tramos_MT_${e}.id`,
          `ARCGIS.DBO.Tramos_MT_${e}.alimentador`,
          `ARCGIS.DBO.Tramos_MT_${e}.comuna`,
          `ARCGIS.DBO.Tramos_MT_${e}.tipo`,
          `ARCGIS.DBO.Tramos_MT_${e}.propiedad`,
          `ARCGIS.DBO.Tramos_MT_${e}.catalogo`,
          `ARCGIS.DBO.Tramos_MT_${e}.descripcion`,
          `ARCGIS.DBO.Tramos_MT_${e}.tension`,
          `ARCGIS.DBO.Tramos_MT_${e}.fecha`
        ]});

        fSSEELayer.on('click',(event)=>{
          console.log(event);

          factigis_tramosInfo("MT",
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.id`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.alimentador`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.comuna`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.tipo`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.propiedad`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.catalogo`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.descripcion`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.tension`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.fecha`],
            event.graphic.attributes[`ARCGIS.DBO.Tramos_MT_${e}.sed`],
            event.mapPoint);
        });



      return fSSEELayer;

    },
    factigis_BT(){
      var fSSEELayer = new esri.layers.FeatureLayer(myLayers().read_chqTramosBT(),{id:"factigis_BT", mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      minScale: 4000, outFields: ["*"]});
      fSSEELayer.on('click',(event)=>{
        console.log(event);

        factigis_tramosInfo("BT",event.graphic.attributes['id_tramo'],
          event.graphic.attributes['alimentador'],
          event.graphic.attributes['comuna'],
          event.graphic.attributes['tipo'],
          event.graphic.attributes['propiedad'],
          event.graphic.attributes['catalogo'],
          event.graphic.attributes['descripcion'],
          event.graphic.attributes['tension'],
          event.graphic.attributes['fecha'],
          event.graphic.attributes['sed'],
          event.mapPoint);
      });
      return fSSEELayer;

    }
  }
}

//TO DO: this function can be used to know the active layers in the map.
function layersActivated(){
  var activeLayers= [];
  var mapp = mymap.getMap();
  var activeLayersLength = mapp.layerIds.length;
  //console.log(mapp.layerIds.length);
  return {
    getMapLayers() {
      for (var j=0; j<activeLayersLength; j++) {
        var currentLayer = mapp.getLayer(mapp.layerIds[j]);
        activeLayers.push(currentLayer.id);
        //alert("id: " + currentLayer.id);
      }
      console.log("Layers actived" ,activeLayers);
      return activeLayers;

    }
  }
}

// TO DO: this function add the default and not defaults layer (from the LayerList) in the app.
function addCertainLayer(layerNameToAdd, order, where, callback){
  //checkbox setup n° 6
  var mapp = mymap.getMap();
  var myLayerToAdd;

  console.log("adding layer: ", layerNameToAdd,order);

  switch (layerNameToAdd) {

    case 'ap_comuna':
      myLayerToAdd = setLayers().ap_comuna(where, 4);
    break;

    case 'po_interrupciones':
      myLayerToAdd = setLayers().interrupciones();
    break;

    case 'gis_alimentadores':
      myLayerToAdd = setLayers().alimentadores();
    break;

    case 'ap_luminarias':
      myLayerToAdd = setLayers().ap_luminarias(where,6);
    break;

    case 'ap_modificaciones':
      myLayerToAdd = setLayers().ap_modificaciones(where,7);
    break;

    case 'ap_tramos':
      myLayerToAdd = setLayers().ap_tramos(where,5);
    break;

    case 'factigis_transmision':
      myLayerToAdd = setLayers().factigis_transmision(where,order);
    break;

    case 'factigis_distribucion':
      myLayerToAdd = setLayers().factigis_distribucion(where,order);
    break;

    case 'factigis_vialidad':
      myLayerToAdd = setLayers().factigis_vialidad(where,order);
    break;

    case 'gis_SSEE':
      myLayerToAdd = setLayers().read_SSEE(where,order);
    break;
    case 'gis_campamentos':
      myLayerToAdd = setLayers().read_campamentos(where,order);
    break;
    case 'gis_direcciones':
      myLayerToAdd = setLayers().gis_direcciones(where,order);
    break;
    case 'gis_cartografia':
      myLayerToAdd = setLayers().gis_cartografia(where,order);
    break;
    case 'gis_rotulos':
      myLayerToAdd = setLayers().gis_rotulos(where,order);
    break;
    case 'gis_chqbasemap':
      myLayerToAdd = setLayers().gis_chqbasemap(where,order);
    break;
    case 'mobile_direccionesNuevas':
      myLayerToAdd = setLayers().mobile_direccionesNuevas(where,order);
    break;
    case 'factigis_subestaciones':
      myLayerToAdd = setLayers().factigis_subestaciones(where,order);
    break;
    case 'factigis_MT':
      myLayerToAdd = setLayers().factigis_MT(where,order);
    break;
    case 'factigis_BT':
      myLayerToAdd = setLayers().factigis_BT(where,order);
    break;
    default:
  }

  mapp.addLayer(myLayerToAdd,order);

  //Set here if you add more layers in the LayerList.
  //checkbox setup n° 5
  if (check_alimentador.checked){
    mapp.addLayer(setLayers().alimentadores(),1);
  }
  if (check_ap_modificaciones.checked){
    mapp.addLayer(setLayers().ap_modificaciones(), 1);
  }
  if (check_factigis_distribucion.checked){
    mapp.addLayer(setLayers().factigis_distribucion(), 1);
  }
  if (check_factigis_transmision.checked){
    mapp.addLayer(setLayers().factigis_transmision(), 1);
  }
  if (check_factigis_vialidad.checked){
    mapp.addLayer(setLayers().factigis_vialidad(), 1);
  }
  if (check_SSEE.checked){
    mapp.addLayer(setLayers().SSEE(), 1);
  }
  if (check_campamentos.checked){
    mapp.addLayer(setLayers().campamentos(), 1);
  }
  if (check_chqbasemap.checked){
    mapp.addLayer(setLayers().gis_chqbasemap(), 1);
  }
  if (check_subestaciones.checked){
    mapp.addLayer(setLayers().factigis_subestaciones(), 1);
  }
  if (check_MT.checked){
    mapp.addLayer(setLayers().factigis_MT(), 1);
  }
  if (check_BT.checked){
    mapp.addLayer(setLayers().factigis_BT(), 1);
  }
  if (check_Postes.checked){
    mapp.addLayer(setLayers().gis_rotulos(), 1);
  }

  callback(myLayerToAdd);
}
export default myLayers();
export {setLayers,layersActivated,addCertainLayer};
