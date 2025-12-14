import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Elevation, Typography } from "@/constants/theme";
import {
  SMSLogEntry,
  getSMSLogs,
  addSMSLog,
  detectProvider,
  parseAmount,
  parseTrxId,
  sendToWebhook,
  generateId,
  formatTimestamp,
  isSMSSupported,
} from "@/lib/sms-service";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StatusCard({ isRunning }: { isRunning: boolean }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.statusCard,
        {
          backgroundColor: theme.backgroundDefault,
        },
        Elevation.level2,
      ]}
    >
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: isRunning
                ? Colors.light.success
                : theme.textSecondary,
            },
          ]}
        />
        <ThemedText type="titleLarge" style={styles.statusText}>
          {isRunning ? "Service Running" : "Service Stopped"}
        </ThemedText>
      </View>
      <ThemedText
        type="bodyMedium"
        style={[styles.statusDescription, { color: theme.textSecondary }]}
      >
        {isRunning
          ? "Monitoring incoming SMS from payment providers"
          : "Tap START to begin monitoring payment SMS"}
      </ThemedText>
    </View>
  );
}

function ServiceButton({
  isRunning,
  isLoading,
  onPress,
}: {
  isRunning: boolean;
  isLoading: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const backgroundColor = isRunning ? Colors.light.error : Colors.light.primary;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLoading}
      style={[
        styles.serviceButton,
        { backgroundColor },
        Elevation.level2,
        animatedStyle,
      ]}
      accessibilityLabel={
        isRunning ? "Stop SMS monitoring service" : "Start SMS monitoring service"
      }
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          <MaterialIcons
            name={isRunning ? "stop" : "play-arrow"}
            size={28}
            color="#FFFFFF"
          />
          <ThemedText
            type="labelLarge"
            style={[styles.buttonText, { color: "#FFFFFF" }]}
          >
            {isRunning ? "STOP SERVICE" : "START SERVICE"}
          </ThemedText>
        </>
      )}
    </AnimatedPressable>
  );
}

function InfoCard() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.infoCard,
        { backgroundColor: theme.backgroundSecondary },
      ]}
    >
      <MaterialIcons
        name="info-outline"
        size={20}
        color={Colors.light.primary}
      />
      <ThemedText
        type="bodyMedium"
        style={[styles.infoText, { color: theme.textSecondary }]}
      >
        While running, you'll see: "SMS Reader Active - Do not close"
      </ThemedText>
    </View>
  );
}

function ProviderBadge({ provider }: { provider: SMSLogEntry["provider"] }) {
  const getProviderColor = () => {
    switch (provider) {
      case "BKASH":
        return Colors.light.bkash;
      case "NAGAD":
        return Colors.light.nagad;
      case "ROCKET":
        return Colors.light.rocket;
      case "UPAY":
        return Colors.light.upay;
      default:
        return Colors.light.textSecondary;
    }
  };

  return (
    <View style={[styles.providerBadge, { backgroundColor: getProviderColor() }]}>
      <ThemedText type="labelSmall" style={styles.providerText}>
        {provider}
      </ThemedText>
    </View>
  );
}

function SMSLogItem({ entry }: { entry: SMSLogEntry }) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={[
        styles.logCard,
        { backgroundColor: theme.backgroundDefault },
        Elevation.level1,
      ]}
    >
      <View style={styles.logHeader}>
        <ProviderBadge provider={entry.provider} />
        <View style={styles.logStatus}>
          <MaterialIcons
            name={entry.status === "success" ? "check-circle" : "warning"}
            size={18}
            color={
              entry.status === "success"
                ? Colors.light.success
                : Colors.light.error
            }
          />
        </View>
      </View>

      <ThemedText
        type="bodyMedium"
        style={[styles.logSender, { color: theme.textSecondary }]}
      >
        {entry.sender}
      </ThemedText>

      {entry.amount ? (
        <View style={styles.logAmountRow}>
          <ThemedText type="titleLarge" style={styles.logAmount}>
            Tk {entry.amount}
          </ThemedText>
        </View>
      ) : null}

      {entry.trxId ? (
        <ThemedText
          type="bodyMedium"
          style={[styles.logTrxId, { fontFamily: "monospace" }]}
        >
          TrxID: {entry.trxId}
        </ThemedText>
      ) : null}

      <ThemedText
        type="labelSmall"
        style={[styles.logTimestamp, { color: theme.textSecondary }]}
      >
        {formatTimestamp(entry.timestamp)}
      </ThemedText>
    </Animated.View>
  );
}

