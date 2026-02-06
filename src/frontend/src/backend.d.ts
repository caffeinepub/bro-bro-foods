import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Order {
    id: bigint;
    createdAt: Time;
    plateTypeId: bigint;
    totalAmount: bigint;
    quantity: bigint;
    price: bigint;
    plateTypeName: string;
}
export type Time = bigint;
export interface backendInterface {
    createOrder(plateTypeId: bigint, plateTypeName: string, price: bigint, quantity: bigint): Promise<Order>;
    getAllOrders(): Promise<Array<Order>>;
    getOrder(orderId: bigint): Promise<Order | null>;
}
