// import { useEffect, useState, Suspense } from "react";
// import { Navigate } from "react-router-dom";
// import type { RouteObject } from 'react-router-dom';
// import { UserRole } from "../../models/prototype/User";
// import adminRoutes from "../subs/adminRoutes";
// import instructorRoutes from "../subs/instructorRoutes";
// import studentRoutes from "../subs/studentRoutes";
// import Loading from "../../app/redux/Loading";

// const useProtectedRoutes = (): RouteObject[] => {
//   const [role, setRole] = useState<UserRole | null>(null);

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     console.log("storedRole", storedRole); // Kiểm tra giá trị storedRole
//     if (storedRole) {
//       setRole(storedRole as UserRole);
//       console.log("Role set to:", storedRole); // Kiểm tra sau khi setRole
//     }
//   }, []);

//   let roleBasedRoutes: RouteObject[] = [];

//   // Ensure role is set before proceeding
//   if (role === null) {
//     return [
//       {
//         path: "*",
//         element: <Navigate to="/" />
//       }
//     ];
//   }

//   const mapRoutes = (routes: RouteObject[], allowedRole: UserRole): RouteObject[] => {
//     return routes.map((route) => {
//       if ("index" in route && route.index) {
//         return {
//           ...route,
//           element: <Suspense fallback={<Loading />}>{role === allowedRole ? route.element : <Navigate to="/" replace />}</Suspense>
//         };
//       }
//       return {
//         ...route,
//         element: (<Suspense fallback={<Loading />}>{role === allowedRole && route.element ? (route.element as JSX.Element) : <Navigate to="/" replace />}</Suspense>) as JSX.Element,
//         children: Array.isArray(route.children) ? mapRoutes(route.children, allowedRole) : undefined
//       };
//     });
//   };

//   switch (role) {
//     case UserRole.admin:
//       console.log("Admin role detected");
//       console.log("Admin routes:", adminRoutes); // Debug: Kiểm tra adminRoutes
//       roleBasedRoutes = mapRoutes(adminRoutes, UserRole.admin) as RouteObject[];
//       break;
//     case UserRole.instructor:
//       console.log("Instructor role detected");
//       console.log("Instructor routes:", instructorRoutes); // Debug: Kiểm tra instructorRoutes
//       roleBasedRoutes = mapRoutes(instructorRoutes, UserRole.instructor) as RouteObject[];
//       break;
//     case UserRole.student:
//       console.log("Student role detected");
//       console.log("Student routes:", studentRoutes); // Debug: Kiểm tra studentRoutes
//       roleBasedRoutes = mapRoutes(studentRoutes, UserRole.student) as RouteObject[];
//       break;
//     default:
//       console.log("No valid role detected");
//       roleBasedRoutes = [
//         {
//           path: "*",
//           element: <Navigate to="/" />
//         }
//       ];
//       console.log("roleBasedRoutes", roleBasedRoutes); // Debug: Kiểm tra roleBasedRoutes
//   }

//   // Return only the role-based routes, excluding the index route
//   return roleBasedRoutes;
// };

// export default useProtectedRoutes;