export enum PaymentMethod {
    PAYOS = "payos",
    CASH = "cash",
}

export enum PaymentMethodInteger {
    PAYOS = 0,
    CASH = 1,
}

export enum PaymentStatus {
    Pending = 0,
    Processing = 1,
    Completed = 2,
    Failed = 3,
    Cancelled = 4,
    Refunded = 5
}
