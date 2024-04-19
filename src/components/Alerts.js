import React, { useContext } from "react";
import { useAlertContext } from "../context/alert/AlertState";

const Alerts = () => {
  const { alerts } = useAlertContext();

  return (
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div key={alert.id} className={`alert p-1 alert-${alert.type}`}>
        <i className="fas fa-info-circle" /> {alert.msg}
      </div>
    ))
  );
};

export default Alerts;
