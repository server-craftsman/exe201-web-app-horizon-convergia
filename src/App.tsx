import { Suspense } from "react";
import Loading from "./app/screens/Loading";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RunRoutes from "./routes/run";
import ScrollTopButton from "./components/common/ScrollTopButton.com";
import { QueryProvider } from "./providers/QueryProvider";
import StagewiseToolbar from "./components/common/StagewiseToolbar";

export const App = () => {
  const isLoading = useSelector((state: any) => state.loading);

  return (
    <>
      <QueryProvider>
        {isLoading && <Loading />}
        <Suspense>
          <RunRoutes />
        </Suspense>
        <ScrollTopButton />
        <ToastContainer />
        {/* Stagewise Toolbar - Development Only */}
        <StagewiseToolbar />
      </QueryProvider>
    </>
  );
};