import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import { UserRole } from "../../app/enums";
import GuardPublicRoute from "../unprotected/GuardGuestRoute";
import GuardProtectedRoute from "../protected/GuardProtectedRoute";
import { publicSubPaths } from "../unprotected/GuestSubPaths";
import AdminLayout from "../../layouts/admin/Admin.layout";
import BuyerLayout from "../../layouts/buyer/Buyer.layout";
import SellerLayout from "../../layouts/seller/Seller.layout";
import ShipperLayout from "../../layouts/shipper/Shipper.layout";
import { AdminRoutes } from "../protected/access/adminPermission";
import { BuyerRoutes } from "../protected/access/buyerPermission";
import { SellerRoutes } from "../protected/access/sellerPermission";
import { ShipperRoutes } from "../protected/access/shipperPermission";

const RunRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {Object.entries(publicSubPaths).map(([_, routes]) =>
                routes.map((route) => (
                    <Route
                        key={route.path || "index"}
                        path={route.path}
                        element={<GuardPublicRoute component={route.element} />}
                    >
                        {route.children?.map((childRoute) => (
                            <Route
                                key={childRoute.path}
                                path={childRoute.path}
                                element={<GuardPublicRoute component={childRoute.element} />}
                            />
                        ))}
                    </Route>
                ))
            )}

            {/* Admin Layout Route */}
            <Route
                path={ROUTER_URL.ADMIN.BASE}
                element={
                    <GuardProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AdminLayout />
                    </GuardProtectedRoute>
                }
            >
                <Route
                    index
                    element={
                        <Suspense>
                            {AdminRoutes.children?.find(route => route.index)?.element}
                        </Suspense>
                    }
                />
                {AdminRoutes.children?.filter(route => !route.index).map(route => {
                    // Compute relative path after the admin base (e.g., 'quan-ly-don-hang' or 'quan-ly-don-hang/:id')
                    let relativePath = route.path;
                    const base = ROUTER_URL.ADMIN.BASE + '/';
                    if (relativePath?.startsWith(base)) {
                        relativePath = relativePath.slice(base.length);
                    } else if (relativePath?.startsWith('/')) {
                        relativePath = relativePath.slice(1);
                    }

                    return (
                        <Route
                            key={route.path}
                            path={relativePath as string}
                            element={
                                <Suspense>
                                    {route.element}
                                </Suspense>
                            }
                        />
                    );
                })}
            </Route>

            {/* Buyer Layout Route */}
            <Route
                path={ROUTER_URL.BUYER.BASE}
                element={
                    <GuardProtectedRoute allowedRoles={[UserRole.BUYER]}>
                        <BuyerLayout />
                    </GuardProtectedRoute>
                }
            >
                <Route
                    index
                    element={
                        <Suspense>
                            {BuyerRoutes.children?.find(route => route.index)?.element}
                        </Suspense>
                    }
                />
                {BuyerRoutes.children?.filter(route => !route.index).map(route => {
                    // Extract the relative path part after the buyer base URL
                    const relativePath = route.path?.includes('/')
                        ? route.path?.split('/').slice(-1)[0]
                        : route.path;

                    return (
                        <Route
                            key={route.path}
                            path={relativePath}
                            element={
                                <Suspense>
                                    {route.element}
                                </Suspense>
                            }
                        />
                    );
                })}
            </Route>

            {/* Seller Layout Route */}
            <Route
                path={ROUTER_URL.SELLER.BASE}
                element={
                    <GuardProtectedRoute allowedRoles={[UserRole.SELLER]}>
                        <SellerLayout />
                    </GuardProtectedRoute>
                }
            >
                <Route
                    index
                    element={
                        <Suspense>
                            {SellerRoutes.children?.find(route => route.index)?.element}
                        </Suspense>
                    }
                />
                {SellerRoutes.children?.filter(route => !route.index).map(route => {
                    const relativePath = route.path?.includes('/')
                        ? route.path?.split('/').slice(-1)[0]
                        : route.path;

                    return (
                        <Route
                            key={route.path}
                            path={relativePath}
                            element={
                                <Suspense>
                                    {route.element}
                                </Suspense>
                            }
                        />
                    );
                })}
            </Route>

            {/* Shipper Layout Route */}
            <Route
                path={ROUTER_URL.SHIPPER.BASE}
                element={
                    <GuardProtectedRoute allowedRoles={[UserRole.SHIPPER]}>
                        <ShipperLayout />
                    </GuardProtectedRoute>
                }
            >
                <Route
                    index
                    element={
                        <Suspense>
                            {ShipperRoutes.children?.find(route => route.index)?.element}
                        </Suspense>
                    }
                />
                {ShipperRoutes.children?.filter(route => !route.index).map(route => {
                    const relativePath = route.path?.includes('/')
                        ? route.path?.split('/').slice(-1)[0]
                        : route.path;

                    return (
                        <Route
                            key={route.path}
                            path={relativePath}
                            element={
                                <Suspense>
                                    {route.element}
                                </Suspense>
                            }
                        />
                    );
                })}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={ROUTER_URL.COMMON.HOME} replace />} />
        </Routes>
    );
};

export default RunRoutes;