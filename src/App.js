/* eslint-disable eqeqeq */
import './App.css';
import {useState, useEffect} from 'react'
import Header from './Header';

function App() {
  const [arrayCuentas, setArrayCuentas] = useState([]); //ARRAY REGISTRO
  const [arrayDocumento, setArrayDocumento] = useState([]); //ARRAY FORMULARIO
  const [cuenta, setCuenta] = useState("No hay cuenta"); //VALOR CUENTA
  const [arrayIngreso, setArrayIngreso] = useState([]); //ARRAY DONDE SE VA A VER TODO
  const [ventanaBalance, setVentanaBalance] = useState(false);
  const [totalDebito, setTotalDebito] = useState(0); //TOTAL DEBITO
  const [totalCredito, setTotalCredito] = useState(0); // TOTAL CREDITO
  const [arrayBalance, setArrayBalance] = useState([]); //ARRAY BALANCE
  const [ventanaMovimiento, setVentanaMovimiento] = useState(false); //VENTANA MOVIMIENTO
  const [arrayMovimiento, setArrayMovimiento] = useState([]); //ARRAY DE MOVIMIENTO DE CUENTAS
  const [balanceCredito, setBalanceCredito] = useState(0); //BALANCE CREDITO
  const [balanceDebito, setBalanceDebito] = useState(0); //BALANCE DEBITO
  const [movimientoDebito, setMovimientoDebito] = useState(0); //TOTAL MOVIMIENTO DEBITO
  const [movimientoCredito, setMovimientoCredito] = useState(0); //TOTAL MOVIMIENTO CREDITO
  const [saldoAnterior, setSaldoAnterior] = useState(0); //SALDO ANTERIOR
  const [saldoActual, setSaldoActual] = useState(saldoAnterior); //SALDO ACTUAL
  const [movimientoGeneral, setMovimientoGeneral] = useState(false); //VENTANA MOVIMIENTO GENERAL
  const [arrayMovimientoGeneral, setArrayMovimientoGeneral] = useState([]);//ARRAY MOVIMIENTO GENERAL

  /*  ========================FUNCION DE REGISTRO===================================*/
  const registro = (e) => {
    e.preventDefault();
    setArrayCuentas([
      ...arrayCuentas,
      {
        id: e.target.idfijo.value,
        nombre: e.target.nombrefijo.value,
      },
    ]);
    e.target.reset();
  };

  /*  ========================FORMULARIO DOCUMENTO===================================*/
  const ingreso = (e) => {
    e.preventDefault();
    let debito = 0;
    let credito = 0;
    if (e.target.debito.value != "") {
      debito = e.target.debito.value;
    }
    if (e.target.credito.value != "") {
      credito = e.target.credito.value;
    }
    setArrayDocumento([
      ...arrayDocumento,
      {
        doc: e.target.doc.value,
        id: e.target.id.value,
        cedula: e.target.cedula.value,
        cuenta: cuenta,
        detalles: e.target.detalles.value,
        debito: debito,
        credito: credito,
        fecha: e.target.fecha.value,
      },
    ]);
    e.target.reset();
  };

  /*  ========================FUNCION BUSCAR CUENTA===================================*/
  const buscarCuenta = (e) => {
    let arrayTemporal = arrayCuentas.filter(
      (item) => parseFloat(item.id) == parseFloat(e.target.value)
    );
    if (arrayTemporal.length > 0) {
      setCuenta(arrayTemporal[0].nombre);
    } else {
      setCuenta("No hay cuenta");
    }
  };

  /*  ========================FUNCION SUMAR TOTALES EN DOCUMENTO===================================*/
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
    sumarFormulario();
  }, [arrayDocumento]);

  /*  ========================FUNCION BOTON GUARDAR Y ALAMACENA EN INGRESO===================================*/
  const guardar = () => {
    let array = arrayIngreso;
    for (let i = 0; i < arrayDocumento.length; i++) {
      array.push({
        doc: arrayDocumento[i].doc,
        id: arrayDocumento[i].id,
        cuenta: arrayDocumento[i].cuenta,
        debito: arrayDocumento[i].debito,
        credito: arrayDocumento[i].credito,
        fecha: arrayDocumento[i].fecha,
      });
    }
    setArrayIngreso(array);
    setArrayDocumento([]);
  };

  /*  ========================FUNCION VER BALANCE Y ALMACENA BALANCE===================================*/
  const verBalance = () => {
    //SUMAR ID IGUALES
    let array = [];
    if (arrayCuentas.length > 0) {
      for (let i = 0; i < arrayCuentas.length; i++) {
        let balanceDebito = 0;
        let balanceCredito = 0;
        for (let j = 0; j < arrayIngreso.length; j++) {
          if (arrayCuentas[i].id == arrayIngreso[j].id) {
            balanceDebito = balanceDebito + parseFloat(arrayIngreso[j].debito);
            balanceCredito =
              balanceCredito + parseFloat(arrayIngreso[j].credito);
          }
        }
        if (balanceCredito + balanceDebito > 0) {
          array.push({
            id: arrayCuentas[i].id,
            cuenta: arrayCuentas[i].nombre,
            debito: balanceDebito,
            credito: balanceCredito,
          });
        }
      }
      setArrayBalance(array);
    }

    /*  ========================DESPLEGAR VENTANA BALANCE===================================*/
    if (ventanaBalance) {
      setVentanaBalance(false);
    } else {
      setVentanaBalance(true);
    }
  };

  /*  ========================FUNCION SUMAR EN BALANCE===================================*/
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

  /*  ========================FUNCION MOVIMIENTO DE CUENTA Y ALMACENA EN ARRAY MOVIMIENTO===================================*/
  const verMovimiento = (e) => {
    e.preventDefault();

    /*  ========================FILTAR FECHAS===================================*/
    let arrayTemporal = arrayIngreso.filter(
      (item) =>
        item.fecha >= e.target.fechaInicial.value &&
        item.fecha <= e.target.fechaFinal.value &&
        e.target.idmovimiento.value == item.id
    );

    setArrayMovimiento(arrayTemporal);

    /*  ========================FILTRA SALDO ANTERIOR===================================*/
    let saldoAnterior = 0;
    let arraySaldoAnterior = arrayIngreso.filter(
      (item) => item.fecha < e.target.fechaInicial.value
    );
    if (arraySaldoAnterior.length > 0) {
      for (let i = 0; i < arraySaldoAnterior.length; i++) {
        saldoAnterior =
          saldoAnterior +
          parseFloat(arraySaldoAnterior[i].debito) -
          parseFloat(arraySaldoAnterior[i].credito);
      }
    }
    setSaldoAnterior(saldoAnterior);

    /*  ========================FILTRA SALDO ACTUAL===================================*/
    let saldoActual = 0;
    for (let i = 0; i < arrayMovimiento; i++) {
      saldoActual =
        saldoAnterior +
        parseFloat(arrayMovimiento[i].debito) -
        parseFloat(arrayMovimiento[i].credito);
    }
    setSaldoActual(parseFloat(saldoActual));

    /*  ========================DESPLIEGA VENTANA DE MOVIMIENTO DE CUENTA===================================*/
    if (ventanaMovimiento) {
      setVentanaMovimiento(false);
    } else {
      setVentanaMovimiento(true);
    }
  };

  /*  ========================TOTAL DE MOVIMIENTO DE CUENTA===================================*/
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

  /*  ========================FUNCION MOVIMIENTO GENERAL===================================*/
  const verMovimientoGeneral = (e) => {
    e.preventDefault();
    let arrayTemporal = arrayIngreso.filter(
      (item) =>
        item.fecha >= e.target.fechaInicialMovimiento.value &&
        item.fecha <= e.target.fechaFinalMovimiento.value
    );
    setArrayMovimientoGeneral(arrayTemporal);
    if (movimientoGeneral) {
      setMovimientoGeneral(false);
    } else {
      setMovimientoGeneral(true);
    }
  };

  /*  ========================INICIA===================================*/
  return (
    <div className="App">
      <Header />

      {/*  ========================FORMULARIO REGISTRO===================================*/}
      {/*FORMULARIO DEL REGISTRO*/}
      <section className="container">
        <section className="container1">
          <form className="registro" onSubmit={registro}>
            <section className="tituloRegistro">
              <h1 className="reg">CREACION DE CUENTA</h1>
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
              <button className="btn" type="submit">
                REGISTRAR
              </button>
            </section>
          </form>
          <section className="botones">
            <button className="btnBalance" onClick={verBalance}>
              <b>VER BALANCE</b>
            </button>
          </section>
        </section>

        {/*  ========================FORMULARIO DOCUMENTO===================================*/}
        {/*FORMULARIO */}
        <section className="container2">
          <form className="formulario" onSubmit={ingreso}>
            <section className="tituloIngreso">
              <h1>DOCUMENTO</h1>
            </section>
            <label className="labell">
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
                name="id"
                onChange={buscarCuenta}
              ></input>
            </label>
            <label>
              CEDULA
              <input
                type="text"
                name="cedula"
                placeholder="ingresa cedula"
              ></input>
            </label>
            <label>
              NOMBRE CUENTA
              <input type="text" value={cuenta} readOnly={true}></input>
            </label>
            <label>
              DETALLES
              <input
                type="text"
                name="detalles"
                placeholder="ingrese detalles"
              ></input>
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

          {/*  ========================FORMULARIO MOVIMIENTO DE CUENTA===================================*/}
          {/*FOMULARIO MOVIMIENTO */}
          <form className="Movimiento" onSubmit={verMovimiento}>
            <section className="movimiento">
              <h1>MOVIMIENTO DE CUENTA</h1>
            </section>
            <label>
              ID
              <input type="text" name="idmovimiento"></input>
            </label>
            <label>
              FECHA INICIAL
              <input type="date" name="fechaInicial"></input>
            </label>
            <label>
              FECHA FINAL
              <input type="date" name="fechaFinal"></input>
            </label>
            <section className="boton">
              <button className="btn">VER MOVIMIENTO</button>
            </section>
          </form>

          {/*  ========================FORMULARIO MOVIMIENTO GENERAL===================================*/}
          {/*FORMULARIO MOVIMIENTO GENERAL */}
          <form className="movimientoGeneral" onSubmit={verMovimientoGeneral}>
            <section>
              <h1>MOVIMIENTO</h1>
            </section>
            <label>
              FECHA DE INICIO
              <input type="date" name="fechaInicialMovimiento"></input>
            </label>
            <label>
              FECHA FINAL
              <input type="date" name="fechaFinalMovimiento"></input>
            </label>
            <button className="btn" value={movimientoGeneral}>
              VER MOVIMIENTO
            </button>
          </form>
        </section>
      </section>

      {/*  ========================INICIAN TABLAS===================================*/}
      <section className="tablas">
        {/* TABLA FORMULARIO  */}
        <section className="tablaDocumento">
          <table className="documento">
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
        </section>

        {/*  ========================INICIA TABLA BALANCE===================================*/}
        {ventanaBalance ? (
          <section className="tablaBalance">
            <h3>BALANCE</h3>
            <table className="balance">
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
          </section>
        ) : null}

        {/*  ========================INICIA TABLA MOVIMIENTO===================================*/}
        {ventanaMovimiento ? (
          <section className="tablaMovimiento">
            <h3>MOVIMIENTO</h3>
            <table className="movimiento">
              <thead>
                <tr>
                  <td className="saldo"></td>
                  <td className="saldo"></td>
                  <td className="saldo"></td>
                  <td className="saldo"></td>
                  <td className="saldo">
                    <b>SALDO ANTERIOR: ...</b>
                  </td>
                  <td className="saldo">{saldoAnterior}</td>
                </tr>
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
                <tr>
                  <td className="saldo"></td>
                  <td className="saldo"></td>
                  <td className="saldo"></td>
                  <td className="saldo"></td>
                  <td className="saldo">
                    <b>SALDO ACTUAL: ...</b>
                  </td>
                  <td className="saldo">{saldoActual}</td>
                </tr>
              </tbody>
            </table>
          </section>
        ) : null}

        {/*  ========================INICIA TABLA MOVIMIENTO GENERAL===================================*/}
        {movimientoGeneral ? (
          <section className="tablaMovimiento">
            <table className="movimiento">
              <thead>
                <tr>
                  <th>DOC</th>
                  <th>FECHA</th>
                  <th>ID</th>
                  <th>CEDULA</th>
                  <th>CUENTA</th>
                  <th>DETALLES</th>
                  <th>DEBITO</th>
                  <th>CREDITO</th>
                </tr>
              </thead>
              {arrayMovimientoGeneral.map((general, i) => (
                <tr key={i}>
                  <td>{general.doc} </td>
                  <td>{general.fecha} </td>
                  <td>{general.id} </td>
                  <td>{general.cedulada}</td>
                  <td>{general.cuenta} </td>
                  <td>{general.detalles} </td>
                  <td>{general.debito} </td>
                  <td>{general.credito} </td>
                </tr>
              ))}
            </table>
          </section>
        ) : null}
      </section>
    </div>
  );
}

export default App;
