import { Suspense } from "react";
// import Loading from "./app/redux/Loading";
// import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RunRoutes from "./routes/run";
import ScrollTopButton from "./components/common/ScrollTopButton.com";
export const App = () => {
  // const isLoading = useSelector((state: any) => state.loading);

  return (
    <>
      {/* {isLoading && <Loading />} */}
      <Suspense>
        <RunRoutes />
      </Suspense>
      <ScrollTopButton />
      <ToastContainer />
    </>
  );
};