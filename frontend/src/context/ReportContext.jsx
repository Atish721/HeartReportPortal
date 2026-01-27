import { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [lipidProfile, setLipidProfile] = useState(null);
  const [lifestyle, setLifestyle] = useState([]);
  const [ecgImageBase64, setEcgImageBase64] = useState(null);

  return (
    <ReportContext.Provider value={{
      patient,
      setPatient,
      healthMetrics,
      setHealthMetrics,
      lipidProfile,
      setLipidProfile,
      lifestyle,
      setLifestyle,
      ecgImageBase64,
      setEcgImageBase64
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
