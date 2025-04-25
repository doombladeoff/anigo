import { ThemedView } from "@/components/ThemedView";
import { useHeaderHeight } from "@react-navigation/elements";
import { ThemedText } from "@/components/ThemedText";
import { Button, ScrollView, TouchableOpacity, useColorScheme, View } from "react-native";
import { Image } from "expo-image";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import { storage } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function ProfileScreen() {
    const headerHeight = useHeaderHeight();

    const {user} = useAuth();
    const isDark = useColorScheme() === "dark";

    if (!user) {
        return (
            <ThemedView style={{
                flex: 1,
                paddingHorizontal: 10,
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingVertical: 300,
                marginTop: -headerHeight
            }}>
                <ThemedText>{JSON.stringify(user, null, 2)}</ThemedText>
                <View style={{alignItems: 'center', gap: 10}}>
                    <Ionicons name="alert-circle" size={64} color={isDark ? 'white' : 'black'}/>
                    <ThemedText type='subtitle'>Войдите в аккаунт</ThemedText>
                </View>
                <TouchableOpacity
                    onPress={()=> {
                        storage.setSkip(false);
                        router.replace({pathname: '/(auth)'})
                    }}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: isDark ? 'white' : 'black',
                        paddingHorizontal: 55,
                        paddingVertical: 10,
                        borderRadius: 15
                    }}>
                    <ThemedText type='defaultSemiBold' lightColor="white" darkColor="black">Войти</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        )
    }

    return (
        <ThemedView style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingBottom: useBottomTabBarHeight(), paddingTop: 20,  paddingHorizontal: 10}}>
                <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                    {user.photoURL ? (
                        <Image source={{uri: user?.photoURL}} style={{borderRadius: 100, width: 80, height: 80}}/>
                    ) : (
                        <View style={{width: 80, height: 80, borderRadius: 100, backgroundColor: 'gray', justifyContent:'center', alignItems:'center'}}>
                            <IconSymbol name={'person.fill'} color={'white'} size={32}/>
                        </View>
                    )}
                    <View>
                        <ThemedText type='title' style={{fontSize: 22}}>{user?.displayName}</ThemedText>
                        <ThemedText type='defaultSemiBold'>{user?.email}</ThemedText>
                    </View>
                </View>

                <Button title={"log out"} onPress={() => {
                    storage.setSkip(false);
                    auth.signOut();
                    router.replace({pathname: '/(auth)'})
                }}/>
            </ScrollView>
        </ThemedView>
    );
}