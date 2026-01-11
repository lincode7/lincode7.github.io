import { SITE_CONFIG } from "../../utils/constants";
function Contact() {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between pt-10 md:pt-[25px] gap-[5px]">
      <a
        href={`tel:${SITE_CONFIG.author.contacts.phone}`}
        className="uppercase tracking-[-0.02em] font-normal hover:opacity-50"
      >
        {SITE_CONFIG.author.contacts.phone}
      </a>
      <a
        href={`mailto:${SITE_CONFIG.author.contacts.email}`}
        className="uppercase tracking-[-0.02em] font-normal hover:opacity-50"
      >
        {SITE_CONFIG.author.contacts.email}
      </a>
      <a
        href={`https:github.com/${SITE_CONFIG.author.contacts.github}`}
        target="_blank"
        className="uppercase tracking-[-0.02em] font-normal hover:opacity-50"
      >
        Github
      </a>
      <div className="space-x-1.5">
        <a
          href={`http://wpa.qq.com/msgrd?v=3&uin=${SITE_CONFIG.author.contacts.qq}&site=qq&menu=yes`}
          target="_blank"
          className="uppercase tracking-[-0.02em] font-normal hover:opacity-50"
        >
          qq
        </a>
        <a
          href={`tencent://message/?uin=${SITE_CONFIG.author.contacts.qq}&Site=qq&Menu=yes`}
          target="_blank"
          className="uppercase tracking-[-0.02em] font-normal hover:opacity-50"
        >
          wechat
        </a>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 lg:px-[50px] pt-5 pb-20 lg:pb-[25px] lg:pt-[75px] flex flex-col">
      <Contact />
    </footer>
  );
}
