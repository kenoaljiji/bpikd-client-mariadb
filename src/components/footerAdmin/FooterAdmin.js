import React, { useEffect, useRef, useState } from "react";
import { useFooterContext } from "../../context/footer/FooterProvider";
import "./footerAdmin.scss";
import Alerts from "../Alerts";
import {
  footerCompaniesData,
  footerCompanies as footerCompaniesHelper,
} from "../../helpers/people";

const FooterAdmin = () => {
  const { changeFooter, footerCompanies: footer } = useFooterContext();

  const [footerCompanies, setFooterCompanies] = useState([]);

  useEffect(() => {
    if (footer.length === 0) {
      setFooterCompanies(footerCompaniesData);
    } else setFooterCompanies(footer);
  }, []);

  const handleUpdate = (index, field, value) => {
    const updatedCompanies = footerCompanies.map((company, idx) => {
      if (idx === index) {
        return { ...company, [field]: value };
      }
      return company;
    });
    setFooterCompanies(updatedCompanies);
  };

  const handleImageUpload = (index, files) => {
    if (files.length === 0) {
      console.error("No file selected.");
      return;
    }

    const file = files[0];

    // Update the specific company's image with the new one
    const updatedCompanies = footerCompanies.map((company, idx) => {
      if (idx === index) {
        // Keep existing properties, but also include the file object for upload
        // And optionally set src for preview if needed
        const previewUrl = URL.createObjectURL(file);

        console.log(previewUrl);
        return { ...company, file: file, src: previewUrl };
      }
      return company;
    });

    console.log(updatedCompanies);

    // Update the state with the modified companies array
    setFooterCompanies(updatedCompanies);
  };

  const onClickHandeler = () => {
    changeFooter(footerCompanies);
    console.log(footerCompanies);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between border-bottom px-0 pb-2 mt-2 heading">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <h3>Footer Widgets</h3>
        </div>
      </div>
      <div className="footer-company-grid">
        {footerCompanies?.map((company, index) => (
          <div
            key={index + "eer4" + index}
            className="footer-company-form mb-3"
          >
            <div className="form-group">
              <div className="image-container">
                <img src={company?.src} alt="Featured" />
                <input
                  type="file"
                  name={`companyImage-${index}`} // Add this line to set the name attribute
                  id={"image-upload-" + index}
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(index, e.target.files)}
                  accept="image/*" // Accept images only
                />
                <label
                  htmlFor={"image-upload-" + index}
                  className="bg-success text-white p-1 w-100 mt-1 cursor-pointer"
                >
                  <div className="add-image-placeholder text-center">
                    <i className="fas fa-plus"></i>
                    <span>UPLOAD IMAGE</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-group">
              {/*  <label>Company Name</label> */}
              <input
                type="text"
                placeholder="Company Name"
                className=""
                name={"companies" + index}
                value={company.company}
                onChange={(e) => handleUpdate(index, "company", e.target.value)}
              />
            </div>
            <div className="form-group">
              {/* <label>Description</label> */}
              <textarea
                type="text"
                placeholder="Description"
                className=""
                name={"companies" + index}
                value={company.description}
                onChange={(e) =>
                  handleUpdate(index, "description", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              {/*  <label>URL</label> */}
              <input
                type="text"
                placeholder="Url"
                className=""
                name={"companies" + index}
                value={company.url}
                onChange={(e) => handleUpdate(index, "url", e.target.value)}
              />
            </div>
          </div>
        ))}
        <div className="text-center mt-2 footer-button">
          <div className="center mt-5">
            <Alerts />
          </div>
          <button className="button" onClick={onClickHandeler}>
            UPDATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterAdmin;