function EmptyState() {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="message-text-outline"
        size={64}
        color={theme.textSecondary}
        style={{ opacity: 0.5 }}
      />
      <ThemedText
        type="bodyLarge"
        style={[styles.emptyText, { color: theme.textSecondary }]}
      >
        No SMS activity yet
      </ThemedText>
    </View>
  );
}

function WebNotSupportedBanner() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.webBanner,
        { backgroundColor: Colors.light.warning + "20" },
      ]}
    >
      <MaterialIcons name="phone-android" size={24} color={Colors.light.warning} />
      <View style={styles.webBannerText}>
        <ThemedText type="titleMedium">Run in Expo Go to use this feature</ThemedText>
        <ThemedText
          type="bodyMedium"
          style={{ color: theme.textSecondary }}
        >
          SMS reading requires a real Android device with Expo Go
        </ThemedText>
      </View>
    </View>
  );
}

export default function SMSReaderScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<SMSLogEntry[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const savedLogs = await getSMSLogs();
    setLogs(savedLogs);
  };

  const handleToggleService = useCallback(async () => {
    setIsLoading(true);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsRunning((prev) => !prev);
    setIsLoading(false);

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const simulateIncomingSMS = useCallback(async () => {
    const sampleMessages = [
      {
        sender: "bKash",
        message:
          "You have received Tk 5,000.00 from 01712345678. TrxID: ABC123XYZ. Your new balance is Tk 12,500.00.",
      },
      {
        sender: "Nagad",
        message:
          "Cash In Tk. 2,500.00 from 01898765432. Trx ID NXY789ABC. New balance Tk 8,200.00.",
      },
      {
        sender: "ROCKET",
        message:
          "You received BDT 1,000.00 from 01556677889. Transaction ID: RKT456DEF. Balance: BDT 3,500.00",
      },
    ];

    const sample = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const provider = detectProvider(sample.sender);
    const amount = parseAmount(sample.message);
    const trxId = parseTrxId(sample.message);

    const webhookSuccess = await sendToWebhook(
      sample.sender,
      sample.message,
      amount,
      trxId
    );

    const entry: SMSLogEntry = {
      id: generateId(),
      sender: sample.sender,
      message: sample.message,
      amount,
      trxId,
      provider,
      timestamp: Date.now(),
      status: webhookSuccess ? "success" : "error",
    };

    const newLogs = await addSMSLog(entry);
    setLogs(newLogs);

    await Haptics.notificationAsync(
      webhookSuccess
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {Platform.OS === "web" ? <WebNotSupportedBanner /> : null}

        <StatusCard isRunning={isRunning} />

        <ServiceButton
          isRunning={isRunning}
          isLoading={isLoading}
          onPress={handleToggleService}
        />

        <InfoCard />

        {Platform.OS === "web" && isRunning ? (
          <Pressable
            onPress={simulateIncomingSMS}
            style={[
              styles.simulateButton,
              { backgroundColor: Colors.light.secondary },
            ]}
          >
            <MaterialIcons name="send" size={20} color="#FFFFFF" />
            <ThemedText
              type="bodyMedium"
              style={{ color: "#FFFFFF", marginLeft: Spacing.sm }}
            >
              Simulate Incoming SMS
            </ThemedText>
          </Pressable>
        ) : null}

        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <ThemedText type="titleMedium">Recent Activity</ThemedText>
            <View style={[styles.countBadge, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText type="labelSmall" style={{ color: theme.textSecondary }}>
                Last {MAX_LOG_DISPLAY}
              </ThemedText>
            </View>
          </View>

          {logs.length === 0 ? (
            <EmptyState />
          ) : (
            logs.map((entry) => <SMSLogItem key={entry.id} entry={entry} />)
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const MAX_LOG_DISPLAY = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statusCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  statusText: {
    flex: 1,
  },
  statusDescription: {
    marginLeft: Spacing.lg + Spacing.xs,
  },
  serviceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  buttonText: {
    letterSpacing: 1,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
  },
  logsSection: {
    marginTop: Spacing.md,
  },
  logsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  countBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  logCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  providerBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  providerText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  logStatus: {},
  logSender: {
    marginBottom: Spacing.xs,
  },
  logAmountRow: {
    marginBottom: Spacing.xs,
  },
  logAmount: {
    fontWeight: "700",
  },
  logTrxId: {
    marginBottom: Spacing.xs,
  },
  logTimestamp: {
    marginTop: Spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  emptyText: {
    opacity: 0.7,
  },
  webBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.md,
  },
  webBannerText: {
    flex: 1,
    gap: Spacing.xs,
  },
  simulateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
});
