import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <header className="w-full bg-background border-t border-border border-dashed">
      <div className="p-4 container mx-auto bg-background border-r border-l border-border border-dashed">
        <div className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-text">Ozcan Gida</h1>
          </Link>
        </div>
      </div>
    </header>
  );
}