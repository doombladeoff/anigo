import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import { IconSymbol } from "../IconSymbol";

interface SearchInputProps {
    textColor: string;
    onDebouncedChange: (text: string) => void;
}

export const SearchInput = React.memo(({ textColor, onDebouncedChange, }: SearchInputProps) => {
    const [value, setValue] = useState("");
    const screenWidth = Dimensions.get('screen').width

    useEffect(() => {
        if (value.length === 0) {
            return;
        }
        const timer = setTimeout(() => {
            onDebouncedChange(value);
        }, 1000);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <View style={styles.container}>
            <IconSymbol name='magnifyingglass' size={20} color={'gray'} />
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder="Найти аниме..."
                placeholderTextColor={'gray'}
                style={[{
                    width: screenWidth - 140,
                    color: textColor
                }, styles.input]}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(108,108,108,0.6)',
        borderRadius: 8,
        padding: 10
    },
    input: {
        height: 20,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
    },
})
