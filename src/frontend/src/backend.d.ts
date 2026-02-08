import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface StatusChangeEvent {
    status: OrderStatus;
    changedAt: Time;
    changedBy: string;
}
export interface BuildStatus {
    deployOutput: string;
    buildOutput: string;
    buildSucceeded: boolean;
    deploySucceeded: boolean;
    appInstallationOutput: string;
    appInstallationSucceeded: boolean;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    paymentMethodId?: bigint;
    createdAt: Time;
    plateTypeId: bigint;
    paymentConfirmation?: PaymentConfirmation;
    totalAmount: bigint;
    quantity: bigint;
    price: bigint;
    statusEvents: Array<StatusChangeEvent>;
    plateTypeName: string;
}
export interface LastBuildStatus {
    status: BuildStatus;
    timestamp: Time;
}
export interface PaymentConfirmation {
    utr: string;
    paymentMethodId: bigint;
    paidVia: string;
    paidAt: Time;
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    outForDelivery = "outForDelivery",
    readyToDeliver = "readyToDeliver",
    delivered = "delivered",
    accepted = "accepted"
}
export interface backendInterface {
    createOrder(plateTypeId: bigint, plateTypeName: string, price: bigint, quantity: bigint): Promise<Order>;
    getAllOrders(): Promise<Array<Order>>;
    getLastBuildStatus(): Promise<LastBuildStatus | null>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getOrderStatusTimeline(orderId: bigint): Promise<Array<StatusChangeEvent> | null>;
    getPaymentConfirmation(orderId: bigint): Promise<PaymentConfirmation | null>;
    updateLastBuildStatus(status: BuildStatus): Promise<void>;
    updateOrderStatus(orderId: bigint, newStatus: OrderStatus, changedBy: string): Promise<Order | null>;
    updatePaymentConfirmation(orderId: bigint, paymentConfirmation: PaymentConfirmation): Promise<Order | null>;
}
