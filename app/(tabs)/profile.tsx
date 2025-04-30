import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useColorScheme, StyleSheet, View, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
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
import { useState } from "react";
import { BlurView } from "expo-blur";

const skipOpening = storage.getSkipOpening();

export default function ProfileScreen() {
    const {user} = useAuth();
    const headerHeight = useHeaderHeight();
    const tabBarHeight = useBottomTabBarHeight();
    const isDark = useColorScheme() === "dark";
    const {pickImage, isLoadImage} = useGoogleAuth();

    const [isSkipOpeningEnabled, setSkipOpeningEnabled] = useState<boolean>(skipOpening ?? false);

    if (!user) {
        return (
            <ThemedView style={[styles.centerContainer, {marginTop: -headerHeight}]}>
                <Ionicons name="alert-circle" size={64} color={isDark ? 'white' : 'black'}/>
                <ThemedText type="subtitle">Войдите в аккаунт</ThemedText>
                <TouchableOpacity
                    onPress={() => {
                        storage.setSkip(false);
                        router.replace({pathname: '/(auth)'});
                    }}
                    activeOpacity={0.8}
                    style={[
                        styles.loginButton,
                        {backgroundColor: isDark ? 'white' : 'black'},
                    ]}
                >
                    <ThemedText type="defaultSemiBold" lightColor="white" darkColor="black">
                        Войти
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{flex: 1}}>
            <ScrollView contentContainerStyle={{padding: 20, paddingBottom: tabBarHeight + 20}}>
                <View style={styles.profileRow}>
                    <TouchableOpacity
                        onPress={pickImage}
                        activeOpacity={0.8}
                        disabled={isLoadImage}
                        style={styles.avatarWrapper}
                    >
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{uri: user.avatarURL || user.photoURL || undefined}}
                                style={styles.avatarImage}
                                transition={400}
                            />
                            {(!user.avatarURL && !user.photoURL) && (
                                <View style={styles.avatarOverlay}>
                                    <IconSymbol name="person.fill" color="white" size={32}/>
                                </View>
                            )}
                            {isLoadImage && (
                                <View style={styles.avatarOverlay}>
                                    <Loader size={44}/>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.userInfo}>
                        <ThemedText type="title" style={styles.userName}>{user.displayName}</ThemedText>
                        <ThemedText type="defaultSemiBold">{user.email}</ThemedText>
                    </View>
                </View>

                <View style={styles.lastWatchContainer}>
                    <Image
                        source={{uri: user.lastAnimePoster}}
                        style={[styles.poster, {borderColor: isDark ? 'white' : 'black'}]}
                        transition={400}
                        contentFit="fill"
                    />
                    <View style={{flex: 1, gap: 10}}>
                        <ThemedText type="subtitle" style={styles.lastEpisode}>
                            Последний просмотренный эпизод: {user.lastEpisode}
                        </ThemedText>
                        <TouchableOpacity
                            style={styles.continueBtn}
                            onPress={() => {
                                router.push({pathname: '/(screens)/[id]', params: {id: user.lastAnime}});
                            }}
                        >
                            <ThemedText type="defaultSemiBold" style={styles.continueText}>
                                Продолжить
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                <BlurView
                    style={styles.skipSwitchContainer}
                    tint="systemChromeMaterialDark"
                    intensity={100}
                >
                    <View style={styles.switchRow}>
                        <ThemedText type="defaultSemiBold" style={styles.switchText}>
                            Пропускать опенинги
                        </ThemedText>
                        <Switch
                            value={isSkipOpeningEnabled}
                            onValueChange={(value) => {
                                setSkipOpeningEnabled(value);
                                if (typeof skipOpening === 'undefined') {
                                    Alert.alert('Внимание', 'Не все серии имеют пропуск опенинга.', [{text: 'OK'}]);
                                }
                                storage.setSkipOpening(value);
                            }}
                            hitSlop={{left: 25, top: 25, right: 25, bottom: 25}}
                        />
                    </View>
                </BlurView>

                <TouchableOpacity
                    onPress={() => {
                        router.replace({pathname: '/(auth)'});
                        storage.setSkip(false);
                        auth.signOut();
                    }}
                    activeOpacity={0.8}
                    style={[
                        styles.logoutButton,
                        {backgroundColor: isDark ? '#ff3b30' : '#222'},
                    ]}
                >
                    <ThemedText type="defaultSemiBold" lightColor="white" darkColor="white">
                        Выйти
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
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
        shadowOffset: {width: 0, height: 4},
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
    lastWatchContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    poster: {
        width: 140,
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
    },
    lastEpisode: {
        fontSize: 16,
        marginBottom: 10,
    },
    continueBtn: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    continueText: {
        fontSize: 18,
        color: 'white',
    },
    skipSwitchContainer: {
        width: '100%',
        padding: 10,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchText: {
        fontSize: 18,
    },
    logoutButton: {
        marginTop: 30,
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 12,
    },
});