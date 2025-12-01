import React, { useState } from "react";
import OrganizationPage from "./pages/OrganizationPage";
import SubsidiaryPage from "./pages/subsidarypage";
import LocationPage from "./pages/LocationPage";
import DesignationPage from "./pages/DesignationPage"

const App: React.FC = () => {
  const [active, setActive] = useState<"org" | "sub" | "loc" | "Des">("org");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center gap-4 bg-white px-6 py-3 shadow">
        <h1 className="text-lg font-semibold">Master Screens</h1>

        <button
          onClick={() => setActive("org")}
          className={`text-sm ${
            active === "org"
              ? "font-semibold text-blue-600"
              : "text-slate-600"
          }`}
        >
          Organization
        </button>

        <button
          onClick={() => setActive("sub")}
          className={`text-sm ${
            active === "sub"
              ? "font-semibold text-blue-600"
              : "text-slate-600"
          }`}
        >
          Subsidiary
        </button>

         <button
          onClick={() => setActive("loc")}
          className={`text-sm ${
            active === "loc"
              ? "font-semibold text-blue-600"
              : "text-slate-600"
          }`}
        >
          Location
        </button>
         <button
    onClick={() => setActive("Des")}
    className={`text-sm ${
      active === "Des" ? "font-semibold text-blue-600" : "text-slate-600"
    }`}
  >
    Designation
  </button>
</header>

      {active === "org" && <OrganizationPage />}
      {active === "sub" && <SubsidiaryPage />}
      {active === "loc" && <LocationPage />}
      {active === "Des" && <DesignationPage/>}
    </div>
  );
};

export default App;


