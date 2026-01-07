import Facebook from "./icons/facebook.js"
import Guru from "./icons/guru.js"
import LinkedIn from "./icons/linkedin-round.js"
import Upwork from "./icons/upwork.js"
import ThemePicker from "./themePicker"

const socialMediaIcons = [
  {
    name: "Facebook",
    icon: <Facebook />,
    url: "https://www.facebook.com/paul.stroot",
    color: "text-[#3b5998]",
  },
  {
    name: "LinkedIn",
    icon: <LinkedIn />,
    url: "https://linkedin.com/in/paul-stroot",
    color: "text-[#0e76a8]",
  },
  {
    name: "Upwork",
    icon: <Upwork />,
    url: "https://www.upwork.com/freelancers/~018ef4ffa630ed4d6b?mp_source=share",
    color: "text-[#14A800]",
  },
  {
    name: "Guru",
    icon: <Guru />,
    url: "https://www.guru.com/freelancers/paul-stroot",
    color: "text-[#3f75b8]",
  },
]
export default function Footer() {
  return (
    <footer className=" text-light py-12 bg-dark">
      <div className="container m-auto">
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="font-bold font-heading">Paul Stroot</p>

          <div className="flex">
            {socialMediaIcons.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${item.name} profile (opens in new tab)`}
                className={`block w-8 h-8 mx-4 hover:text-foreground transition-colors duration-300 ${item.color}`}
              >
                {item.icon}
                <span className="sr-only">{item.name}</span>
              </a>
            ))}
          </div>
          <ThemePicker />
          <small className="text-xs text-center opacity-50">
						&copy; {new Date().getFullYear()} Paul Stroot. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  )
}
