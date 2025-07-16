"use client";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-md">
      <div className="text-2xl font-bold text-orange-600">
        <span className="font-serif">M</span>oringa
        <br />
        <span className="text-xs font-light text-gray-700">marketplace</span>
      </div>
      <ul className="flex gap-6 text-sm text-gray-800 font-medium">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
        <li>
          <Link href="/merchandise">Merchandise</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/login">Log in</Link>
        </li>
        <li>
          <Link href="/explore" className="font-semibold">
            portal
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
