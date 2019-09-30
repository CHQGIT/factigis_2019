import layers from '../../services/layers-service';
import token from '../../services/token-service';
import cookieHandler from 'cookie-handler';
import {capitalize} from '../../services/login-service';

function crearRectangulo(geometry,delta){
  var rectangulo = new esri.geometry.Polygon(new esri.SpatialReference(geometry.spatialReference));
    rectangulo.addRing([ [geometry.x-1,geometry.y-1],[geometry.x-1,geometry.y+1],[geometry.x+1,geometry.y+1],[geometry.x+1,geometry.y-1],[geometry.x-1,geometry.y-1] ])

		return rectangulo;
}

function factigis_findDireccion(geometry,callback){

  var myRectangulo = crearRectangulo(geometry,1);
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_direcciones());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["id_direccion","nombre_calle","numero","comuna"];
  qInterruptions.geometry = myRectangulo;
  qInterruptions.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;

  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    console.log(featureSet.features.length);
    if(!featureSet.features.length){
      return callback([]);
    }
    callback(featureSet.features);
  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for direccion");
    callback([]);
  });
}

function factigis_findRotulo(geometry,callback){
  var user = cookieHandler.get('usrprfl');
  var empresaCapitalized = capitalize(user.EMPRESA.toString());
  var myRectangulo = crearRectangulo(geometry,1);
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_rotulos2());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["*"];
  qInterruptions.geometry = myRectangulo;
  qInterruptions.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
  qInterruptions.where = "tipo_nodo = 'ele!poste' or tipo_nodo='ele!camara' and empresa = '"+ empresaCapitalized + "'";
  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    console.log(featureSet.features, "findrotulo")
    if(!featureSet.features.length){
      return callback([]);
    }
    return callback(featureSet.features);
  }, (Errorq)=>{
    console.log("Error doing query for rotulos");
    return callback([]);
  });
}

function factigis_findTramoBT(geometry, callback){
  console.log("buscando en bt");

  var myRectangulo = crearRectangulo(geometry,1);
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_chqTramosBT());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["*"];
  qInterruptions.geometry = myRectangulo;
  qInterruptions.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;

  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    if(!featureSet.features.length){
      return callback([]);
    }
    return callback(featureSet.features);


  }, (Errorq)=>{
    console.log("Error doing query for tramos bt");
    return callback([]);
  });
}

function factigis_findTramoMT(geometry,callback){
  console.log("buscando en mt");

  var myRectangulo = crearRectangulo(geometry,1);
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_chqTramosMT());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["*"];
  qInterruptions.geometry = myRectangulo;
  qInterruptions.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;

  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    if(!featureSet.features.length){
      return callback([]);
    }
    return callback(featureSet.features);

    //  console.log("en mt encontre:",featureSet);
  }, (Errorq)=>{
    console.log("Error doing query for tramos mt");
     return callback([]);
  });
}

function factigis_findTramo(geometry, tramo, callback){
  console.log(geometry,"esto es lo que tengo.");

  //BUSCAR EN BT PRIMERO
  if(tramo=='BT'){
    console.log("buscando en bt...");
    var btFound = factigis_findTramoBT(geometry, bt=>{
      if(!bt.length){
        console.log("no hay nada en bt");
        let redBT = [];
        redBT.descripcion = 'N/A';
        redBT.tension = 'N/A';
        redBT.tipoFactibilidad = 'FACTIBILIDAD ASISTIDA';
        return callback(redBT);
      }else{
        let redBT = [];
        redBT.descripcion = bt[0].attributes['descripcion'];
        redBT.tension = 'N/A';
        redBT.tipoFactibilidad = '';
        return callback(redBT);
      }
    });

  //BUSCAR EN MT
  }else {
    var mtFound = factigis_findTramoMT(geometry, mt=>{
      if(!mt.length){
        console.log("no hay nada en mt");
        let redMT = [];
        redMT.descripcion = 'N/A';
        redMT.tension = 'N/A';
        redMT.tipoFactibilidad = 'FACTIBILIDAD ASISTIDA';
        return callback(redMT);
      }else{
        console.log("esto encontre en mt", mt);
        let redMT = [];

        var empresa = cookieHandler.get('usrprfl').EMPRESA;

        switch (empresa) {
          case 'chilquinta':
            redMT.descripcion = mt[0].attributes['ARCGIS.DBO.Tramos_MT_006.descripcion'];
            redMT.tension = mt[0].attributes['ARCGIS.DBO.Cabeceras_006.tension'];
          break;

          case 'linares':
            redMT.descripcion = mt[0].attributes['ARCGIS.DBO.Tramos_MT_031.descripcion'];
            redMT.tension = mt[0].attributes['ARCGIS.DBO.Cabeceras_031.tension'];
          break;
          case 'parral':
            redMT.descripcion = mt[0].attributes['ARCGIS.DBO.Tramos_MT_032.descripcion'];
            redMT.tension = mt[0].attributes['ARCGIS.DBO.Cabeceras_032.tension'];
          break;
          case 'casablanca':
            redMT.descripcion = mt[0].attributes['ARCGIS.DBO.Tramos_MT_028.descripcion'];
            redMT.tension = mt[0].attributes['ARCGIS.DBO.Cabeceras_028.tension'];
          break;
          case 'litoral':
            redMT.descripcion = mt[0].attributes['ARCGIS.DBO.Tramos_MT_009.descripcion'];
            redMT.tension = mt[0].attributes['ARCGIS.DBO.Cabeceras_009.tension'];
          break;

          default:

        }

        redMT.tipoFactibilidad = 'FACTIBILIDAD DIRECTA';
        return callback(redMT);
      }
    });
  }
}

