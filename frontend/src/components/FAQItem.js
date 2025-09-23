import React, { useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FAQItem = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  const wrapperStyle = {
    borderBottom: "1px solid #cfd1dd",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    paddingTop: "1.5rem",
    paddingBottom: "1.75rem",
    color: "#111113",
  };

  const titleStyle = {
    fontWeight: "300",
    fontSize: "1rem",
    textAlign: "left",
    color: isOpen && description ? "orange" : "#111113",
    transition: "color 0.3s",
  };

  const iconStyle = {
    color: isOpen ? "orange" : "inherit",
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.3s",
  };

  const descriptionStyle = {
    width: "100%",
    paddingBottom: "1.75rem",
    paddingRight: "3rem",
  };

  const textStyle = {
    fontWeight: "400",
    fontSize: "13px",
    color: "#5a5c66",
    whiteSpace: "pre-wrap",
    letterSpacing: "-0.015em",
  };

  return (
    <div style={wrapperStyle}>
      <div style={headerStyle} onClick={toggleFAQ}>
        <h3 style={titleStyle}>{title}</h3>
        {description ? (
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        ) : (
          <div />
        )}
      </div>
      {isOpen && description ? (
        <div style={descriptionStyle}>
          <h3 style={textStyle}>{description}</h3>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default FAQItem;
