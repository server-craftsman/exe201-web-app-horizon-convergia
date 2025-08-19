import { Suspense } from "react";
import Loading from "./app/screens/Loading";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RunRoutes from "./routes/run";
import ScrollTopButton from "./components/common/ScrollTopButton.com";
import { QueryProvider } from "./providers/QueryProvider";
// import StagewiseToolbar from "./components/common/StagewiseToolbar";
// import TwentyFirstToolbar from "./components/common/TwentyFirstToolbar";
// import ChatWidget from "@components/common/ChatWidget.com";
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
        {/* <StagewiseToolbar /> */}
        {/* 21st.dev Toolbar - Development Only */}
        {/* <TwentyFirstToolbar /> */}
      </QueryProvider>
      {/* <ChatWidget /> */}

    </>
  );
};