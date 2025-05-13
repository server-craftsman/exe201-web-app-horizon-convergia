import { create } from 'zustand'
import type { Item, StoreState } from '../../types/store'

export const useZustand = create<StoreState>((set) => ({
    items: [],
    addItem: (item: Item) => set((state: StoreState) => ({
        items: [...state.items, item]
    })),
    removeItem: (id: string) => set((state: StoreState) => ({
        items: state.items.filter((i: Item) => i.id !== id)
    })),
    toggleItemCompleted: (id: string) => set((state: StoreState) => ({
        items: state.items.map((item: Item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
        )
    })),
    clearCompletedItems: () => set((state: StoreState) => ({
        items: state.items.filter((item: Item) => !item.completed)
    })),
}))
