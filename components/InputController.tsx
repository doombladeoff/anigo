import { Controller, ValidationRule } from "react-hook-form";
import { Text, TextInput, TextInputProps } from "react-native";

interface InputControllerProps extends TextInputProps {
    control: any;
    name: string;
    pattern?: ValidationRule<RegExp>;
    requiredMessage: string;
    title?: string
    [key: string]: any
}

export const InputController = ({
    control,
    name,
    pattern,
    requiredMessage,
    title,
    ...inputProps
}: InputControllerProps) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required: {value: true, message: requiredMessage},
                pattern,
            }}
            render={({field: {onChange, value}}) => (
                <>
                    <Text style={{fontSize: 14, color: '#68717a'}}>{title}</Text>
                    <TextInput
                        {...inputProps}
                        onChangeText={onChange}
                        value={value}
                    />
                </>
            )}
        />
    );
};