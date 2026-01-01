import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGigs, Gig } from "@/context/GigContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Image } from "expo-image";

type NoteType = "event" | "job" | "review" | "general";

interface Note {
  id: string;
  type: NoteType;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  image?: any;
}

const noteTypeLabels: Record<NoteType, { label: string; icon: keyof typeof Feather.glyphMap; color: string }> = {
  event: { label: "Event", icon: "calendar", color: "#8B5CF6" },
  job: { label: "Job", icon: "briefcase", color: "#10B981" },
  review: { label: "Review", icon: "star", color: "#F59E0B" },
  general: { label: "Post", icon: "message-circle", color: Colors.light.primary },
};

const sampleNotes: Note[] = [
  {
    id: "n1",
    type: "event",
    title: "Brooklyn Flea Market This Weekend",
    content: "Come check out local vendors at the Brooklyn Flea! I'll be there selling my homemade jewelry. Stop by booth 42!",
    authorName: "Lisa K.",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    timestamp: "2 hours ago",
  },
  {
    id: "n2",
    type: "review",
    title: "Amazing Dog Walker!",
    content: "Jake T. is the best dog walker in Brooklyn! My pup loves him and always comes home happy and tired. Highly recommend!",
    authorName: "Sarah M.",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    timestamp: "5 hours ago",
  },
  {
    id: "n3",
    type: "job",
    title: "Looking for a House Cleaner",
    content: "Need someone reliable for bi-weekly deep cleaning in Park Slope. 2BR apartment, about 900 sq ft. DM me with your rates!",
    authorName: "Mike R.",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    timestamp: "1 day ago",
  },
  {
    id: "n4",
    type: "general",
    title: "New to the Neighborhood",
    content: "Just moved to Bushwick! Looking for recommendations for local food spots and services. What are your favorites?",
    authorName: "Emma W.",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    timestamp: "2 days ago",
  },
  {
    id: "n5",
    type: "event",
    title: "Free Yoga in Prospect Park",
    content: "Join me Saturday mornings at 9am near the boathouse for free outdoor yoga. All levels welcome, bring your own mat!",
    authorName: "Jade L.",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    timestamp: "3 days ago",
  },
  {
    id: "n6",
    type: "review",
    title: "Best Tacos in Williamsburg",
    content: "Maria's food truck on Bedford Ave is incredible! The al pastor tacos are to die for. Cash only but worth it.",
    authorName: "Carlos D.",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    timestamp: "3 days ago",
  },
  {
    id: "n7",
    type: "job",
    title: "Need Math Tutor for High Schooler",
    content: "Looking for someone to help my daughter with SAT prep. Preferably weekday evenings in Crown Heights area.",
    authorName: "Patricia H.",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    timestamp: "4 days ago",
  },
  {
    id: "n8",
    type: "general",
    title: "Lost Cat - DUMBO Area",
    content: "Orange tabby named Mango, very friendly. Last seen near the waterfront. Please DM if you spot him!",
    authorName: "Kevin T.",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    timestamp: "5 days ago",
  },
  {
    id: "n9",
    type: "event",
    title: "Book Club Starting Up",
    content: "Starting a monthly book club focusing on Brooklyn authors. First meeting at the local library next Thursday!",
    authorName: "Nina C.",
    authorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    timestamp: "5 days ago",
  },
  {
    id: "n10",
    type: "review",
    title: "Fantastic Hair Braider",
    content: "Aminata did my box braids and they look amazing! Super gentle, reasonable prices, and she works from home. 10/10",
    authorName: "Destiny J.",
    authorAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    timestamp: "1 week ago",
  },
  {
    id: "n11",
    type: "job",
    title: "Photographer Needed for Birthday Party",
    content: "Looking for a photographer for my daughter's sweet 16 on Feb 15. Outdoor venue in Greenpoint. 3 hours needed.",
    authorName: "Angela M.",
    authorAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop",
    timestamp: "1 week ago",
  },
  {
    id: "n12",
    type: "general",
    title: "Roommate Wanted - Red Hook",
    content: "Spare room available in 3BR apt. $1200/mo, close to bus stop. Looking for someone quiet and clean. Available March 1.",
    authorName: "Derek S.",
    authorAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop",
    timestamp: "1 week ago",
  },
];

function NoteCard({ note }: { note: Note }) {
  const { theme } = useTheme();
  const typeInfo = noteTypeLabels[note.type];

  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.authorRow}>
          <Image
            source={{ uri: note.authorAvatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.authorInfo}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>{note.authorName}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {note.timestamp}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: typeInfo.color + "20" }]}>
          <Feather name={typeInfo.icon} size={12} color={typeInfo.color} />
          <ThemedText type="small" style={{ color: typeInfo.color, marginLeft: 4 }}>
            {typeInfo.label}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="body" style={[styles.noteTitle, { fontWeight: "600" }]}>
        {note.title}
      </ThemedText>
      <ThemedText type="body" style={{ color: theme.textSecondary }}>
        {note.content}
      </ThemedText>
      <View style={styles.cardFooter}>
        <Pressable style={styles.actionButton}>
          <Feather name="heart" size={18} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: 4 }}>
            Like
          </ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Feather name="message-circle" size={18} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: 4 }}>
            Comment
          </ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Feather name="share" size={18} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: 4 }}>
            Share
          </ThemedText>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function NotesScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={sampleNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="file-text" size={48} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
              No notes yet
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    marginLeft: Spacing.sm,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  noteTitle: {
    marginBottom: Spacing.xs,
  },
  cardFooter: {
    flexDirection: "row",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    gap: Spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
});
