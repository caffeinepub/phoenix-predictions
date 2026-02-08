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
export interface Analysis {
    tactical_insight: string;
    head_to_head: Array<string>;
    form: Array<string>;
    match_id: bigint;
    confidence_level: ConfidenceLevel;
}
export interface User {
    join_date: Time;
    name: string;
    email: string;
    subscription_type: SubscriptionType;
}
export interface Ticket {
    status: TicketStatus;
    odds: number;
    ticket_type: TicketType;
    selections: Array<bigint>;
}
export interface Match {
    teams: string;
    league: string;
    kickoff_date: Time;
}
export interface UserProfile {
    join_date: Time;
    name: string;
    email: string;
    subscription_type: SubscriptionType;
}
export enum ConfidenceLevel {
    low = "low",
    veryHigh = "veryHigh",
    high = "high",
    moderate = "moderate"
}
export enum SubscriptionType {
    premium = "premium",
    free = "free",
    basic = "basic"
}
export enum TicketStatus {
    win = "win",
    pending = "pending",
    loss = "loss"
}
export enum TicketType {
    train = "train",
    value = "value",
    safe = "safe"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnalysis(match_id: bigint, form: Array<string>, head_to_head: Array<string>, tactical_insight: string, confidence_level: ConfidenceLevel): Promise<void>;
    addMatch(league: string, teams: string, kickoff_date: Time): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bootstrapAdmin(): Promise<void>;
    calculateAccuracy(): Promise<number>;
    createTicket(ticket_type: TicketType, odds: number, selections: Array<bigint>): Promise<bigint>;
    getAllAnalyses(): Promise<Array<Analysis>>;
    getAllMatches(): Promise<Array<[bigint, Match, Analysis | null]>>;
    getAllResults(): Promise<Array<TicketStatus>>;
    getAllResultsWithTickets(): Promise<Array<[bigint, TicketStatus]>>;
    getAllTickets(): Promise<Array<[bigint, Ticket]>>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMatchesByConfidenceLevel(level: ConfidenceLevel): Promise<Array<[bigint, Match, Analysis]>>;
    getResult(ticketId: bigint): Promise<TicketStatus | null>;
    getTicket(ticketId: bigint): Promise<Ticket | null>;
    getTicketTypes(): Promise<Array<[bigint, TicketType]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSubscription(user: Principal): Promise<SubscriptionType | null>;
    isAdminPanelVisible(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    promoteToAdmin(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTicketResult(ticketId: bigint, result: TicketStatus): Promise<void>;
    upgradeSubscription(newType: SubscriptionType): Promise<void>;
}
