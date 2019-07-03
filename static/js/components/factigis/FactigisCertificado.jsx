import React from 'react';
import cookieHandler from 'cookie-handler';
import env from '../../services/factigis_services/config';
import dateFormat from 'dateformat';
import { Header, Table, Rating } from 'semantic-ui-react';
import Map from 'esri/map';
import { factigis_findFolio } from '../../services/factigis_services/factigis_find-service';
import makeSymbol from '../../utils/makeSymbol';

class FactigisCarta extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      direccionEmpresa: {
        litoral: 'Av. Peñablanca N°540, Algarrobo',
        casablanca: 'Av. Portales N°187, Casablanca',
        linares: 'Chacabuco 675, Linares',
        parral: 'Anibal Pinto 1101, Parral',
        chilquinta: 'Av. Argentina N°1, piso 9, casilla 12V'
      },
      fonoEmpresa: {
        litoral: 'Servicio: 600 730 7630, desde celulares: +56 32 226 53 60',
        casablanca: 'Servicio: 32 226 53 70, desde celulares: +56 32 226 53 70 ',
        linares: 'Servicio: 600 600 25 00, desde celulares: +56 32 22 65 340',
        parral: ' Servicio: 600 600 22 00, desde celulares: +56 32 226 53 80',
        chilquinta: 'Fono: (56-32) 245 2000 - Fax: (56-32) 223 1171'
      },
      emailEmpresa: {
        litoral: 'litoral@litoral.cl, www.litoral.cl',
        casablanca: 'casablanca@casablanca.cl www.casablanca.cl',
        linares: 'reclamosll@luzlinares.cl www.luzlinares.cl',
        parral: 'reclamoslp@luzlinares.cl www.luzparral.cl',
        chilquinta: 'www.chilquinta.cl'
      },
      potencia: 0,
      nivelTension: 'Baja Tensión',
      fase: '',
      nombreSed: '',
      coci3: 0,
      coci2: 0,
      coci1: 0,
      folio: '',
      empresa: '',
      direccion: '',
      solicitante: '',
      ejecutor: '',
      cargo: '',
      lugar: '',
      departamento: '',
      lugarEmision: '',
      geometry: ''
    }

  }

  componentWillMount() {
    //if theres no cookie, the user cannot be in factigis Carta.
    if (!cookieHandler.get('usrprmssns')) {
      window.location.href = "index.html";
      return;
    }

  }

  componentDidMount() {

    var mapa = new Map("map_rep", {
      center: [-71.5662, -33.0391],
      zoom: 9,
      basemap: "satellite"
    })


     //18.4.2018: Buscar la factibilidad segun folio
     let folio = cookieHandler.get('folio');
     let usrProf = cookieHandler.get('usrprfl');
 
     var c = factigis_findFolio(folio, cb => {
       console.log(cb,"folio");
       this.setState({
         potencia: cb[0].attributes.Potencia,
         nivelTension: (cb[0].attributes.Tipo_empalme == 'MT') ? 'Media Tensión' : 'Baja Tensión',
         fase: cb[0].attributes.Fase,
         nombreSed: '',
         coci3: cb[0].attributes.Coci3f,
         coci2: cb[0].attributes.Coci2f,
         coci1: cb[0].attributes.Coci1f,
         folio: folio,
         empresa: cb[0].attributes.empresa,
         direccion: cb[0].attributes.Direccion,
         solicitante: cb[0].attributes.Nombre + " " + cb[0].attributes.Apellido,
         ejecutor: usrProf.NOMBRE_COMPLETO,
         cargo: usrProf.CARGO,
         lugar: usrProf.LUGAR_DE_TRABAJO,
         departamento: usrProf.DEPARTAMENTO,
         lugarEmision: usrProf.COMUNA,
         geom: cb[0].geometry
       })
   
      
      let pointSymbol = makeSymbol.makePoint();
      mapa.graphics.add(new esri.Graphic(this.state.geom,pointSymbol));
      mapa.centerAndZoom(this.state.geom,20);
    
     });

     
   

  }

  render() {

    var hoy = new Date();
    hoy.setDate(hoy.getDate());
    hoy = dateFormat(hoy, "dd/mm/yyyy hh:MM:ss")

    //04.12.2018: REQ. Dinamizar carta según empresa
    let fonoEmp, dirEmp, emailEmp = '';
    const { potencia, nivelTension, fase, nombreSed, coci3, coci2, coci1, folio, empresa, direccion, solicitante, ejecutor, cargo, lugar, departamento, lugarEmision } = this.state;

    switch (this.state.empresa) {
      case 'chilquinta':
        fonoEmp = this.state.fonoEmpresa.chilquinta;
        dirEmp = this.state.direccionEmpresa.chilquinta;
        emailEmp = this.state.emailEmpresa.chilquinta;
        break;

      case 'litoral':
        fonoEmp = this.state.fonoEmpresa.litoral;
        dirEmp = this.state.direccionEmpresa.litoral;
        emailEmp = this.state.emailEmpresa.litoral;
        break;

      case 'linares':
        fonoEmp = this.state.fonoEmpresa.linares;
        dirEmp = this.state.direccionEmpresa.linares;
        emailEmp = this.state.emailEmpresa.linares;
        break;

      case 'parral':
        fonoEmp = this.state.fonoEmpresa.parral;
        dirEmp = this.state.direccionEmpresa.parral;
        emailEmp = this.state.emailEmpresa.parral;
        break;

      case 'casablanca':
        fonoEmp = this.state.fonoEmpresa.casablanca;
        dirEmp = this.state.direccionEmpresa.casablanca;
        emailEmp = this.state.emailEmpresa.casablanca;
        break;
    }


    //dev
    let image = `${env.CSSDIRECTORY}images/factigis_images/logo_${empresa}400.png`;
    //prod
    //let image = "css/images/factigis_images/logo_chq400.png";

    return (
      <div className="wrapper_factigisCertificado">
        <div className="cert_header">
          <img className="cer_img" src={image}></img>
        </div>
        <div className="cert_wrapper_folio"><h4 className="cert_folio">Folio N°  {folio}</h4></div>
        <div className="cert_title"><h3 className="cert_h3">CERTIFICADO DE FACTIBILIDAD TÉCNICA DE SUMINISTRO</h3></div>

        <div className="cert_parrafo1">
          <p className="factigisCarta_p p1"><b>{empresa.toUpperCase()} S.A.,</b> certifica la factibilidad de suministro de energía eléctrica en la propiedad {direccion}, según lo indicado en el DFL N° 4 del año 2006, Ministerio de Minería (artículos 125 y 126), sus Reglamentos y Normas Eléctricas para los siguientes antecedentes:</p>
        </div>
        <div className="cer_tabla1">
          <Table celled className="cert_tabla1_wrapper" textAlign="center">
            <Table.Header className="tabla1_header">
              <Table.Row className="tabla1_row">
                <Table.HeaderCell>Tipo de antecedente:</Table.HeaderCell>
                <Table.HeaderCell>Requerimiento:</Table.HeaderCell>
                <Table.HeaderCell>Croquis de la ubicación del empalme:</Table.HeaderCell>

              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell >Potencia a conectar</Table.Cell>
                <Table.Cell>{potencia} KW</Table.Cell>
                <Table.Cell rowSpan={3}><div id="map_rep"></div></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>Nivel de tensión requerido</Table.Cell>
                <Table.Cell >{nivelTension}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Cantidad de fases requerida</Table.Cell>
                <Table.Cell >{fase}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

        </div>

        <div className="cert_parrafo2">
          <p className="">Según los antecedentes indicados por el cliente, la presente certificación de factibilidad no requiere de estudios para determinar la necesidad de obras adicionales.</p>
          <p>Adicionalmente, se informan los niveles de corto circuito de la SED {nombreSed}:</p>
        </div>

        <div className="cert_tabla2">
          <Table celled className="cert_tabla2_wrapper" textAlign="center">
            <Table.Header className="tabla2_header">
              <Table.Row className="tabla2_row">
                <Table.HeaderCell >Máx. l COCI 3 Φ bt [A]:</Table.HeaderCell>
                <Table.HeaderCell>Máx. l COCI 2 Φ bt [A]:</Table.HeaderCell>
                <Table.HeaderCell>Máx. l COCI 1 Φ bt [A]:</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row className="tabla2_row">
                <Table.HeaderCell >{coci3}</Table.HeaderCell>
                <Table.HeaderCell>{coci2}</Table.HeaderCell>
                <Table.HeaderCell>{coci1}</Table.HeaderCell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>

        <div className="cert_parrafo3">
          <p className="">Se extiende el presente certificado a solicitud de <b>{solicitante}</b>, para los fines que estime conveniente.</p>
        </div>

        <div className="cert_firma">
          <p className="factigisCarta_p p5">{ejecutor}<br />{cargo}<br /></p>
        </div>
       
       <div className="cert_fecha">
         <p className="">{lugarEmision}, {hoy}</p>
       </div>
       <div className="cert_pie">
        <p className="">{dirEmp} {fonoEmp} {emailEmp}</p>
       </div> 
       

      </div>
    );
  }
}

export default FactigisCarta;
