"use client";

import Link from "next/link";
import Envelope from "./icons/envelope.js";
import LinkedIn from "./icons/linkedin.js";
import Phone from "./icons/phone.js";
import Pin from "./icons/pin.js";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

const links = () => {
  return [
    {
      href: `mailto:${contactEmail}`,
      text: contactEmail,
      icon: <Envelope />,
    },
    {
      href: "tel:612.209.6177",
      text: "612.209.6177",
      icon: <Phone />,
    },
    {
      href: "https://www.google.com/maps/place/lyndale+neighborhood,+minneapolis/data=!4m2!3m1!1s0x87f6279264db31cf:0xe2a8bc58fbaaec77?sa=X&ved=1t:155783&ictx=111",
      text: "Minneapolis, MN 55408",
      icon: <Pin />,
    },
    {
      href: "https://linkedin.com/in/paul-stroot",
      text: "linkedin.com/in/paul-stroot",
      icon: <LinkedIn />,
    },
  ];
};
export default function ContactButtons() {
  return (
    <ul>
      {links().map((link, i) => (
        <li key={i}>
          <Link
            href={link.href}
            target="_blank"
            className="group flex text-secondary-contrast items-center hover:bg-accent-700 hover:text-accent-contrast border-secondary hover:border-accent border-2 p-4 rounded-2xl"
          >
            <span className="icon w-6 h-6 inline-block mr-2 text-accent group-hover:text-accent-contrast ">
              {link.icon}
            </span>
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}
