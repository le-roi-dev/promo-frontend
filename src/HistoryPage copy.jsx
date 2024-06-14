import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo,
} from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";
import "./index.scss";
import axios from "./connection/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import siteLogo from "./assets/site_logo.png";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CustomizedProgressBars from './components/LoadingBar';
import { Button } from "@mui/material";
import Datepicker from "react-tailwindcss-datepicker";
import { Link } from "react-router-dom";

function HistoryPage({ userData, onLogoutClick, setPage }) {
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef();

  const [rowData, setRowData] = useState([]);
  const [date, setDate] = useState(null);
  const [color, setColor] = useState("blue");
  const [families, setFamilies] = useState([]);
  // Column Definitions: Defines the columns to be displayed.
  const getCellClassName = (params) => {
    const value = params.value;

    if (value == "APPROVED") {
      return 'greenCell'; // Apply the class for red background
    }
    if (value == "PENDING") {
      return 'pinkCell'; // Apply the class for red background
    }
  };
  const [colDefs, setColDefs] = useState([
    {
      headerName: "IMAGEN PRODUCTO",
      field: "imagen_producto",
      cellRenderer: (params) => {
        console.log(params)
        return (

          <div className="flex justify-center w-full">
            <img
              src={`${params.value}`}
              alt="Producto"
              style={{ width: "40px", height: "40px" }}
              onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
            />
          </div>
        )
      },
      width: 100,
    },

    { headerName: "SKU SOD", field: "item_sku_num", width: 100 },
    { headerName: "Descripcion", field: "item_name", width: 130 },
    { headerName: "Familia", field: "familia", width: 130 },
    { headerName: "Grupo", field: "subfamilia", width: 130 },
    { headerName: "Tipo promocion", field: "tipo_promocion", width: 130 },
    { headerName: "Tiendas a aplicar", field: "TIENDAS", width: 130 },
    { headerName: "Fecha de inicio", field: "fecha_de_inicio", width: 130 },
    { headerName: "Fecha de fin", field: "fecha_de_termino", width: 130 },
    { headerName: "Precio promocion", field: "precio_oferta", width: 130 },
    { headerName: "Descuento", field: "descuento", width: 130 },
    { headerName: "Margen", field: "margen", width: 130 },
    {
      headerName: "ESTADO PRECIOS",
      field: "status",
      width: 130,
      cellRenderer: params => (
        <div>
          {
            params.value == "APPROVED" ? "APROBADO PANGUI" : "PENDIENTE"
          }
        </div>
      ),
      cellStyle: params => {
        if (params.value == "APPROVED") {
          return {
            color: '#0BA452',
            backgroundColor: '#d8f2cf'
          };
        } else if (params.value == "PENDING") {
          return {
            color: '#B64AB0',
            backgroundColor: '#f2cef2'
          };
        }
      }
    },
    { headerName: "Precio minimo", field: "precio_minimo", width: 130 },
    { headerName: "U/Medida", field: "unidad_medida", width: 130 },
    { headerName: "Comprador", field: "comprador", width: 130 },
    { headerName: "Origen", field: "origen_sku", width: 130 },
    { headerName: "Formato", field: "formato_sku", width: 130 },
    { headerName: "Precio maximo", field: "precio_maximo", width: 130 },
    { headerName: "EMAIL", field: "EMAIL", width: 130 },
    // { headerName: "APROBADOS PRICING", field: "APROBADOS_PRICING", width: 130 },
    // {
    //   headerName: "JUSTIFICACION PROMOCION RECHAZADA",
    //   field: "JUSTIFICACION_PROMOCION_RECHAZADA",
    //   width: 130,
    // },
    {
      field: "time_from_request",
      headerName: "TIEMPO_DESDE_PRIMERA_SOLICITUD",
      width: 100,
      cellRenderer: (params) => {
        let betweenTime = parseInt(params.value) / 1000;
        let dateString;
        console.log(new Date());
        console.log(betweenTime);
        if (betweenTime > 86400) {
          dateString = parseInt(betweenTime / 86400) + "d ago";
        } else if (betweenTime > 3600) {
          dateString = parseInt(betweenTime / 3600) + "h ago";
        } else if (betweenTime > 60) {
          dateString = parseInt(betweenTime / 60) + "m ago";
        } else {
          dateString = betweenTime + "s ago";
        }
        return (
          <div>
            {dateString}
          </div>
        )
      },
      editable: false,
    },
  ]);

  const [keyword, setKeyword] = useState("");
  const [skip, setSkip] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [family, setFamily] = useState("");
  const [applicant, setApplicant] = useState("");
  const [applicants, setApplicants] = useState([]);
  const nowDate = new Date();
  const [value, setValue] = useState({
    startDate: new Date(nowDate.getFullYear(), 0, 1),
    endDate: new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 2),
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue({
      startDate: new Date(newValue.startDate),
      endDate: new Date(newValue.endDate)
    });
  };

  useEffect(() => {
    refreshPage();
  }, [skip, keyword, value, family, applicant]);

  const refreshPage = () => {
    const startDate = value.startDate.toISOString().split('T')[0];
    const endDate = value.endDate.toISOString().split('T')[0];
    console.log(startDate, endDate);
    setIsLoading(true);
    // const endDate = value.endDate.toISOString().split('T')[0];
    axios
      .get("api/history-data?skip=" + skip + "&keyword=" + keyword + "&start_date=" + startDate + "&end_date=" + endDate + "&email=" + userData.email + "&user_type=" + userData.type + "&family=" + family + "&applicant=" + applicant)
      .then((data) => {
        if (skip == 0) {
          // console.log(data.response.data);
          // const filteredData = data.response.data.filter(
          //   (item) =>
          //     item.APROBADOS_PRICING !== "" && item.APROBADOS_PRICING !== null
          // );
          setRowData(data.response.data);
        } else {
          const filteredData = [...rowData, ...data.response.data];
          // const filter = filteredData.filter(
          //   item.APROBADOS_PRICING !== "" && item.APROBADOS_PRICING !== null
          // );
          setRowData(filteredData);
        }
        setFamilies(data.response.families)
        setApplicants(data.response.EMAILs)
        if (data.response.data.length == 10) {
          setSkip(skip + 10);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error while loading store data from google spreadsheet.");
      });
  }

  const exportClick = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const handleSelect1Change = (event) => {
    setFamily(event.target.value);
  };

  const handleSelect2Change = (event) => {
    setApplicant(event.target.value);
  };

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
      menuTabs: ["filterMenuTab"],
    };
  }, []);

  return (
    <div className="main-body bg-gray-200 relative h-screen">
      <div className="main_body">
        <div
          className={`relative bg-white w-full min-h-screen pt-[15px] md:w-max-[1200px] container_body`}
        >
          <div className="absolute top-2 right-4 flex items-center gap-2 text-black pr-10">
            <img src={userData.picture} className="w-[50px] h-[50px] rounded-full" />
            <div>
              <div className="font-bold text-base">
                Hola, {userData.name}
              </div>
              <div className="text-base">
                {userData.email}
              </div>
            </div>
          </div>
          <div className="flex items-center text-[#247395] font-bold text-sm justify-center gap-8">
            <Link to={userData.type == 1 ? "/promotion" : "/request"} className=" flex flex-col gap-2 items-center">
              <img src={"/telegram.png"} width={20} height={20} />
              ENVÍO SOLICITUD
            </Link>
            <div className="border-b-4 border-[#0066FF] text-[#0066FF] flex flex-col gap-2 items-center">
              <img src={"/message-request.png"} width={20} height={20} />
              SEGUIMIENTO SOLICITUDES
            </div>
          </div>
          <>
            <div className="bg-blue-500 bg-gradient-to-r from-blue-600 to-blue-400 rounded-tr-lg rounded-br-lg shadow-2xl text-white text-left py-3 px-2 md:px-4 header mt-1 mr-[10px] md:mr-[15px]">
              <div className="flex items-center justify-between mx-2 md:mx-[24px]">
                <div className="text-section text-white pr-2">
                  <h2 className="font-bold md:text-lg text-sm">
                    APLICATIVO DE SOLICITUD DE PROMOCIONES
                  </h2>
                  <p className="font-light text-[12px] md:text-sm">
                    Realizado por Business Analytics - BI Chile
                  </p>
                </div>
                <img
                  className="pb-[5px] md:pb-[10px] max-w-[150px] md:max-w-[150px]"
                  src={siteLogo}
                  width={200}
                  height={40}
                />
              </div>
            </div>
          </>
          <div className="text-[#55C5D5] pl-14 h-[70px] flex justify-between">
            <div className="flex gap-4 items-center">
              <div className="font-bold flex gap-2 items-center">
                <img src={"/smallmark.png"} className="h-[40px] w-[40px]" />
                VISTA
              </div>
              <div className="font-bold flex flex-col gap-0.5">
                {/* <img src={"/threedot.png"} className="h-[20px] w-[4px]" /> */}
                <div className="w-0.5 h-0.5 bg-[#55C5D5]"></div>
                <div className="w-0.5 h-0.5 bg-[#55C5D5]"></div>
                <div className="w-0.5 h-0.5 bg-[#55C5D5]"></div>
                <div className="w-0.5 h-0.5 bg-[#55C5D5]"></div>
                <div className="w-0.5 h-0.5 bg-[#55C5D5]"></div>
              </div>
              <div>
                SEGUIMIENTO SOLICITUDES
              </div>
            </div>
          </div>
          <div className="bg-[#EFEFEF] w-full h-[22px] relative">
            <div className="absolute h-[23px] left-0 bottom-0 w-[338px] bg-[#1964BC] rounded-r-full text-sm pl-14 text-white">
              PREAPROBACIÓN PROMOCIÓN
            </div>
          </div>
          <div className="w-full mt-4 p-6 md:px-14 bg-white">
            <div className="3xl:flex 3xl:justify-between">
              <div className="flex gap-4 3xl:py-0 py-2">
                <div className="flex gap-4 justify-center">
                  <FormControl fullWidth style={{ width: "200px" }} size={"small"}>
                    <InputLabel id="demo-simple-select-label">Familia</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={family}
                      label="Familia"
                      onChange={handleSelect1Change}
                    >
                      {/* <MenuItem value={10}>Familia</MenuItem> */}
                      {families.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth style={{ width: "200px" }} size={"small"}>
                    <InputLabel id="demo-simple-select-label1">
                      Solicitante
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label1"
                      id="demo-simple-select"
                      value={applicant}
                      label="Solicitante"
                      onChange={handleSelect2Change}
                    >
                      {applicants.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex gap-4 justify-center">
                  <TextField
                    className="border p-1"
                    id="outlined-basic"
                    label="Buscar SKU"
                    variant="outlined"
                    size={"small"}
                    style={{ width: "200px" }}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setSkip(0);
                    }}
                  />
                  <div>
                    <Datepicker
                      // asSingle={true}
                      primaryColor={color}
                      showShortcuts={true}
                      separator={"/"}
                      showFooter={true}
                      popoverDirection="down"
                      value={value}
                      onChange={handleValueChange}
                      classNames="bg-white-500"
                      inputClassName="h-[40px] w-[300px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => refreshPage()} className="hover:bg-[#d1d1d1] duration-500 font-bold text-xs rounded-lg min-w-[142px] text-center bg-[#E0E0E0] px-4 py-3 items-center">ACTUALIZAR</button>
                <button onClick={() => exportClick()} className="font-bold duration-500 text-xs rounded-lg min-w-[210px] text-center bg-[#A8CFD7] px-4 py-3 items-center hover:bg-[#79bcca]">DESCARGAR RESULTADOS ENVIADOS</button>
              </div>

            </div>
            <div className="h-[450px] mt-4 custom-ag-grid relative">
              {isLoading ? <CustomizedProgressBars /> : null}
              <AgGridReact
                className="ag-theme-quartz"
                rowData={rowData}
                columnDefs={colDefs}
                // onGridReady={onGridReady}
                // defaultColDef={defaultColDef}
                ref={gridRef}
                suppressExcelExport={true}
                pagination
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
