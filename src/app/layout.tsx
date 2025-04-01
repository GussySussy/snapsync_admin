import { ReactNode } from "react";
import "./global.css";

export const metadata = {
  title: "SnapSync Admin",
  description: "Admin dashboard for SnapSync application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            {children}
          </div>
        </main>
        <footer className="py-4 text-center bg-white shadow-inner w-full">
          <p className="text-teal-500 font-semibold">Snap Sync</p>
        </footer>
      </body>
    </html>
  );
}
