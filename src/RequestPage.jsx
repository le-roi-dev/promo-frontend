import React, { useEffect, useCallback, useState, useRef } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";
import "./index.scss";
import axios from "./connection/axios";
import siteLogo from "./assets/site_logo.png";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
import CustomizedProgressBars from './components/LoadingBar';
function RequestPage({ userData, onLogoutClick, setPage }) {
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef();
  const ref = useRef(null);
  const [rowData, setRowData] = useState([]);
  const getCellClassName = (params) => {
    const value = params.value;

    if (value == "APPROVED") {
      return 'greenCell'; // Apply the class for red background
    }
    if (value == "PENDING") {
      return 'pinkCell'; // Apply the class for red background
    }
  };

  // Column Definitions: Defines the columns to be displayed.
  const [columns, setColumns] = useState([
    {
      headerName: "IMAGEN PRODUCTO",
      field: "imagen_producto",
      renderCell: (params) => {
        console.log(params)
        return (
          <div className="flex justify-center w-full">
            <img
              src={`${params.row.imagen_producto}`}
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
    { headerName: "Descripcion", field: "item_name", width: 170 },
    { headerName: "Familia", field: "familia", width: 130 },
    { headerName: "Grupo", field: "subfamilia", width: 130 },
    { headerName: "Tipo promocion", field: "tipo_promocion", width: 100 },
    { headerName: "Tiendas aplicar", field: "TIENDAS", width: 90 },
    { headerName: "Fecha de inicio", field: "fecha_de_inicio", width: 130 },
    { headerName: "Fecha de fin", field: "fecha_de_termino", width: 130 },
    { headerName: "Precio promocion", field: "precio_oferta", width: 90 },
    { headerName: "Descuento", field: "descuento", width: 100 },
    { headerName: "Margen", field: "margen", width: 100 },
    {
      headerName: "ESTADO PRECIOS",
      field: "status",
      width: 130,
    },
    { headerName: "Precio minimo", field: "precio_minimo", width: 90 },
    { headerName: "U/Medida", field: "unidad_medida", width: 100 },
    { headerName: "Comprador", field: "comprador", width: 100 },
    { headerName: "Origen", field: "origen_sku", width: 100 },
    { headerName: "Formato", field: "formato_sku", width: 100 },
    { headerName: "Precio maximo", field: "precio_maximo", width: 90 },
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
      renderCell: (params) => {
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
  ].map(col => {
    const updatedCol = {
      ...col,
      renderHeader: (params) => {
        return (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <p className="leading-normal text-sm">
              {params.colDef.headerName}
            </p>
          </div>
        )
      }
    }
    if (updatedCol.renderCell) {
      return updatedCol;
    }
    return {
      ...updatedCol,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <p className="break-all">
            {params.value}
          </p>
        </div>
      )
    }
  }));

  const [skip, setSkip] = useState(0);
  const [applicant, setApplicant] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [family, setFamily] = useState("");
  const [families, setFamilies] = useState([]);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // gridRef.current.api.showLoadingOverlay();
    getRequestData(skip, keyword);
    // gridRef.current.api.hideOverlay();
  }, [skip, keyword, family, applicant]);

  const changePercentContent = (value) => {
    if (!value) return null;
    let number = parseFloat(value);

    // Round the number to one decimal place
    let roundedNumber = number.toFixed(1);

    // Append the '%' symbol and convert it back to a string
    let newPercentage = roundedNumber + "%";

    return newPercentage;
  }


  const getRequestData = (skip, keyword) => {
    setIsLoading(true);
    // gridRef.current.api.showLoadingOverlay();
    axios
      .get("api/request-data?skip=" + skip + "&keyword=" + keyword + "&family=" + family + "&applicant=" + applicant)
      .then((data) => {
        const newRowData = data.response.data.map((row) => ({
          ...row,
          descuento: changePercentContent(row.descuento),
          margen: changePercentContent(row.margen),
          precio_oferta: Number(row.precio_oferta).toLocaleString(),
          precio_minimo: Number(row.precio_minimo).toLocaleString(),
          precio_maximo: Number(row.precio_maximo).toLocaleString(),
          precio_metropolitana: Number(row.precio_metropolitana).toLocaleString(),
          id: row.item_sku_num,
        }));
        if (skip == 0) {
          setRowData(newRowData);
        } else {
          const addedData = [...rowData, ...newRowData];
          setRowData(addedData);
        }
        if (data.response.data.length == 10) {
          setSkip(skip + 10);
        }
        setFamilies(data.response.families)
        setApplicants(data.response.EMAILs)
        // gridRef.current.api.hideOverlay();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error while loading store data from google spreadsheet.");
      });
  }

  const onImportClick = () => {
    ref.current.click();
  };

  const onFileChange = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("file", ref.current.files[0]);
    form.append("email", userData.email);
    console.log("??????????????")
    setIsLoading(true);
    axios
      .post("api/import-request", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((data) => {
        const approvedArray = data.approvedArray;
        setRowData(rowData.filter(row => !approvedArray.find(sa =>
          sa.SKU == row.item_sku_num &&
          sa.tipo_promocion == row.tipo_promocion &&
          sa.fecha_de_inicio == row.fecha_de_inicio &&
          sa.fecha_de_termino == row.fecha_de_termino
        )));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error while loading store data from google spreadsheet.");
      });
  };

  const refreshComponent = () => {
    // Increment the key to trigger a re-render and effectively refresh the component
    // axios
    // .get("api/promo-view-data")
    // .then((data) => {
    //   console.log("data->", data)
    // })
    // .catch(() => {
    //   console.log("Error while loading store data from google spreadsheet.");
    // });
    window.location.reload();
  };

  const handleSelect1Change = (event) => {
    setApplicant(event.target.value);
  };

  const handleSelect2Change = (event) => {
    setFamily(event.target.value);
  };

  const exportClick = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);
  const escapeCSVValue = (value) => {
    if (typeof value !== 'string') {
      value = value !== null && value !== undefined ? value.toString() : '';
    }
    if (value.includes('"')) {
      value = value.replace(/"/g, '""');
    }
    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
      value = `"${value}"`;
    }
    return value;
  };
  
  const convertArrayOfObjectsToCSV = (array) => {
    const keys = Object.keys(array[0]);
    const csvContent = [
      keys.join(','), // Header row
      ...array.map(item => keys.map(key => escapeCSVValue(item[key])).join(',')) // Data rows
    ].join('\n');
  
    return csvContent;
  };
  
  const downloadCSV = (data) => {
    const csv = convertArrayOfObjectsToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="main-body bg-gray-200 relative h-screen">
      <div className="main_body">
        <div
          className={`relative bg-white w-full min-h-screen pt-[15px] md:w-max-[1200px] container_body`}
        >
          <div className="absolute top-6 right-4 flex items-center gap-2 text-black pr-10">
            <img src={userData.picture} className="w-[30px] h-[30px] rounded-full" />
            <div>
              <div className="font-bold text-base">
                Hola, {userData.name}
              </div>
              {/* <div className="text-base">
                {userData.email}
              </div> */}
            </div>
          </div>
          <div className="flex items-center text-[#247395] font-bold text-sm justify-center gap-8">
            <div className="border-b-4 border-[#0066FF] text-[#0066FF] flex flex-col gap-2 items-center">
              <img src={"/message-request.png"} width={20} height={20} />
              SOLICITUDES ACTIVAS
            </div>
            <Link to="/history" className="flex flex-col gap-2 items-center">
              <img src={"/message.png"} width={20} height={20} />
              SEGUIMIENTO SOLICITUDES
            </Link>
          </div>
          <div className="relative">
            <div className="bg-[#0889ac] rounded-r-full text-white text-left py-3 px-2 mymd:px-4 header mt-1 mr-[10px] mymd:mr-[15px]">
              <div className="flex items-center justify-between mx-1 mymd:mx-[12px]">
                <div className="text-section text-white pr-2">
                  <h2 className="font-bold mymd:text-lg text-sm">
                    APLICATIVO DE SOLICITUD DE PROMOCIONES
                  </h2>
                  <p className="font-light text-[12px] mymd:text-sm">
                    Realizado por Business Analytics - BI Chile
                  </p>
                </div>
                <img
                  className="pb-[5px] mymd:pb-[10px] max-w-[150px] mymd:max-w-[150px]"
                  src={siteLogo}
                  width={200}
                  height={40}
                />
              </div>
            </div>
            <div className="absolute top-1.5 rounded-r-full -bottom-1.5 right-[15px] left-0 bg-[#134350]"></div>
          </div>
          <div className="text-[#55C5D5] pl-8 h-[70px] flex justify-between">
            <div className="flex gap-4 items-center">
              <div className="font-bold flex gap-2 items-center text-sm">
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
                <div className="w-0.5 h-0.5 bg-[#55C5D5]"></div>
                <div className="w-0.5 h-0.5 bg-[#55C5D5]"></div>
              </div>
              <div className="text-sm">
                SEGUIMIENTO SOLICITUDES
              </div>
            </div>
          </div>
          <div className="bg-[#EFEFEF] w-full h-[22px] relative">
            <div className="absolute h-[23px] left-0 bottom-0 w-[338px] bg-[#1964BC] rounded-r-full text-sm pl-8 text-white">
              APROBACIÓN PROMOCIÓN
            </div>
          </div>
          <div className="w-full mt-4 p-6 md:px-8 bg-white">
            <div className="4xl:flex 4xl:justify-between">
              <div className="flex gap-4 items-center justify-center pb-2 4xl:pb-0">
                <FormControl fullWidth style={{ width: "200px" }} size="small">
                  <InputLabel id="demo-simple-select-label2">
                    Familia
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select"
                    value={family}
                    label="SOLICITANTE"
                    onChange={handleSelect2Change}
                  >
                    {families.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth style={{ width: "200px" }} size="small">
                  <InputLabel id="demo-simple-select-label">
                    Solicitando
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={applicant}
                    label="FAMILIA"
                    onChange={handleSelect1Change}
                  >
                    {applicants.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                  </Select>
                </FormControl>

                <TextField
                  className="border p-1"
                  id="outlined-basic"
                  label="Buscar SKU"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setSkip(0);
                  }}
                />
              </div>
              <div className="flex gap-4 items-center justify-center">
                <input type="file" ref={ref} onChange={onFileChange} hidden />
                <button onClick={() => getRequestData(skip, keyword)} className="hover:bg-[#d1d1d1] duration-500 font-bold text-xs rounded-lg min-w-[142px] text-center bg-[#E0E0E0] px-4 py-3 items-center">ACTUALIZAR</button>
                <button onClick={() => onImportClick()} className="font-bold duration-500 text-xs rounded-lg min-w-[142px] text-center bg-[#E0E0E0] hover:bg-[#d1d1d1] px-4 py-3 items-center">SUBIR PROMOCIONES CARGADAS</button>
                <button onClick={() => downloadCSV(rowData)} className="font-bold duration-500 text-xs rounded-lg min-w-[142px] text-center bg-[#BAD3DE] px-4 py-3 items-center hover:bg-[#79bcca]">DESCARGAR FORMATO VISUALIZACION</button>
                <button onClick={() => console.log("clicked")} className="font-bold duration-500 text-xs rounded-lg min-w-[142px] text-center bg-[#D4BAD8] hover:bg-[#d0a4d6] px-4 py-3 items-center">DESCARGAR FORMATO PANGUI</button>
                {/* <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#6EA7E5",
                    color: "black",
                    height: "57px",
                  }}
                  onClick={refreshComponent}
                >
                  ACTUALIZAR
                </Button> */}
              </div>
            </div>
            <div className="h-[450px] mt-4 custom-ag-grid relative custom-data-grid">
              {/* {isLoading ? <CustomizedProgressBars /> : null} */}
              <DataGrid
                loading={isLoading}
                rows={rowData}
                columns={columns}
                pageSize={10}
                getCellClassName={getCellClassName}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    position: "sticky",
                    top: 0,
                    zIndex: 1001,
                    backgroundColor: "#fff",
                    borderRight: "1px solid #e0e0e0",
                  },
                  "& .MuiDataGrid-cell": {
                    borderRight: "1px solid #e0e0e0",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestPage;
