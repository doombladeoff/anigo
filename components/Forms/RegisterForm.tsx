import { InputController } from "@/components/InputController";
import { ThemedText } from "@/components/ThemedText";
import { Loader } from "@/components/ui/Loader";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useGoogleAuth } from "@/lib/googleAuth";

interface RegisterFormProps {
    defaultEmail?: string;
}

export const RegisterForm = ({ defaultEmail = "" }: RegisterFormProps) => {
    const { register } = useGoogleAuth();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: defaultEmail,
            password: "",
            confirmPassword: "",
            username: "",
        },
    });

    const onSubmit = async (data: any) => {
        const { email, password, confirmPassword, username } = data;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        await register(username, email, password);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 42, marginBottom: 20, color: "white", fontWeight: "bold"}}>Register</Text>
            <InputController
                name="username"
                control={control}
                requiredMessage="This field is required"
                placeholder="Username"
                placeholderTextColor="gray"
                style={styles.input}
                pattern={{
                    value: /^.{6,}$/,
                    message: "Username must be at least 6 characters long",
                }}
                inputMode="text"
                autoCapitalize="none"
            />
            {errors.username && (
                <Text style={styles.error}>{errors.username.message}</Text>
            )}

            <InputController
                name="email"
                control={control}
                requiredMessage="This field is required"
                placeholder="example@mail.com"
                placeholderTextColor="gray"
                style={styles.input}
                pattern={{
                    value:
                        /^[a-zA-Z0-9._%+-]+@(gmail\.com|mail\.ru|yandex\.ru|list\.ru|outlook\.com)$/i,
                    message: "Invalid email address",
                }}
                inputMode="email"
                autoCapitalize="none"
            />
            {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
            )}

            <InputController
                name="password"
                control={control}
                requiredMessage="This field is required"
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry
                style={styles.input}
                pattern={{
                    value: /^.{6,}$/,
                    message: "Password must be at least 6 characters long",
                }}
                autoCapitalize="none"
            />
            {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
            )}

            <InputController
                name="confirmPassword"
                control={control}
                requiredMessage="This field is required"
                placeholder="Confirm Password"
                placeholderTextColor="gray"
                secureTextEntry
                style={styles.input}
                pattern={{
                    value: /^.{6,}$/,
                    message: "Password must be at least 6 characters long",
                }}
                autoCapitalize="none"
            />
            {errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword.message}</Text>
            )}

            {loading ? (
                <Loader size={64} />
            ) : (
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    activeOpacity={0.8}
                    style={styles.submitButton}
                >
                    <ThemedText type="defaultSemiBold" darkColor="black">
                        Register
                    </ThemedText>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "rgba(0,0,0,0.81)",
        flex: 1,
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
        shadowOffset: { width: 0, height: 0 },
    },
    error: {
        color: "red",
        paddingBottom: 10,
    },
    submitButton: {
        alignSelf: "center",
        marginTop: 25,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 25,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "white",
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 },
    },
});
