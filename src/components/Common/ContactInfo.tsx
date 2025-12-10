import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import React, { ReactNode, useState } from "react";
import "./ContactInfo.css";

interface ContactInfoProps {
  icon: ReactNode;
  label: string;
  value: string;
  type?: "email" | "phone" | "link" | "text" | "location" | "social";
  link?: string;
  copyable?: boolean;
  verified?: boolean;
  description?: string;
  onClick?: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  icon,
  label,
  value,
  type = "text",
  link,
  copyable = true,
  verified = false,
  description,
  onClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const getDefaultIcon = () => {
    switch (type) {
      case "email":
        return <Mail size={18} />;
      case "phone":
        return <Phone size={18} />;
      case "link":
        return <ExternalLink size={18} />;
      case "location":
        return <MapPin size={18} />;
      case "social":
        return <MessageSquare size={18} />;
      default:
        return <Globe size={18} />;
    }
  };

  const getLinkHref = () => {
    switch (type) {
      case "email":
        return `mailto:${value}`;
      case "phone":
        return `tel:${value}`;
      default:
        return link || "#";
    }
  };

  const handleCopy = async () => {
    if (!copyable) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setShowTooltip(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

      setTimeout(() => {
        setShowTooltip(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const renderValue = () => {
    if (link) {
      return (
        <a
          href={getLinkHref()}
          target={type === "link" ? "_blank" : undefined}
          rel={type === "link" ? "noopener noreferrer" : undefined}
          className="contact-link"
          onClick={handleClick}
        >
          {value}
          {type === "link" && (
            <ExternalLink size={14} className="external-icon" />
          )}
        </a>
      );
    }

    return <span className="contact-value">{value}</span>;
  };

  return (
    <div className={`contact-info ${onClick || link ? "clickable" : ""}`}>
      <div className="contact-info-header">
        <div className="contact-icon-wrapper">
          <div className="contact-icon">{icon || getDefaultIcon()}</div>
          {verified && (
            <span className="verified-badge" title="已验证">
              ✓
            </span>
          )}
        </div>

        <div className="contact-label-wrapper">
          <span className="contact-label">{label}</span>
          {description && (
            <span className="contact-description">{description}</span>
          )}
        </div>

        {copyable && (
          <button
            className={`copy-button ${copied ? "copied" : ""}`}
            onClick={handleCopy}
            aria-label={copied ? "已复制" : "复制"}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => !copied && setShowTooltip(false)}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {showTooltip && (
              <div className="copy-tooltip">
                {copied ? "已复制!" : "点击复制"}
              </div>
            )}
          </button>
        )}
      </div>

      <div className="contact-info-content">{renderValue()}</div>

      <div className="contact-info-footer">
        <div className="contact-type-indicator">
          <span className="type-label">{type}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
export type { ContactInfoProps };
