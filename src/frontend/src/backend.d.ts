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
export interface Game {
    multiplier: number;
    duration: number;
    timestamp: Time;
    flight_curve?: Array<number>;
}
export interface Pattern {
    pattern: string;
    name: string;
    description: string;
    detected: boolean;
}
export interface UserProfile {
    join_date: Time;
    name: string;
    email: string;
    subscription_type: SubscriptionType;
}
export enum SubscriptionType {
    premium = "premium",
    free = "free",
    basic = "basic"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGame(game: Game): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPatterns(): Promise<Array<Pattern>>;
    getRecentGames(): Promise<Array<Game>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdminBootstrapAvailable(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
