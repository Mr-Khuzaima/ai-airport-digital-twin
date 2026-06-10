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
          {children}
        </SimulationProvider>
      </body>
    </html>
  );
}
