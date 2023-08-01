import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "@libs/ui";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Button>testss</Button>
      <div className="w-40 h-50 bg-slate-100">TEST1</div>
    </main>
  );
}
