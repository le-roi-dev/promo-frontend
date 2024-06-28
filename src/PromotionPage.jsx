import React, { useEffect, useState, useRef } from "react";
import axios from "./connection/axios";
import {
  Button,
  Checkbox,
  TextField,
  Typography,
  Box,
  IconButton,
  Input,
} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import { Select, Option } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./index.scss";
import siteLogo from "./assets/site_logo.png";
import { saveAs } from 'file-saver';
import CustomizedProgressBars from './components/LoadingBar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function PromotionPage({ userData, onLogoutClick, setPage }) {

  const [estado, setEstado] = React.useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [filter, setFilter] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [excelError, setExcelError] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openRequestStatesDialog, setRequestStateDialog] = useState(false);
  const [requestStates, setRequestStates] = useState({
    success: [],
    failed: [],
  });
  const getCellClassName = (params) => {
    const value = params.value;

    if (value == "APROBADO") {
      return 'greenCell'; // Apply the class for red background
    }
    if (value == "RECHAZADO") {
      return 'pinkCell'; // Apply the class for red background
    }
  };
  const handleErrorClose = () => {
    setOpenErrorDialog(false);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleRequestStateClose = () => {
    setRequestStateDialog(false);
  };
  const dialogRefresh = () => {
    handleClose();
    getPromotionData(skip, keyword);
  }
  const [columns, setColumns] = useState([
    {
      field: "imagen_producto",
      headerName: "Imagen producto",
      renderCell: (params) => (
        <div className="flex justify-center w-full">
          <img
            src={`https://sodimac.scene7.com/is/image/SodimacCL/${params.row.item_sku_num}?fmt=jpg&fit=constrain,1&wid=170&hei=170`}
            alt="Producto"
            style={{ width: "50px", height: "50px" }}
            onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
          />
        </div>
      ),
      width: 100,
    },
    {
      field: "item_sku_num",
      headerName: "Sku (DV)",
      width: 100,
      editable: false,
    },
    {
      field: "item_name",
      headerName: "Descripcion",
      width: 170,
      editable: false,
    },
    {
      field: "comprador",
      headerName: "Comprador",
      width: 100,
      editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            {params.value}
        </div>
      )
    },
    {
      field: "tipo_promocion",
      headerName: "Tipo Promocion",
      width: 100,
      editable: false,
    },
    {
      field: "TIENDAS",
      headerName: "Tiendas Aplicar",
      width: 80,
      editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            {params.value}
        </div>
      )
    },
    {
      field: "fecha_de_inicio",
      headerName: "Fecha inicio",
      width: 110,
      editable: false,
    },
    {
      field: "fecha_de_termino",
      headerName: "Fecha fin",
      width: 110,
      editable: false,
    },
    {
      field: "costo",
      headerName: "Costo",
      width: 100,
      editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            {Number(params.value).toLocaleString().split('.')[0]}
        </div>
      )
    },
    {
      field: "precio_minimo",
      headerName: "Precio Minimo",
      width: 100,
      editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            $ {Number(params.value).toLocaleString()}
        </div>
      )
    },
    {
      field: "precio_oferta",
      headerName: "Precio Promocion",
      width: 100,
      editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            $ {Number(params.value).toLocaleString()}
        </div>
      )
    },
    {
      field: "descuento",
      headerName: "Descuento",
      width: 80,
      editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            {changePercentContent(params.value)}
        </div>
      )
    },
    { field: "margen", headerName: "Margen", width: 80, editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            {changePercentContent(params.value)}
        </div>
      )
    }, 
    {
      field: "aprobacion",
      headerName: "Aprobacion",
      width: 150,
      editable: false,
    },
    {
      field: "motivo_aprobacion",
      headerName: "Motivo Rechazo",
      width: 130,
      editable: false,
    },
    { field: "familia", headerName: "Familia", width: 150, editable: false },
    { field: "subfamilia", headerName: "Grupo", width: 120, editable: false },

    {
      field: "unidad_medida",
      headerName: "U/Medida",
      width: 100,
      editable: false,
    },

    { field: "origen_sku", headerName: "Origen", width: 100, editable: false },
    {
      field: "formato_sku",
      headerName: "Formato",
      width: 100,
      editable: false,
    },
    {
      field: "precio_maximo",
      headerName: "Precio Maximo",
      width: 90,
      editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            $ {Number(params.value).toLocaleString()}
        </div>
      )
    },
    {
      field: "precio_metropolitana",
      headerName: "Precio RM",
      width: 80,
      editable: false,
      renderCell: (params) => (
        <div className="w-full text-right">
            $ {Number(params.value).toLocaleString()}
        </div>
      )
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
  const [refreshKey, setRefreshKey] = useState(0);
  const ref = useRef();

  const navigate = useNavigate();

  const handleDownload = () => {
    window.open(
      "https://drive.google.com/uc?id=1DzTa2GHj1kRM9bgGW1kiNaym3r-jXXoX&export=download",
      "_blank"
    );
  };



  const refreshComponent = () => {
    // Increment the key to trigger a re-render and effectively refresh the component
    axios
      .get("api/promo-view-data")
      .then((data) => {
        console.log("data->", data);
      })
      .catch(() => {
        console.log("Error while loading store data from google spreadsheet.");
      });
  };
  const changePercentContent = (value) => {
    if (!value) return null;
    let number = parseFloat(value);

    // Round the number to one decimal place
    let roundedNumber = number.toFixed(1);

    // Append the '%' symbol and convert it back to a string
    let newPercentage = roundedNumber + "%";

    return newPercentage;
  }


  const getPromotionData = (skip, keyword) => {
    setIsLoading(true);
    axios
      .get("api/promo-data?skip=" + skip + "&keyword=" + keyword + "&email=" + userData.email)
      .then((data) => {
        const newRowData = data.response.data.map((row) => ({
          ...row,
          id: row.item_sku_num,
        }));

        if (skip === 0) setRowData(newRowData);
        else setRowData((prevRowData) => -[...prevRowData, ...newRowData]);

        if (data.response.data.length === 10) {
          setSkip(skip + 10);
        }
        setIsLoading(false);
      })
      .catch(() => {
        console.log("Error while loading store data from google spreadsheet.");
      });
  }
  useEffect(() => {
    if (filter == true) {
      const updatedColumns = columns.map((column, index) => {
        if (index !== 10) {
          return column; // Keep the first column as it is
        }
        return { ...column, editable: true }; // Set 'editable' to true for all other columns
      });

      setColumns(updatedColumns);
    }

    getPromotionData(skip, keyword);
  }, [skip, keyword, filter, refreshKey]);

  const onImportClick = () => {
    navigate("/promotion");
    ref.current.click();
  };

  const submitRequest = () => {
    const selectedModels = rowData.filter(row => selectionModel.includes(row.item_sku_num));
    const selectedApprovedOnes = selectedModels.filter(row => row.aprobacion != "RECHAZADO");
    const pre_approvedSKUs = selectedApprovedOnes.map(val => val.item_sku_num);
    if (selectedApprovedOnes.length == 0) return;
    setIsLoading(true);
    axios
      .post("api/add-new-table", { selectedApprovedOnes })
      .then((data) => {
        const mustAddOnes = selectedApprovedOnes.filter(sao => !data.rejectedSKUs.includes(sao.item_sku_num))
        if (mustAddOnes.length > 0) {
          axios
            .post("api/update-promotion-pending", { mustAddOnes })
            .then((res) => {
              console.log("data->", res);
              getPromotionData(skip, keyword)
            })
            .catch(() => {
              console.log("Error while loading store data from google spreadsheet.");
            });
        } else {
          setIsLoading(false);
        }
        console.log("data->", data);
        if (data.rejectedSKUs.length > 0) {
          setRequestStates({
            success: pre_approvedSKUs.filter(pa => !data.rejectedSKUs.includes(pa)),
            failed: data.rejectedSKUs
          });
          setRequestStateDialog(true);
        }
      })
      .catch(() => {
        console.log("Error while loading store data from google spreadsheet.");
      });
  }

  const onFileChange = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("file", ref.current.files[0]);
    form.append("email", userData.email);
    setIsImportLoading(true);
    axios
      .post("api/import-promotion", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((data) => {
        // setPage("promotion");
          setIsImportLoading(false);
        if (data.error) {
          setExcelError(data.error);
          setOpenErrorDialog(true);
        } else if (data.status == "success"){
          setOpenDialog(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDownloadClick = () => {
    navigate("/promotion");
  };

  const handleSelectAceptados = (event) => {
    if (event.target.checked) {
      const selectedIds = rowData
        .filter((row) => row.aprobacion === "APROBADO")
        .map((row) => row.id);
      setSelectionModel(selectedIds);
    } else {
      setSelectionModel([]);
    }
  };

  const handleSelectRechazados = (event) => {
    if (event.target.checked) {
      const selectedIds = rowData
        .filter((row) => row.aprobacion === "RECHAZADO")
        .map((row) => row.id);
      setSelectionModel(selectedIds);
    } else {
      setSelectionModel([]);
    }
  };

  const handleChangeEstado = (event) => {
    setEstado(event.target.value);

    const selectedValue = event.target.value;
    const selectedIds = rowData
      .filter((row) => row.aprobacion === selectedValue)
      .map((row) => row.id);
    setSelectionModel(selectedIds);
  };


  const handleEditCommit = (params) => {
    const { id, field, value } = params;
    console.log("Invodked handle edit commit!");
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {
    const sku = newRow.SKU;
    const precio_oferta = newRow.precio_oferta;
    axios
      .put(`api/promo-data/${sku}`, { precio_oferta })
      .then((res) => {
        console.log("Successfully updated!");
        getPromotionData(skip, keyword);
        return newRow;
      })
      .catch((error) => {
        console.log("There are some issues in network!");
        return oldRow;
      });
  };
  const handleRejectExportClick = () => {
    const columns2 = [
      { headerName: "SKU", field: "item_sku_num" },
      { headerName: "PRECIO", field: "precio_oferta" },
      { headerName: "FECHA_INICIO", field: "fecha_de_inicio" },
      { headerName: "FECHA_FIN", field: "fecha_de_termino" },
      { headerName: "TIENDAS", field: "TIENDAS" },
      { headerName: "TIPO", field: "tipo_promocion" },
      { headerName: "EMAIL", field: "email" },
    ];
    const csvContent = "data:text/csv;charset=utf-8,"
      + columns2.map(column => column.headerName).join(",")
      + "\n"
      + rowData2.filter(row => row.aprobacion == "RECHAZADO").map(row => columns2.map(column => row[column.field]).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "datagrid.csv");
    document.body.appendChild(link);
    link.click();
  };
  return (
    <Box
      className="main-body bg-gray-200 relative"
      sx={{ width: "100%" }}
    >
      {isImportLoading ? <CustomizedProgressBars /> : null}
      <Box className="main_body">
        <Box
          className={`relative bg-white w-full min-h-screen pt-[15px] container_body`}
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
          <div className="flex items-center text-gray-500 text-sm justify-center gap-8">
            <div className="border-b-4 border-[#0066FF] flex flex-col gap-2 items-center text-[#0066FF]">
              <img src={"/telegram-promotion.png"} width={20} height={20} color="#0066FF" />
              ENVÍO SOLICITUD
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
                    SOLICITUD DE PROMOCIONES Y PRECIOS
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
          {/* loi change */}
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
              <div className="text-sm font-bold">
                SEGUIMIENTO SOLICITUDES
              </div>
            </div>

          </div>
          <div className="bg-[#EFEFEF] h-[22px] w-full relative">

          </div>
          {/* finish change */}
          <div className="flex items-center justify-center mt-4 mymd:px-14 bg-white ml-auto mr-auto">
            <div className="px-6 py-4 flex gap-20 items-center">
              <div className="text-center text-xl">
                <div className="text-xs font-bold">EXCEL SOLICITUD PROMOCIONES</div>
                <input type="file" ref={ref} onChange={onFileChange} hidden />
                <Button
                  variant="contained"
                  onClick={onImportClick}
                  sx={{
                    backgroundColor: "#A8CFD7",
                    marginTop: "10px",
                    width: '189px',
                    color: 'black',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#79bcca', // Change to the desired hover color
                    },
                  }}
                >
                  SUBIR
                </Button>
              </div>
              <div className="text-center text-xl">
                <div className="text-xs font-bold">EXCEL BASE PARA CARGA</div>
                <Button
                  variant="contained"
                  onClick={handleDownload}
                  sx={{
                    backgroundColor: "#E8E8E8",
                    marginTop: "10px",
                    width: '189px',
                    color: 'black',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#d1d1d1', // Change to the desired hover color
                    },
                  }}
                >
                  DESCARGAR
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-[#EFEFEF] w-full h-[22px] mt-10 relative">
            <div className="leading-[22px] absolute h-[22px] left-0 bottom-0 w-[338px] bg-[#1964BC] rounded-r-full text-sm pl-8 text-white">
              &gt;&gt; Preaprobación Promoción
            </div>
          </div>
          <div className="3xl:flex 3xl:justify-between mt-10 px-8">
            <div className="flex justify-center items-center gap-7">
              <div className="w-[200px]">
                <TextField
                  id="outlined-search"
                  label="Buscar SKU"
                  type="search"
                  size="small"
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setSkip(0);
                  }}
                />
              </div>
              <div className="w-[200px]">
                <FormControl sx={{ m: 1, minWidth: '200px' }} size="small">
                  <InputLabel id="demo-select-small-label">Estado</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={estado}
                    label="Estado"
                    onChange={handleChangeEstado}
                  >
                    <MenuItem value="APROBADO">Seleccionar Aceptados</MenuItem>
                    <MenuItem value="RECHAZADO">Seleccionar Rechazados</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="flex gap-2 justify-center items-center">
              <button onClick={() => getPromotionData(skip, keyword)} className="hover:bg-[#d1d1d1] duration-500 font-bold text-xs rounded-lg min-w-[142px] text-center bg-[#E0E0E0] px-4 py-3 items-center">ACTUALIZAR</button>
              <button onClick={() => navigate("/history")} className="hover:bg-[#d1d1d1] font-bold duration-500 text-xs rounded-lg min-w-[142px] text-center bg-[#E0E0E0] px-4 py-3 items-center">VER RESULTADOS</button>
              <button onClick={() => setFilter(!filter)} className="hover:bg-[#d1d1d1] font-bold text-xs duration-500 rounded-lg min-w-[142px] text-center bg-[#E0E0E0] px-4 py-3 items-center">EDITAR</button>
              <button onClick={() => handleRejectExportClick()} className="font-bold duration-500 text-xs rounded-lg min-w-[142px] text-center bg-[#D4BAD8] hover:bg-[#d0a4d6] px-4 py-3 items-center">DESCARGAR</button>
              {/* <button onClick={() => navigate("/request")} className="font-bold text-xs rounded-lg min-w-[210px] text-center bg-[#A8CFD7] px-4 py-3 items-center">ENVIAR SOLICITUD APROBADOS</button> */}
              <button onClick={() => submitRequest()} className="font-bold text-xs duration-500 rounded-lg min-w-[142px] text-center bg-[#A8CFD7] hover:bg-[#79bcca] px-4 py-3 items-center">ENVIAR</button>
            </div>
          </div>
          <Box className="w-full px-8 py-6 bg-white relative">
            {/* <CustomizedProgressBars /> */}
            <Box sx={{ height: 450, width: "100%", overflowX: "auto" }} className="custom-data-grid">
              <DataGrid
                loading={isLoading}
                rows={rowData}
                columns={columns}
                pageSize={10}
                checkboxSelection
                rowSelectionModel={selectionModel}
                editMode="row"
                onRowSelectionModelChange={(newSelection) =>
                  setSelectionModel(newSelection)
                }
                onProcessRowUpdateError={(error) => console.log(error)}
                slots={{ toolbar: GridToolbar }}
                onCellEditCommit={(params) => handleEditCommit(params)}
                processRowUpdate={handleProcessRowUpdate}
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
            </Box>
          </Box>
        </Box>

      </Box>

      <Dialog
        open={openErrorDialog}
        onClose={handleErrorClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="excel-error-title">
          Error Found
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {excelError}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="success-update">
          {"Successfully updated"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Actualice la tabla de datos.
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openRequestStatesDialog}
        onClose={handleRequestStateClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="request-state-title text-[#6A93D0] font-bold">
          Estado de solicitud
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="pt-4">
            {
              requestStates.success.length > 0 ?
                <div className="">
                  <div className="text-xl text-[#0BA452] font-bold">EXITO : {requestStates.success.length} elementos </div>
                  <div className="pl-2 text-[#0BA452]">{requestStates.success.join(', ')}</div>
                </div> : null
            }
            {
              requestStates.failed.length > 0 ?
                <div>
                  <div className="text-xl text-[#B64AB0] font-bold">FALLIDA  :  {requestStates.failed.length} items</div>
                  <div className="pl-2 text-[#B64AB0]">Estos SKU ya fueron ingresados ​​anteriormente</div>
                  <div className="pl-2 text-[#B64AB0]">{requestStates.failed.join(', ')}</div>
                </div> : null
            }
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default PromotionPage;
