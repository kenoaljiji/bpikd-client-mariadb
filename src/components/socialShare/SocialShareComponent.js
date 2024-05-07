import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook as faFacebook,
  faSquareInstagram as faInstagram,
  // Importing the Telegram icon
  faTelegramPlane as faTelegram,
} from "@fortawesome/free-brands-svg-icons";
// If there's no specific icon for x.com, consider using a generic share icon or another relevant icon
import { faShareSquare as faXcom } from "@fortawesome/free-solid-svg-icons";
import "./socialshare.scss";

const SocialShareComponent = ({ showSocialShare, toggleSocialShare }) => {
  const generateShareLink = (platform) => {
    switch (platform) {
      case "facebook":
        return "https://www.facebook.com/sharer/sharer.php?u=YOUR_URL_HERE";
      case "instagram":
        return "https://www.instagram.com/YOUR_USERNAME_HERE";
      // Adding Telegram case
      case "telegram":
        return "https://telegram.me/share/url?url=YOUR_URL_HERE&text=YOUR_MESSAGE_HERE";
      // Adding x.com case
      case "xcom":
        return "https://x.com/share?url=YOUR_URL_HERE";
      default:
        return "";
    }
  };

  const handleSocialIconClick = (platform) => {
    const shareLink = generateShareLink(platform);
    if (shareLink) {
      window.open(shareLink, "_blank");
    }
  };

  return (
    <div className={`social-share-component ${showSocialShare && "active"}`}>
      <div className="social-share-container">
        <div
          className="social-icon"
          onClick={() => handleSocialIconClick("facebook")}
        >
          <FontAwesomeIcon icon={faFacebook} />
        </div>
        <div
          className="social-icon"
          onClick={() => handleSocialIconClick("instagram")}
        >
          <FontAwesomeIcon icon={faInstagram} />
        </div>
        {/* Telegram Icon */}
        <div
          className="social-icon"
          onClick={() => handleSocialIconClick("telegram")}
        >
          <FontAwesomeIcon icon={faTelegram} />
        </div>
        {/* x.com Icon (Placeholder or specific if available) */}
        <div
          className="social-icon"
          onClick={() => handleSocialIconClick("xcom")}
        >
          <FontAwesomeIcon icon={faXcom} />
        </div>
      </div>
    </div>
  );
};

export default SocialShareComponent;
