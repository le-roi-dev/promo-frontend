import React, { useEffect, useCallback, useState, useRef } from "react";
import { Header } from "./components/Header";
import { FormBody } from "./components/FormBody";
import { LoadingSpinner } from "./components/LoadingSpinner";
import TypeModal from "./components/TypeModal";
import "./index.scss";
import axios from "./connection/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import CountrySelect from "./components/CountrySelect";
import siteLogo from "./assets/site_logo.png";

function ImportPage({ userData, onLogoutClick, setPage }) {
  const ref = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onImportClick = () => {
    ref.current.click();
  };

  const onFileChange = (e) => {
    e.preventDefault();
    const form = new FormData();
    console.log(ref.current)
    form.append("file", ref.current.files[0]);
    form.append("email", userData.email);
    console.log("form", form)
    axios
      .post("api/import-promotion", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((data) => {
        setPage("promotion");
      })
      .catch((err) => {
        console.log("Error while loading store data from google spreadsheet.");
      });
  };

  const onDownloadClick = () => {
    navigate("/promotion");
  };

  return (
    <div className="main-body bg-gray-200 relative h-screen">
      <div
        className="max-w-screen-xl md:mx-auto main_body"
        style={{ marginBottom: "0px", paddingTop: "0px", paddingBottom: "0px" }}
      >
        <div
          className={`relative bg-white w-full min-h-screen pt-[15px] md:w-max-[1200px] container_body ${isLoading ? "hidden" : "block"
            }`}
        >
          <button className="absolute right-4 top-0" onClick={onLogoutClick}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="ml-1 underline">Cerrar sesión</span>
          </button>
          <>
            <div className="bg-blue-500 bg-gradient-to-r from-blue-600 to-blue-400 rounded-tr-lg rounded-br-lg shadow-2xl text-white text-left py-3 px-2 md:px-4 header mt-4 mx-[10px] md:mx-[15px]">
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
          <div className="w-full mt-4 p-6 md:px-14 bg-white">
            <div className="border bg-gray-100 p-6 flex h-64 items-center">
              <div className="flex-1 text-center text-xl">
                <div>Excel Solicitud Promociones</div>
                <input type="file" ref={ref} onChange={onFileChange} hidden />
                <button
                  onClick={onImportClick}
                  style={{
                    backgroundColor: "#6EE5C8"
                  }}
                  className="mt-4 rounded text-white px-4 py-2"
                >
                  SUBIR
                </button>
              </div>
              <div className="flex-1 text-center text-xl">
                <div>Excel Base para Carga</div>
                <button
                  onClick={onDownloadClick}
                  style={{
                    backgroundColor: "#CD6EE5"
                  }}
                  className="mt-4 rounded text-white px-4 py-2"
                >
                  DESCARGAR
                </button>
              </div>
            </div>
          </div>
        </div>
        {isLoading && <LoadingSpinner isLoading={isLoading} />}
      </div>
    </div>
  );
}

export default ImportPage;
