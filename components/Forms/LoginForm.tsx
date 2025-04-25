import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputController } from "@/components/InputController";
import { Loader } from "@/components/ui/Loader";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { useGoogleAuth } from "@/lib/googleAuth";
import { useForm } from "react-hook-form";


interface LoginFormProps {
    defaultEmail?: string;
}
export const LoginForm = ({defaultEmail}: LoginFormProps) => {
    const [loading, setLoading] = useState(false);

    const {login} = useGoogleAuth()

    const form = useForm({
            defaultValues: {
                email: defaultEmail ? defaultEmail : '',
                password: '',
            },
        }),
        {
            control,
            handleSubmit,
            formState: {errors},
        } = form

    const onSubmit = async (data: any) => {
        const {email, password} = data;
        setLoading(true);
        await login(email, password).then(() => setLoading(false));
    };
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 42, marginBottom: 20, color: "white", fontWeight: "bold"}}>Log in</Text>
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

            {errors['email'] && (
                <Text style={{color: 'red', paddingBottom: 10}}>Please enter a valid email</Text>
            )}
            <InputController
                name='password'
                requiredMessage={'This field is required'}
                control={control}
                pattern={{
                    value: /^.{6,}$/,
                    message: 'Password must be at least 6 characters long'
                }}
                placeholder='Password'
                secureTextEntry={true}
                style={styles.input}
            />
            {errors['password'] &&
                <Text style={{color: 'red', paddingBottom: 10}}>{errors['password'].message}</Text>}

            {loading ? (
                <Loader size={64}/>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={handleSubmit((data) => onSubmit(data))}
                        activeOpacity={0.8}
                        style={styles.loginButton}
                    >
                        <ThemedText type="defaultSemiBold" darkColor={'black'} style={styles.loginText}>
                            Login
                        </ThemedText>
                    </TouchableOpacity>
                </>
            )}
        </View>
    )
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
    loginText: {color: "black", fontWeight: "600"},

});
