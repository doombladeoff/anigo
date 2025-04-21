import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import {
    ActivityIndicator,
    FlatList, Keyboard, StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSearchContext, } from "@/context/SearchContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SearchScreen() {
    const headerHeight = useHeaderHeight();
    const bottomHeight = useBottomTabBarHeight();

    const {searchResults, isLoad} = useSearchContext();

    const theme = useColorScheme();

    if (isLoad) {
        return (
            <ThemedView style={{flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color={theme === 'dark' ? 'white' : 'black'}/>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{flex: 1, padding: 10}}>
            <FlatList
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={{flexDirection: 'row'}}>
                            <Image
                                source={{uri: item.poster.originalUrl}}
                                priority="high"
                                transition={400}
                                style={{width: 200 / 1.75, height: 300 / 1.75, borderRadius: 6}}
                            />

                            <View style={styles.infoContainer}>
                                <View>
                                    <ThemedText numberOfLines={2} type="title" style={styles.title}>
                                        {item.russian}
                                    </ThemedText>

                                    {item.status === 'anons' ? (
                                        <ThemedText style={styles.anons}>Анонс</ThemedText>
                                    ) : (
                                        <ThemedText style={{textAlign: 'justify'}}>
                                            Серий: {item.episodes} | {item.rating}
                                        </ThemedText>
                                    )}
                                </View>

                                {item.status !== 'anons' && (
                                    <View style={styles.ratingContainer}>
                                        <AntDesign name="star" size={20} color="green"/>
                                        <ThemedText>{item.score}</ThemedText>
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/(screens)/[id]',
                                            params: {id: item.malId},
                                        })
                                    }
                                >
                                    <ThemedText>Смотреть</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                )}
                contentContainerStyle={{
                    paddingBottom: bottomHeight + 20,
                    paddingTop: headerHeight,
                    gap: 10
                }}
                keyboardShouldPersistTaps="handled"
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        gap: 10,
        paddingLeft: 10,
        flex: 1,
    },
    title: {
        paddingBottom: 5,
        fontSize: 18,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    anons: {
        backgroundColor: 'red',
        borderRadius: 12,
        textAlign: 'center',
        padding: 6,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    btn: {
        backgroundColor: 'rgb(86,70,70)',
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
        alignSelf: 'flex-start',
    }

})