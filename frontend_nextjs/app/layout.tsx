import Sidebar from "../components/Sidebar";
import { SimulationProvider } from "../context/SimulationContext";
import "../styles/globals.css";

export const metadata = {
  title: "AI Airport Digital Twin",
  description: "Real-time airport simulation and AI optimization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased font-sans overflow-x-hidden">
        <SimulationProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64">
              {children}
            </main>
          </div>
        </SimulationProvider>
      </body>
    </html>
  );
}
