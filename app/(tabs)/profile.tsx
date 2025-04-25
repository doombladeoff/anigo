import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useColorScheme, StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Loader } from "@/components/ui/Loader";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { storage } from "@/utils/storage";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function ProfileScreen() {
    const { user } = useAuth();
    const headerHeight = useHeaderHeight();
    const tabBarHeight = useBottomTabBarHeight();
    const isDark = useColorScheme() === "dark";
    const { pickImage, isLoadImage } = useGoogleAuth();

    if (!user) {
        return (
            <ThemedView style={[styles.container, { marginTop: -headerHeight }]}>
                <Ionicons name="alert-circle" size={64} color={isDark ? 'white' : 'black'} />
                <ThemedText type='subtitle'>Войдите в аккаунт</ThemedText>
                <TouchableOpacity
                    onPress={() => {
                        storage.setSkip(false);
                        router.replace({ pathname: '/(auth)' });
                    }}
                    activeOpacity={0.8}
                    style={[
                        styles.loginButton,
                        { backgroundColor: isDark ? 'white' : 'black' },
                    ]}
                >
                    <ThemedText type='defaultSemiBold' lightColor="white" darkColor="black">
                        Войти
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: tabBarHeight + 20 }}>
                <View style={styles.profileRow}>
                    <TouchableOpacity
                        onPress={pickImage}
                        activeOpacity={0.8}
                        disabled={isLoadImage}
                        style={styles.avatarWrapper}
                    >
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: user.avatarURL || user.photoURL || undefined }}
                                style={styles.avatarImage}
                                transition={400}
                            />
                            {(!user.avatarURL && !user.photoURL) && (
                                <View style={styles.avatarOverlay}>
                                    <IconSymbol name={'person.fill'} color='white' size={32} />
                                </View>
                            )}
                            {isLoadImage && (
                                <View style={styles.avatarOverlay}>
                                    <Loader size={44} />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.userInfo}>
                        <ThemedText type='title' style={styles.userName}>{user?.displayName}</ThemedText>
                        <ThemedText type='defaultSemiBold'>{user?.email}</ThemedText>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        storage.setSkip(false);
                        auth.signOut();
                        router.replace({ pathname: '/(auth)' });
                    }}
                    activeOpacity={0.8}
                    style={[styles.logoutButton, { backgroundColor: isDark ? '#ff3b30' : '#222' }]}
                >
                    <ThemedText type='defaultSemiBold' lightColor="white" darkColor="white">
                        Выйти
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    loginButton: {
        paddingHorizontal: 55,
        paddingVertical: 12,
        borderRadius: 15,
        marginTop: 20,
    },
    profileRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarWrapper: {
        width: 80,
        height: 80,
    },
    avatarContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: 'gray',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    avatarOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 100,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 22,
        marginBottom: 4,
    },
    logoutButton: {
        marginTop: 30,
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 12,
    },
});
