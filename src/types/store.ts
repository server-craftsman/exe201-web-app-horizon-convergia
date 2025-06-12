export interface Item {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

export interface StoreState {
    items: Item[];
    addItem: (item: Item) => void;
    removeItem: (id: string) => void;
    toggleItemCompleted: (id: string) => void;
    clearCompletedItems: () => void;
}

export enum ItemFilter {
    ALL = 'all',
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

export type ItemFilterFunction = (items: Item[]) => Item[]; 