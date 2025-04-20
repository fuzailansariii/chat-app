import { WebSocket } from "ws";

export const socketUserMap = new Map<WebSocket, { userId: string }>();
export const clientSubscriptions = new Map<WebSocket, Set<string>>();
