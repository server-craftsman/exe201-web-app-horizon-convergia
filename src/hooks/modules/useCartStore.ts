import { create } from 'zustand';
import { CartService } from '../../services/cart/cart.service';
import type { CartResponse, CartDetailResponse } from '../../types/cart/Cart.res.type';
import { notifyAddedToCart, notifyCartError, notifyCartItemRemoved, notifyCartQuantityUpdated } from '@utils/helper';

interface CartState {
    cart: CartResponse | null;
    isLoading: boolean;
    error?: string;
    itemCount: number; // tổng số lượng
    loadCart: (userId: string) => Promise<void>;
    addItem: (userId: string, productId: string, quantity?: number, productName?: string) => Promise<void>;
    removeDetail: (cartDetailId: string, productName?: string) => Promise<void>;
    updateQuantity: (cartDetailId: string, newQuantity: number) => Promise<void>;
    clearError: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    isLoading: false,
    error: undefined,
    itemCount: 0,

    clearError: () => set({ error: undefined }),

    loadCart: async (userId: string) => {
        if (!userId) return;
        set({ isLoading: true });
        try {
            const resp = await CartService.getCartByUser(userId);
            const payload = resp.data?.data as CartResponse;
            const totalQty = payload?.totalQuantity || (payload?.details || []).reduce((s, d) => s + d.quantity, 0);
            set({ cart: payload, itemCount: totalQty, isLoading: false, error: undefined });
        } catch (e: any) {
            notifyCartError(e?.message || 'Không tải được giỏ hàng');
            set({ isLoading: false, error: e?.message || 'Không tải được giỏ hàng' });
        }
    },

    addItem: async (userId: string, productId: string, quantity: number = 1, productName?: string) => {
        set({ isLoading: true });
        try {
            await CartService.addToCart(userId, productId, quantity);
            await get().loadCart(userId);
            notifyAddedToCart(productName, quantity);
        } catch (e: any) {
            notifyCartError(e?.message || 'Không thể thêm vào giỏ');
            set({ isLoading: false, error: e?.message || 'Không thể thêm vào giỏ' });
        }
    },

    removeDetail: async (cartDetailId: string, productName?: string) => {
        set({ isLoading: true });
        try {
            await CartService.deleteCartDetail(cartDetailId);
            // Sau khi xóa, tự tính lại itemCount từ state.cart
            const current = get().cart;
            if (current) {
                const details = (current.details || []).filter(d => d.id !== cartDetailId);
                const totalQty = details.reduce((s, d) => s + d.quantity, 0);
                const totalPrice = details.reduce((s, d) => s + d.subtotal, 0);
                set({ cart: { ...current, details, totalQuantity: totalQty, totalPrice }, itemCount: totalQty, isLoading: false });
            } else {
                set({ isLoading: false });
            }
            notifyCartItemRemoved(productName);
        } catch (e: any) {
            notifyCartError(e?.message || 'Không thể xóa sản phẩm khỏi giỏ');
            set({ isLoading: false, error: e?.message || 'Không thể xóa sản phẩm khỏi giỏ' });
        }
    },

    updateQuantity: async (cartDetailId: string, newQuantity: number) => {
        set({ isLoading: true });
        try {
            const resp = await CartService.updateCartDetailQuantity(cartDetailId, newQuantity);
            const updated = resp.data?.data as CartDetailResponse | undefined;
            const current = get().cart;
            if (current && updated) {
                const details = (current.details || []).map(d => (d.id === updated.id ? { ...d, quantity: updated.quantity, subtotal: updated.subtotal } : d));
                const totalQty = details.reduce((s, d) => s + d.quantity, 0);
                const totalPrice = details.reduce((s, d) => s + d.subtotal, 0);
                set({ cart: { ...current, details, totalQuantity: totalQty, totalPrice }, itemCount: totalQty, isLoading: false });
                notifyCartQuantityUpdated(updated.quantity);
            } else {
                set({ isLoading: false });
            }
        } catch (e: any) {
            notifyCartError(e?.message || 'Không thể cập nhật số lượng');
            set({ isLoading: false, error: e?.message || 'Không thể cập nhật số lượng' });
        }
    },
})); 