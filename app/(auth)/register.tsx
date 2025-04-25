import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform, StyleSheet, Text,
    TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { RegisterForm } from "@/components/Forms/RegisterForm";

export default function RegisterScreen() {
    const {email} = useLocalSearchParams();

    return (
        <ImageBackground
            source={require("../../assets/images/1.png")}
            style={{flex: 1}}
            contentFit="cover"
        >
            <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={[
                    "rgba(0,0,0, 0.7)",
                    "rgba(0,0,0, 0.8)",
                    "rgba(0,0,0, 0.9)",
                    "black"
                ]}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView style={{flex: 1}}
                                      behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <RegisterForm defaultEmail={email as string}/>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
}
