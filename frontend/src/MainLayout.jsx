import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function MainLayout() {
  return (
    <>
      <Toaster
        position="top-right"
        duration={2000}
        richColors
      />

      {/* Header */}
      <Outlet />
      {/* Footer */}
    </>
  );
}

export default MainLayout;