function factigis_findCalle(geometry,callback){

  var myRectangulo = crearRectangulo(geometry,10);
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_calles());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["OBJECTID","nombre"];
  qInterruptions.geometry = myRectangulo;
  qInterruptions.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;

  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    if(!featureSet.features.length){
      return callback([]);
    }
    callback(featureSet.features);
  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for direccion");
    callback([]);
  });
}

function factigis_findNewDireccion(geometry, callback){
  var myRectangulo = crearRectangulo(geometry,1);
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_direccionesNuevasQuery());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["*"];
  qInterruptions.geometry = myRectangulo;
  qInterruptions.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;

  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    console.log("EN NEW",featureSet.features.length);
    if(!featureSet.features.length){
      return callback([]);
    }
    callback(featureSet.features);
  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for new direccion");
    callback([]);
  });

}

function factigis_findComuna(geometry, callback){
  var myRectangulo = crearRectangulo(geometry,1);
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_comuna());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["*"];
  qInterruptions.geometry = myRectangulo;
  qInterruptions.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;

  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    console.log(featureSet.features.length, featureSet, "tengo elementos..");
    if(!featureSet.features.length){
      return callback([]);
    }
    callback(featureSet.features);
  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for comuna");
    callback([]);
  });
}

function factigis_findFolio(folio, callback){

  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_agregarFactibilidad());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["*"];
  qInterruptions.where = "OBJECTID =" + folio

  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{

    if(!featureSet.features.length){
      return callback([]);
    }

    callback(featureSet.features);
  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for folio");
    callback([]);
  });
}

function factigis_findRotuloByNumber(numero, tipo, callback){
  
  var user = cookieHandler.get('usrprfl');
  var empresaCapitalized = capitalize(user.EMPRESA.toString());
  //tipo_nodo ='ele!camara' and rotulo='B8380'
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_rotulos2());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["*"];
  qInterruptions.where = "tipo_nodo= '"+ tipo +"'AND rotulo ='"+ numero +"' and empresa = '"+ empresaCapitalized +"'";
  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    console.log(featureSet);
    if(!featureSet.features.length){
      return callback([]);
    }
    return callback(featureSet.features);
  }, (Errorq)=>{
    console.log("Error doing query for rotulos by number");
    return callback([]);
  });
}


function factigis_searchFolioByRut(rut, callback){
  var qTaskInterruptions = new esri.tasks.QueryTask(layers.read_agregarFactibilidad());
  var qInterruptions = new esri.tasks.Query();

  qInterruptions.returnGeometry = true;
  qInterruptions.outFields=["*"];
  qInterruptions.where = "Rut= '"+ rut + "'";
  qTaskInterruptions.execute(qInterruptions, (featureSet)=>{
    if(!featureSet.features.length){
      return callback([]);
    }
    return callback(featureSet.features);
  }, (Errorq)=>{
    console.log("Error doing query for folios by rut");
    return callback([]);
  });
}

export {factigis_searchFolioByRut,factigis_findDireccion, factigis_findRotulo,factigis_findCalle, factigis_findNewDireccion,factigis_findTramo, factigis_findComuna, factigis_findFolio, factigis_findRotuloByNumber};
