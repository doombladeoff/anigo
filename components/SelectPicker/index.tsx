import { PickerNativeView, usePickerLayout } from "@rn-elementary/menu";
import { ReactNode } from "react";
import { View } from "react-native";

type PickerItem = {
    label: string;
    value: string;
};

interface PickerComponentProps {
    title: string;
    options: PickerItem[];
    onSelect: (value: string) => void;
    children: ReactNode;
}

export const SelectPicker = ({title, options, onSelect, children}: PickerComponentProps) => {
    const {layout, onLayout} = usePickerLayout();

    return (
    <PickerNativeView
    title={title}
    options={options.map((option) => option.label)}
    onSelect={(e: any) => {
        const selectedTitle = e.nativeEvent.title;
        const selectedOption = options.find((opt) => opt.label === selectedTitle);

        if (selectedOption) onSelect(selectedOption.value);

    }}
    layout={layout}
    >
        <View onLayout={onLayout}>{children}</View>
    </PickerNativeView>
    )
}