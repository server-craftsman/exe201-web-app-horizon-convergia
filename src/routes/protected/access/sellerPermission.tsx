import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// import page 
const SellerDashboard = lazy(() => import("../../../pages/seller/dashboard"));
const SellerProducts = lazy(() => import("../../../pages/seller/product"));
const SellerActiveProducts = lazy(() => import("../../../pages/seller/active-products"));
const SellerOrders = lazy(() => import("../../../pages/seller/order"));
const SellerSupport = lazy(() => import("../../../pages/seller/support"));
const SellerReviews = lazy(() => import("../../../pages/seller/review"));
const SettingsManagement = lazy(() => import("../../../pages/auth/settings"));
const AddProduct = lazy(() => import("../../../components/seller/product/AddProduct.com"));
// const SellerProfile = lazy(() => import("../../../components/seller/dashboard/Profile"));
// const SellerShop = lazy(() => import("../../../components/seller/dashboard/Shop"));
// const SellerAddProduct = lazy(() => import("../../../components/seller/product/AddProduct"));
// const SellerEditProduct = lazy(() => import("../../../components/seller/product/EditProduct"));

// const SellerInventory = lazy(() => import("../../../pages/seller/inventory"));
// const SellerAnalytics = lazy(() => import("../../../pages/seller/analytics"));
// const SellerPromotions = lazy(() => import("../../../pages/seller/promotion"));
// const SellerNotifications = lazy(() => import("../../../pages/seller/notification"));
// const SellerWallet = lazy(() => import("../../../pages/seller/wallet"));


export const SellerRoutes: RouteObject = {
    path: ROUTER_URL.SELLER.BASE,
    children: [
        {
            index: true,
            element: <SellerDashboard />,
        },
        // { index: false, path: ROUTER_URL.SELLER.PROFILE, element: <SellerProfile /> },
        // { index: false, path: ROUTER_URL.SELLER.SHOP, element: <SellerShop /> },
        { index: false, path: ROUTER_URL.SELLER.PRODUCTS, element: <SellerProducts /> },
        { index: false, path: ROUTER_URL.SELLER.ACTIVE_PRODUCTS, element: <SellerActiveProducts /> },
        { index: false, path: ROUTER_URL.SELLER.ADD_PRODUCT, element: <AddProduct /> },
        // { index: false, path: ROUTER_URL.SELLER.EDIT_PRODUCT, element: <SellerEditProduct /> },
        { index: false, path: ROUTER_URL.SELLER.ORDERS, element: <SellerOrders /> },
        // { index: false, path: ROUTER_URL.SELLER.ORDER_MANAGEMENT, element: <SellerOrderManagement /> },
        // { index: false, path: ROUTER_URL.SELLER.INVENTORY, element: <SellerInventory /> },
        // { index: false, path: ROUTER_URL.SELLER.ANALYTICS, element: <SellerAnalytics /> },
        { index: false, path: ROUTER_URL.SELLER.REVIEWS, element: <SellerReviews /> },
        // { index: false, path: ROUTER_URL.SELLER.PROMOTIONS, element: <SellerPromotions /> },
        // { index: false, path: ROUTER_URL.SELLER.NOTIFICATIONS, element: <SellerNotifications /> },
        // { index: false, path: ROUTER_URL.SELLER.WALLET, element: <SellerWallet /> },
        { index: false, path: ROUTER_URL.SELLER.SETTINGS, element: <SettingsManagement /> },
        { index: false, path: ROUTER_URL.SELLER.SUPPORT, element: <SellerSupport /> },
    ],
};

