import type { ApiSuccess } from "../../../client/ApiAgents.types";

// ─── Address Type ─────────────────────────────────────────────────────────────
export interface StoreAddress {
    address: string;
    lat: string;
    lng: string;
    postalCode: string;
    line_1: string;
    line_2: string;
    country: string;
    state_or_province: string;
    district: string;
    city: string;
    village: string;
    town: string;
    land_mark: string;
    instruction: string;
}

// ─── Request Payload Type ─────────────────────────────────────────────────────
export interface BasicDetailsRegisterPayload {
    store_name: string;
    manager_name: string;
    phone_number: string;
    address: StoreAddress;
    lat: string;
    lng: string;
}

// ─── Response Data Type ───────────────────────────────────────────────────────
export interface BasicDetailsRegisterData {
    id: string;
    store_name: string;
    manager_name: string;
    phone_number: string;
    address: StoreAddress;
    lat: string;
    lng: string;
    created_at: string;
    updated_at: string;
}

// ─── Registration Success Response ────────────────────────────────────────────
export type BasicDetailsRegisterResponse = ApiSuccess<BasicDetailsRegisterData>;
