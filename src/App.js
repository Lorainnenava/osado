/* eslint-disable eqeqeq */
import './App.css';
import {useState, useEffect} from 'react'
import Header from './Header';

function App() {
  const [arrayCuentas, setArrayCuentas]= useState([])//ARRAY REGISTRO
  const [arrayDocumento, setArrayDocumento]= useState([])//ARRAY FORMULARIO
  const [cuenta, setCuenta]= useState('No hay cuenta')//VALOR CUENTA
  const [arrayIngreso, setArrayIngreso]= useState([]);//ARRAY DONDE SE VA A VER TODO
  const [ventanaBalance, setVentanaBalance]= useState(false);
  const [totalDebito, setTotalDebito]= useState(0)//TOTAL DEBITO
  const [totalCredito, setTotalCredito] = useState(0);// TOTAL CREDITO
  const[arrayBalance, setArrayBalance]= useState([])//ARRAY BALANCE
  const [ventanaMovimiento, setVentanaMovimiento]=useState(false)//VENTANA MOVIMIENTO
  const [idCuenta, setIdCuenta]= useState('')//VARIABLE DE CUENTA
  const [arrayMovimiento, setArrayMovimiento]= useState([])//ARRAY DE MOVIMIENTO
  const [balanceCredito, setBalanceCredito]= useState(0)//BALANCE CREDITO
  const [balanceDebito, setBalanceDebito] = useState(0);//BALANCE DEBITO
  const [movimientoDebito, setMovimientoDebito] = useState(0);//TOTAL MOVIMIENTO DEBITO
  const [movimientoCredito, setMovimientoCredito] = useState(0);//TOTAL MOVIMIENTO CREDITO

  //FORMULARIO REGISTRO
  const registro=(e)=>{
    e.preventDefault();
    setArrayCuentas([...arrayCuentas,{
      id:e.target.idfijo.value,
      nombre:e.target.nombrefijo.value,
    }])
    e.target.reset()
  }
/* console.log(arrayCuentas) */
  //FORMULARIO INGRESO
  const ingreso =(e)=>{
    e.preventDefault();
    setArrayDocumento([...arrayDocumento,{
      doc:e.target.doc.value,
      id:idCuenta,
      cuenta:cuenta,
      debito:e.target.debito.value,
      credito:e.target.credito.value,
      fecha:e.target.fecha.value,
    }])
    e.target.reset();
  }
  console.log(arrayDocumento)
  //FUNCION BUSCAR CUENTA
  const buscarCuenta = (e)=>{
  setIdCuenta(e.target.value)
  let arrayTemporal = arrayCuentas.filter(item => parseFloat(item.id) == parseFloat(e.target.value))
  if(arrayTemporal.length > 0){
    setCuenta(arrayTemporal[0].nombre)
  }else{
    setCuenta('No hay cuenta')
  }
  }

  //FUNCION SUMAR TOTALES
  useEffect(() => {
  const sumarFormulario = () => {
    let sumaDebito = 0;
    let sumaCredito = 0;
    for (let i = 0; i < arrayDocumento.length; i++) {
      sumaDebito = sumaDebito + parseFloat(arrayDocumento[i].debito);
      sumaCredito = sumaCredito + parseFloat(arrayDocumento[i].credito);
    }
    setTotalDebito(parseFloat(sumaDebito));
    setTotalCredito(parseFloat(sumaCredito));
  };
  sumarFormulario()
},[arrayDocumento]);

  //FUNCION DEL BOTON GUARDAR Y ALMACENA EN INGRESO
  const guardar = () => {
  let array = arrayIngreso;
  for (let i = 0; i < arrayDocumento.length; i++) {
    array.push({
      doc: arrayDocumento[i].doc,
      id: arrayDocumento[i].id,
      cuenta: cuenta,
      debito: arrayDocumento[i].debito,
      credito: arrayDocumento[i].credito,
      fecha: arrayDocumento[i].fecha,
    }
    ); 
  }
  setArrayIngreso(array);
  setArrayDocumento([])
}
  //VER BALANCE Y ALMACENA EN ARRAY BALANCE
  //SUMAR ID IGUALES
  const verBalance = () => {
    let array=[];
    if(arrayCuentas.length>0){
      for (let i = 0; i < arrayCuentas.length; i++) {
        let balanceDebito = 0;
        let balanceCredito = 0;
        for (let j = 0; j < arrayIngreso.length; j++) {
          if (arrayCuentas[i].id == arrayIngreso[j].id) {
            balanceDebito = balanceDebito + parseFloat(arrayIngreso[j].debito);
            balanceCredito = balanceCredito + parseFloat(arrayIngreso[j].credito);
          }
        } if (balanceCredito + balanceDebito > 0) {
          array.push({
            id: arrayCuentas[i].id,
            cuenta: arrayCuentas[i].nombre,
            debito: balanceDebito,
            credito: balanceCredito
          });
        }
      }
      setArrayBalance(array)
    }
    //DESPLEGAR VENTANA BALANCE
    if(ventanaBalance){
      setVentanaBalance(false)
    }else{
      setVentanaBalance(true)
    }
  };

  //SUMA DE TOTALES EN BALANCE
    useEffect(() => {
      const sumarBalance = () => {
        let sumaDebito = 0;
        let sumaCredito = 0;
        for (let i = 0; i < arrayBalance.length; i++) {
          sumaDebito = sumaDebito + parseFloat(arrayBalance[i].debito);
          sumaCredito = sumaCredito + parseFloat(arrayBalance[i].credito);
        }
        setBalanceDebito(parseFloat(sumaDebito));
        setBalanceCredito(parseFloat(sumaCredito));
      };
      sumarBalance();
    }, [arrayBalance]);

    //FUNCION MOVIMIENTO Y ALMACENA EN ARRAY MOVIMIENTO
  const verMovimiento = ()=>{
    let array=[]
    for(let i=0; i< arrayIngreso.length; i++){
        if(idCuenta == arrayIngreso[i].id){
        array.push({
          doc: arrayIngreso[i].doc,
          id: arrayIngreso[i].id,
          cuenta: arrayIngreso[i].cuenta,
          debito: arrayIngreso[i].debito,
          credito: arrayIngreso[i].credito,
          fecha: arrayIngreso[i].fecha,
        });
      }
      setArrayMovimiento(array)
    }
    //DESPLIEGA VENTANA MOVIMIENTO
    if(ventanaMovimiento){
      setVentanaMovimiento(false)
    }else{
      setVentanaMovimiento(true)
    }
  }

      //TOTALES EN MOVIMIENTO
      useEffect(() => {
        const sumarMovimiento = () => {
          let sumaDebito = 0;
          let sumaCredito = 0;
          for (let i = 0; i < arrayMovimiento.length; i++) {
            sumaDebito = sumaDebito + parseFloat(arrayMovimiento[i].debito);
            sumaCredito = sumaCredito + parseFloat(arrayMovimiento[i].credito);
          }
          setMovimientoDebito(sumaDebito);
          setMovimientoCredito(sumaCredito);
        };
        sumarMovimiento();
      }, [arrayMovimiento]);

  //COMIENZA EL CODIGO
  return (
    <div className="App">
      <Header />
      <section className="formus">
        {/*FORMULARIO DEL REGISTRO*/}
        <form className="registro" onSubmit={registro}>
          <section className="tituloRegistro">
            <h1 className="reg">REGISTRO</h1>
          </section>
          <label>
            ID CUENTA
            <input
              type="text"
              name="idfijo"
              placeholder="registra el codigo"
            ></input>
          </label>
          <br />
          <label>
            NOMBRE CUENTA
            <input
              type="text"
              name="nombrefijo"
              placeholder="Ingresa el nombre"
            ></input>
          </label>
          <section className="btnRegistro">
            <button type="submit">REGISTRAR</button>
          </section>
        </form>
        {/*FORMULARIO */}
        <form className="formulario" onSubmit={ingreso}>
          <label>
            DOC
            <input
              type="text"
              name="doc"
              placeholder="Ingresa el codigo"
            ></input>
          </label>
          <label>
            ID CUENTA
            <input
              type="text"
              placeholder="Ingresa el codigo"
              value={idCuenta}
              onChange={buscarCuenta}
            ></input>
          </label>
          <label>
            NOMBRE CUENTA
            <input type="text" value={cuenta} readOnly={true}></input>
          </label>
          <label>
            DEBITO
            <input
              type="text"
              name="debito"
              placeholder="Ingresa el debito"
            ></input>
          </label>
          <label>
            CREDITO
            <input
              type="text"
              name="credito"
              placeholder="Ingresa el credito"
            ></input>
          </label>
          <label>
            FECHA
            <input type="date" name="fecha"></input>
          </label>
          <section className="btnFormulario">
            <button type="submit" value={ventanaBalance} className="btn">
              INGRESAR
            </button>
          </section>
        </form>
      </section>
      <section className="botones">
        <button className="btn" onClick={verBalance}>
          VER BALANCE
        </button>
        <button className="btn" onClick={verMovimiento}>
          VER MOVIMIENTO
        </button>
      </section>

      <section className="tablas">
        {/* TABLA FORMULARIO  */}
        <table>
          <thead>
            <tr>
              <th>DOC</th>
              <th>ID CUENTA</th>
              <th>NOMBRE CUENTA</th>
              <th>DEBITO</th>
              <th>CREDITO</th>
              <th>FECHA</th>
            </tr>
          </thead>
          <tbody>
            {arrayDocumento.map((documento, i) => (
              <tr key={i}>
                <td>{documento.doc}</td>
                <td>{documento.id}</td>
                <td>{documento.cuenta}</td>
                <td>{documento.debito}</td>
                <td>{documento.credito}</td>
                <td>{documento.fecha}</td>
              </tr>
            ))}
            <tr>
              <td className="totales"></td>
              <td className="totales"></td>
              <td className="totales">
                <b>{"Totales: ........"}</b>
              </td>
              <td className="totales">
                <b>{totalDebito}</b>
              </td>
              <td className="totales">
                <b>{totalCredito}</b>
              </td>
              <td className="totales"></td>
            </tr>
          </tbody>
        </table>
        {totalDebito == totalCredito && totalCredito > 0 ? (
          <button onClick={guardar}>GUARDAR</button>
        ) : null}
        {ventanaBalance ? (
          <>
            <h3>BALANCE</h3>
            <table>
              <thead>
                <tr>
                  <th>ID CUENTA</th>
                  <th>NOMBRE CUENTA</th>
                  <th>DEBITO</th>
                  <th>CREDITO</th>
                </tr>
              </thead>
              <tbody>
                {arrayBalance.map((balance, i) => (
                  <tr key={i}>
                    <td>{balance.id}</td>
                    <td>{balance.cuenta}</td>
                    <td>{balance.debito}</td>
                    <td>{balance.credito}</td>
                  </tr>
                ))}
                <tr>
                  <td className="totales"></td>
                  <td className="totales">
                    <b>{"Totales: ........"}</b>
                  </td>
                  <td className="totales">
                    <b>{balanceDebito}</b>
                  </td>
                  <td className="totales">
                    <b>{balanceCredito}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ) : null}
        {ventanaMovimiento ? (
          <>
            <h3>MOVIMIENTO</h3>
            <table>
              <thead>
                <tr>
                  <th>DOC</th>
                  <th>FECHA</th>
                  <th>ID CUENTA</th>
                  <th>NOMBRE CUENTA</th>
                  <th>DEBITO</th>
                  <th>CREDITO</th>
                </tr>
              </thead>
              <tbody>
                {arrayMovimiento.map((movimiento, i) => (
                  <tr key={i}>
                    <td>{movimiento.doc}</td>
                    <td>{movimiento.fecha}</td>
                    <td>{movimiento.id}</td>
                    <td>{movimiento.cuenta}</td>
                    <td>{movimiento.debito}</td>
                    <td>{movimiento.credito}</td>
                  </tr>
                ))}
                <tr>
                  <td className="totales"></td>
                  <td className="totales"></td>
                  <td className="totales"></td>
                  <td className="totales">
                    <b>{"Totales: ........"}</b>
                  </td>
                  <td className="totales">
                    <b>{movimientoDebito}</b>
                  </td>
                  <td className="totales">
                    <b>{movimientoCredito}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ) : null}
      </section>
    </div>
  );
}

export default App;
