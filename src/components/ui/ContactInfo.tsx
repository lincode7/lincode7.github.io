import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface ContactInfoProps {
  icon: any;
  value: string;
  link?: string;
  copyable?: boolean;
  onClick?: () => void;
}

export default function ContactInfo({
  icon: Icon,
  value,
  link,
  copyable = true,
}: ContactInfoProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyable) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="py-2 flex-between">
      <div className="flex-left gap-4">
        <Icon size={20} />
        {link ? (
          <a
            href={link}
            target="_blank"
            className="text-primary font-bold flex-center"
          >
            {value}
          </a>
        ) : (
          <span className="font-bold">{value}</span>
        )}
      </div>
      <button className="cursor-pointer hover-scaled" onClick={handleCopy}>
        {copied ? <Check size={16} color="green" /> : <Copy size={16} />}
      </button>
    </div>
  );
}
