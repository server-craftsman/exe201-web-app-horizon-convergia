import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import { UserRole } from "../../app/enums";
import GuardPublicRoute from "../unprotected/GuardGuestRoute";
import GuardProtectedRoute from "../protected/GuardProtectedRoute";
import { publicSubPaths } from "../unprotected/GuestSubPaths";
import AdminLayout from "../../layouts/admin/Admin.layout";
import { AdminRoutes } from "../protected/access/adminPermission";
import Loading from "../../app/screens/Loading";

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
                        <Suspense fallback={<Loading />}>
                            {AdminRoutes.children?.find(route => route.index)?.element}
                        </Suspense>
                    }
                />
                {AdminRoutes.children?.filter(route => !route.index).map(route => {
                    // Extract the relative path part after the admin base URL
                    const relativePath = route.path?.includes('/')
                        ? route.path?.split('/').slice(-1)[0]
                        : route.path;

                    return (
                        <Route
                            key={route.path}
                            path={relativePath}
                            element={
                                <Suspense fallback={<Loading />}>
                                    {route.element}
                                </Suspense>
                            }
                        />
                    );
                })}
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default RunRoutes;