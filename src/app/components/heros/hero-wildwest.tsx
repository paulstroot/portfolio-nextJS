import Image from "next/image";
import Link from "next/link";

export default async function Hero() {
  return (
    <section
      id="hero"
      className="hero !p-0 bg-[var(--theme-color-hero-bkg)] text-background-contrast my-0 relative"
    >
      <div className="relative md:absolute top-0 z-0 hero-image h-full right-0 left-0 ">
        <Image
          src={"/images/hero-wildwest.jpg"}
          width={15300}
          height={500}
          // loading="eager"
          alt=""
          className="w-[150%] ml-[-50%] md:h-full object-cover max-h-none max-w-none md:w-full md:ml-auto block h-full "
          aria-hidden="true"
        />
      </div>

      <div className="relative z-[2] container mx-auto text-white flex flex-col md:flex-row justify-center align-center">
        <div className="w-full py-16 md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h1 className="hero-headline">Paul Stroot</h1>
          <h2 className="hero-tagline">The DOM Wrangler</h2>
          <p>Taming wild elements one tag at a time.</p>
          <div className="flex gap-4 mt-4">
            <Link href="#projects" className="btn btn-primary">
              View Work
            </Link>
            <Link href="#contact" className="btn btn-primary">
              Contact Me
            </Link>
          </div>
        </div>

        <div className="w-full flex md:w-1/2 items-center md:items-start"></div>
      </div>
    </section>
  );
}
