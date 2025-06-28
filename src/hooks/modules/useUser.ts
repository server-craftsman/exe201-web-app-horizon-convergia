import { UserSerice } from "@services/user/user.service.ts";
import { useMutation } from "@tanstack/react-query";

// @ts-ignore
import type { RegisterRequest } from "@types/user/User.req.type.ts";
// import type {UserInfo} from "@types/user/User.res.type";
import { helpers } from "@utils/index.ts";
import { UserRoleInteger } from "../../app/enums";

export const useUser = () => {
    const register = useMutation({
        mutationFn: async (data: RegisterRequest) => {
            // Validate required fields
            if (!data.name || !data.email || !data.password) {
                throw new Error('Name, email, and password are required');
            }

            // Additional validation for seller role
            if (data.role === UserRoleInteger.SELLER) {
                if (!data.shopName?.trim()) {
                    throw new Error('Shop name is required for sellers');
                }
                if (!data.shopDescription?.trim()) {
                    throw new Error('Shop description is required for sellers');
                }
                if (!data.businessType?.trim()) {
                    throw new Error('Business type is required for sellers');
                }
            }

            // Prepare registration payload
            const registrationData: RegisterRequest = {
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password.trim(),
                phoneNumber: data.phoneNumber,
                address: data.address?.trim(),
                gender: data.gender,
                dob: data.dob,
                role: data.role || UserRoleInteger.BUYER,
            };

            // Add seller-specific fields if role is seller
            if (data.role === UserRoleInteger.SELLER) {
                registrationData.shopName = data.shopName?.trim();
                registrationData.shopDescription = data.shopDescription?.trim();
                registrationData.businessType = data.businessType?.trim();
            }

            return UserSerice.register(registrationData);
        },
        onSuccess: () => {
            helpers.notificationMessage("Đăng ký thành công!", "success");
        },
        onError: (error: any) => {
            // Handle specific error messages
            let errorMessage = "Đăng ký thất bại! Vui lòng thử lại.";

            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            helpers.notificationMessage(errorMessage, "error");
            console.error('Registration error:', error);
        }
    });

    return {
        register,
    };
}