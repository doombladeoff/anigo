import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useCallback } from "react";
import { router } from "expo-router";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InputController } from "@/components/InputController";
import { storage } from "@/utils/storage";
import * as Haptics from "expo-haptics";
import { useGoogleAuth } from "@/lib/googleAuth";

export default function AuthScreen() {
    const insets = useSafeAreaInsets();
    const translateX = useSharedValue(0);

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            email: ''
        }
    });

    const {promptAsync} = useGoogleAuth();

    const animatedInputStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
    }));

    const triggerShakeAnimation = useCallback(() => {
        [-10, 10, -10, 10, 0].forEach((val, i) =>
            setTimeout(() => {
                translateX.value = withTiming(val, {duration: 50, easing: Easing.linear});
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }, i * 50)
        );
    }, []);

    const onError = useCallback(() => {
        if (errors?.email) triggerShakeAnimation();
    }, [errors, triggerShakeAnimation]);

    const onSubmit = useCallback((data: any) => {
        Keyboard.dismiss();
        router.push({pathname: "/(auth)/login", params: {email: data.email}});
    }, []);


    return (
        <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
            <ImageBackground source={undefined} style={styles.background}>
                <LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={["rgba(0,0,0, 0.7)", "rgba(0,0,0, 0.8)", "rgba(0,0,0, 0.9)", "black"]}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
                        <Animated.View style={[styles.inner, {paddingTop: insets.top}]}>
                            <TouchableOpacity
                                onPress={() => {
                                    storage.setSkip(true);
                                    router.replace({pathname: "/(tabs)/(home)"});
                                }}
                                hitSlop={10}
                                activeOpacity={0.8}
                                style={styles.skipButtonContainer}
                            >
                                <ThemedText type="defaultSemiBold" style={styles.skipButtonText}>Skip</ThemedText>
                            </TouchableOpacity>

                            <View style={styles.formContainer}>
                                <Text style={styles.title}>Log in</Text>

                                <Animated.View style={animatedInputStyle}>
                                    <InputController
                                        name="email"
                                        control={control}
                                        requiredMessage="This field is required"
                                        placeholder="example@mail.com"
                                        placeholderTextColor="gray"
                                        style={styles.input}
                                        pattern={{
                                            value: /^[a-zA-Z0-9._%+-]+@(gmail\.com|mail\.ru|yandex\.ru|list\.ru|outlook\.com)$/i,
                                            message: "Invalid email address"
                                        }}
                                        inputMode="email"
                                        autoCapitalize='none'
                                    />
                                </Animated.View>

                                {errors.email && (
                                    <Text style={styles.errorText}>Please enter a valid email</Text>
                                )}

                                <TouchableOpacity
                                    onPress={handleSubmit(onSubmit, onError)}
                                    style={styles.loginButton}
                                    activeOpacity={0.8}
                                >
                                    <FontAwesome6 name="arrow-right" size={20} color="black"/>
                                    <Text style={styles.loginText}>Continue</Text>
                                </TouchableOpacity>

                                <View style={styles.orContainer}>
                                    <View style={styles.orLine}/>
                                    <Text style={styles.orText}>or</Text>
                                    <View style={styles.orLine}/>
                                </View>

                                <View style={styles.socialButtonsContainer}>
                                    {["google", "apple"].map((icon, i) => (
                                        <TouchableOpacity
                                            key={icon}
                                            style={[styles.socialButton, i === 0 && styles.marginRight]}
                                            onPress={() => promptAsync()}
                                        >
                                            <FontAwesome6 name={icon} size={26 + (icon === "apple" ? 2 : 0)}
                                                          color="white"/>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={[styles.registerFooter, {marginBottom: useSafeAreaInsets().bottom * 2}]}>
                                    <ThemedText type='default' style={{fontSize: 16}}>Do not have account?</ThemedText>
                                    <TouchableOpacity
                                        hitSlop={15}
                                        activeOpacity={1}
                                        onPress={() => router.push('/(auth)/register')}
                                    >
                                        <ThemedText type='link' style={{fontSize: 16}}>Register</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flex: {
        flex: 1
    },
    background: {
        flex: 1,
        zIndex: -2
    },
    inner: {
        flex: 1,
        paddingHorizontal: 20
    },
    skipButtonContainer: {
        alignSelf: "flex-end",
        marginTop: 10
    },
    skipButtonText: {
        fontSize: 18
    },
    title: {
        fontSize: 42,
        marginBottom: 20,
        color: "white",
        fontWeight: "bold"
    },
    formContainer: {
        flex: 1,
        justifyContent: "center"
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "white",
        shadowColor: "white",
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowOffset: {width: 0, height: 0}
    },
    loginButton: {
        alignSelf: "center",
        marginTop: 25,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 25,
        flexDirection: "row",
        gap: 10,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "white",
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowOffset: {width: 0, height: 0}
    },
    loginText: {
        color: "black",
        fontWeight: "600"
    },
    errorText: {
        color: "red",
        paddingTop: 10
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        alignSelf: "center"
    },
    orLine: {
        borderWidth: 1,
        borderRadius: 25,
        width: 115,
        borderColor: "white",
        height: 1
    },
    orText: {
        color: "white",
        marginHorizontal: 10
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    socialButton: {
        backgroundColor: "rgba(89,88,88,0.8)",
        padding: 10,
        borderRadius: 100,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    marginRight: {
        marginRight: 10
    },
    registerFooter: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        flexDirection: 'row',
        gap: 10,
    }
});
