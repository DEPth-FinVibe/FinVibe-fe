import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { ROUTE_CONFIGS } from "@/config/routes.config";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {ROUTE_CONFIGS.map(({ path, component: Component, isProtected }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              ) : (
                <Component />
              )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
