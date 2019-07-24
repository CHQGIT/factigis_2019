import cookieHandler from 'cookie-handler';
import mymap from '../../services/map-service';
import layers from '../../services/layers-service';
import token from '../../services/token-service';

function loadCurrentUserData(dateRange, callback){
  //13.3.2018: filtro por empresa agregado
  console.log(dateRange,"rango");
  let usrprfl = cookieHandler.get('usrprfl');
  var qTaskFact = new esri.tasks.QueryTask(layers.read_agregarFactibilidad());
  var qFact = new esri.tasks.Query();
  //qFact.where = "Zona= '" + usrprfl.ZONA_USUARIO + "' AND Tipo_factibilidad = 'FACTIBILIDAD ASISTIDA' AND Estado_tramite <> 'CERRADA' AND EMPRESA='" + usrprfl.EMPRESA+ "'";
  //qFact.where = "Zona= '" + usrprfl.ZONA_USUARIO + "' AND Tipo_factibilidad = 'FACTIBILIDAD ASISTIDA' AND Estado_tramite <> 'CERRADA' AND EMPRESA='" + usrprfl.EMPRESA+ "' "+ dateRange;
  qFact.where = "Zona= '" + usrprfl.ZONA_USUARIO + "' AND Tipo_factibilidad = 'FACTIBILIDAD ASISTIDA' AND Estado_tramite <> 'CERRADA' AND EMPRESA='" + usrprfl.EMPRESA+ "' "+ dateRange;


  qFact.returnGeometry = true;
  qFact.outFields = ["*"];
  qTaskFact.execute(qFact, (featureSet)=>{
    if(featureSet.features.length){

      return callback(featureSet.features)
    }else{
    console.log("no hay registros que cargar en la tabla", featureSet.features.length);
      return callback([])
    }

  }, (Errorq)=>{
    //console.log("error en query para obtener factibilidades según zona", comuna)
    return callback([]);

  });
}

function find_folioData(folio, callback){


  var qTaskFact = new esri.tasks.QueryTask(layers.read_agregarFactibilidad());
  var qFact = new esri.tasks.Query();
  qFact.where = "OBJECTID = " + folio ;
  qFact.returnGeometry = false;
  qFact.outFields = ["*"];
  qTaskFact.execute(qFact, (featureSet)=>{
    if(featureSet.features.length){

      return callback(featureSet.features)
    }else{
      //console.log("no hay", featureSet.features.length, comuna);
      return callback([])
    }

  }, (Errorq)=>{
    //console.log("error en query para obtener factibilidades según zona", comuna)
    return callback([]);

  });
}

function updateAttributesPerFolio(d,callback){

  const data = {
    f: 'json',
    updates: JSON.stringify([{ attributes: d}]),
    token: token.read()
  };

  jQuery.ajax({
    method: 'POST',
    url: layers.read_updateFactibilidad(),
    dataType:'html',
    data: data
  })
    .done(d =>{
      let json = JSON.parse(d);
      if( (_.has(json,'error')) ){
        return callback(false);

      }else{
        if(json["updateResults"][0].objectId>0){
          //add to status historial
          return callback(true);

        }else{
          return callback(false);
        }
      }

    }).fail(f=>{
        return callback(false);
  });


}
export {loadCurrentUserData, find_folioData, updateAttributesPerFolio};
