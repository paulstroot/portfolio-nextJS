"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header id="header" className="bg-dark text-light my-0 sticky top-0 z-50">
      <div className="container m-auto flex justify-between items-center">
        <div className="w-1/2 py-2">
          <h1 className="!text-xs">Paul Stroot | Developer</h1>
        </div>
        <nav className="w-1/2 text-right text-xs flex gap-4 justify-end">
          <Link href="#skills" className="hover:underline hover:text-accent">
            Skills
          </Link>
          <Link href="#projects">Projects</Link>
          <Link href="#recognition">Recognition</Link>
          <Link href="#profile">About</Link>
          <Link href="#contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
