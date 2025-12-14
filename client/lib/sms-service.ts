import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export interface SMSLogEntry {
  id: string;
  sender: string;
  message: string;
  amount: string;
  trxId: string;
  provider: "BKASH" | "NAGAD" | "ROCKET" | "UPAY" | "UNKNOWN";
  timestamp: number;
  status: "success" | "error" | "pending";
}

const WEBHOOK_URL =
  "https://jleugjmibejzobcsnwmu.supabase.co/functions/v1/sms-confirm";
const SMS_LOG_KEY = "sms_log";
const MAX_LOG_ENTRIES = 5;

export function detectProvider(
  sender: string
): "BKASH" | "NAGAD" | "ROCKET" | "UPAY" | "UNKNOWN" {
  const senderUpper = sender.toUpperCase();
  if (senderUpper.includes("BKASH")) return "BKASH";
  if (senderUpper.includes("NAGAD")) return "NAGAD";
  if (senderUpper.includes("ROCKET")) return "ROCKET";
  if (senderUpper.includes("UPAY")) return "UPAY";
  return "UNKNOWN";
}

export function parseAmount(message: string): string {
  const patterns = [
    /Tk\s*\.?\s*([\d,]+\.?\d*)/i,
    /BDT\s*\.?\s*([\d,]+\.?\d*)/i,
    /Taka\s*\.?\s*([\d,]+\.?\d*)/i,
    /([\d,]+\.?\d*)\s*Tk/i,
    /([\d,]+\.?\d*)\s*BDT/i,
    /([\d,]+\.?\d*)\s*Taka/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/,/g, "");
    }
  }
  return "";
}

export function parseTrxId(message: string): string {
  const patterns = [
    /TrxID\s*:?\s*([A-Z0-9]+)/i,
    /Trx\s*ID\s*:?\s*([A-Z0-9]+)/i,
    /Transaction\s*ID\s*:?\s*([A-Z0-9]+)/i,
    /Trans\.\s*ID\s*:?\s*([A-Z0-9]+)/i,
    /TxnId\s*:?\s*([A-Z0-9]+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return "";
}

export async function sendToWebhook(
  sender: string,
  message: string,
  amount: string,
  trxId: string
): Promise<boolean> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender,
        message,
        amount,
        trxId,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Webhook error:", error);
    return false;
  }
}

export async function getSMSLogs(): Promise<SMSLogEntry[]> {
  try {
    const data = await AsyncStorage.getItem(SMS_LOG_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading SMS logs:", error);
  }
  return [];
}

export async function addSMSLog(entry: SMSLogEntry): Promise<SMSLogEntry[]> {
  try {
    const logs = await getSMSLogs();
    const newLogs = [entry, ...logs].slice(0, MAX_LOG_ENTRIES);
    await AsyncStorage.setItem(SMS_LOG_KEY, JSON.stringify(newLogs));
    return newLogs;
  } catch (error) {
    console.error("Error saving SMS log:", error);
    return [];
  }
}

export async function clearSMSLogs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SMS_LOG_KEY);
  } catch (error) {
    console.error("Error clearing SMS logs:", error);
  }
}

export function isPaymentProvider(sender: string): boolean {
  return detectProvider(sender) !== "UNKNOWN";
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const isSMSSupported = Platform.OS === "android";
