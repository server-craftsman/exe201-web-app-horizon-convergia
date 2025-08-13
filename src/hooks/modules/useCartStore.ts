import { create } from 'zustand';
import { CartService } from '../../services/cart/cart.service';
import type { CartResponse } from '../../types/cart/Cart.res.type';
import { notificationMessage, notifyAddedToCart, notifyCartError, notifyCartItemRemoved, notifyCartQuantityUpdated } from '@utils/helper';

interface CartState {
    cart: CartResponse | null;
    isLoading: boolean;
    error?: string;
    itemCount: number; // số dòng cart detail (distinct items)
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
            const raw = (resp as any)?.data;
            let normalized = CartService.mapRawToCart(raw);

            // If we only have summary items (no real detail ids/prices), fetch details by cartId
            const needsDetailFetch = !normalized.details?.length || normalized.details.some(d => !d.id || d.id.includes(':') || !d.unitPrice);
            if (normalized.id && needsDetailFetch) {
                try {
                    const detResp = await CartService.getCartDetails(normalized.id);
                    const arr = (detResp as any)?.data?.data || (detResp as any)?.data || [];
                    const details = Array.isArray(arr) ? arr.map((d: any) => ({
                        id: d.id,
                        cartId: normalized.id,
                        productId: d.productId,
                        productName: d.productName,
                        productImage: undefined,
                        unitPrice: d.price ?? 0,
                        quantity: d.quantity,
                        subtotal: (d.price ?? 0) * d.quantity,
                    })) : [];
                    const totalQty = details.reduce((s: number, x: any) => s + x.quantity, 0);
                    const totalPrice = details.reduce((s: number, x: any) => s + (x.subtotal || 0), 0);
                    normalized = { ...normalized, details, totalQuantity: totalQty, totalPrice };
                } catch {
                    // ignore and keep normalized
                }
            }

            const detailsCount = (normalized.details || []).length;
            set({ cart: normalized, itemCount: detailsCount, isLoading: false, error: undefined });
        } catch (e: any) {
            notifyCartError(e?.message || 'Không tải được giỏ hàng');
            set({ isLoading: false, error: e?.message || 'Không tải được giỏ hàng' });
        }
    },

    addItem: async (userId: string, productId: string, quantity: number = 1, productName?: string) => {
        set({ isLoading: true });
        try {
            if (!userId) {
                notificationMessage('Vui lòng đăng nhập để thêm vào giỏ hàng', 'warning');
                set({ isLoading: false });
                return;
            }
            const resp = await CartService.addToCart(userId, productId, quantity);
            let normalized = CartService.mapRawToCart((resp as any)?.data?.data);
            // Ensure details are concrete after add
            if (normalized.id) {
                try {
                    const detResp = await CartService.getCartDetails(normalized.id);
                    const arr = (detResp as any)?.data?.data || (detResp as any)?.data || [];
                    const details = Array.isArray(arr) ? arr.map((d: any) => ({
                        id: d.id,
                        cartId: normalized.id,
                        productId: d.productId,
                        productName: d.productName,
                        unitPrice: d.price ?? 0,
                        quantity: d.quantity,
                        subtotal: (d.price ?? 0) * d.quantity,
                    })) : [];
                    const totalQty = details.reduce((s: number, x: any) => s + x.quantity, 0);
                    const totalPrice = details.reduce((s: number, x: any) => s + (x.subtotal || 0), 0);
                    normalized = { ...normalized, details, totalQuantity: totalQty, totalPrice };
                } catch { }
            }
            set({ cart: normalized, itemCount: (normalized.details || []).length, isLoading: false });
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
                const totalPrice = details.reduce((s, d) => s + (d.subtotal || 0), 0);
                set({ cart: { ...current, details, totalQuantity: totalQty, totalPrice }, itemCount: details.length, isLoading: false });
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
            const qty = Math.max(1, Math.trunc(Number(newQuantity) || 0));
            await CartService.updateCartDetailQuantity(cartDetailId, qty);
            // Always refresh cart from server to ensure totals/discounts are correct
            const userId = get().cart?.userId;
            if (userId) {
                await get().loadCart(userId);
                notifyCartQuantityUpdated(qty);
            } else {
                // Fallback optimistic update if userId not available
                const current = get().cart;
                if (current) {
                    const details = (current.details || []).map(d => (d.id === cartDetailId ? { ...d, quantity: qty, subtotal: (d.unitPrice || 0) * qty } : d));
                    const totalQty = details.reduce((s, d) => s + d.quantity, 0);
                    const totalPrice = details.reduce((s, d) => s + (d.subtotal || 0), 0);
                    set({ cart: { ...current, details, totalQuantity: totalQty, totalPrice }, itemCount: details.length, isLoading: false });
                    notifyCartQuantityUpdated(qty);
                } else {
                    set({ isLoading: false });
                }
            }
        } catch (e: any) {
            notifyCartError(e?.message || 'Không thể cập nhật số lượng');
            set({ isLoading: false, error: e?.message || 'Không thể cập nhật số lượng' });
        }
    },
})); 