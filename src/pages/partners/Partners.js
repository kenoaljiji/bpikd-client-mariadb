import React from "react";
import { footerCompanies } from "../../helpers/people";
import { useRouteContext } from "../../context/route/RouteProvider";

const Partners = () => {
  const { state } = useRouteContext();
  const { routes } = state.headersData;
  return (
    <section className="persons">
      <div className="container">
        <h2>{routes?.partners}</h2>

        <div className="grid grid-5 items-center">
          {footerCompanies?.map((company) => (
            <div className="">
              <img
                src={`/assets/images/${company.src}`}
                alt=""
                className="img-fluid w-100"
              />
            </div>
          ))}
          {footerCompanies?.map((company) => (
            <div className="">
              <img
                src={`/assets/images/${company.src}`}
                alt=""
                className="img-fluid w-100"
              />
            </div>
          ))}
          {footerCompanies?.map((company) => (
            <div className="">
              <img
                src={`/assets/images/${company.src}`}
                alt=""
                className="img-fluid w-100"
              />
            </div>
          ))}
          {footerCompanies.map((company) => (
            <div className="">
              <img
                src={`/assets/images/${company.src}`}
                alt=""
                className="img-fluid w-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
