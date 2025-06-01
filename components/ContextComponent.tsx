import React, { useCallback, memo } from "react";
import { SFSymbols6_0 } from "sf-symbols-typescript";
import * as ContextMenu from "zeego/context-menu";

type Item = {
    key: string;
    subtitle?: string;
    title: string;
    iconName?: SFSymbols6_0;
    iconColor?: string;
    iconSize?: number;
    onItemPress?: (item: Item) => void;
};

type ContextComponentProps = {
    children: React.ReactNode;
    preview?: JSX.Element;
    items?: Item[];
};

export const ContextComponent = memo(({ children, preview, items }: ContextComponentProps) => {
    const handleSelect = useCallback((item: Item) => () => {
        item.onItemPress?.(item);
    }, []);

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger>{children}</ContextMenu.Trigger>

            <ContextMenu.Content>
                {preview && <ContextMenu.Preview>{preview}</ContextMenu.Preview>}

                {items?.map((item) => (
                    <ContextMenu.Item key={item.key} onSelect={handleSelect(item)}>
                        <ContextMenu.ItemTitle>{item.subtitle}</ContextMenu.ItemTitle>
                        <ContextMenu.ItemSubtitle>{item.title}</ContextMenu.ItemSubtitle>

                        {item.iconName && (
                            <ContextMenu.ItemIcon
                                ios={{
                                    name: item.iconName,
                                    pointSize: item.iconSize ?? 20,
                                    hierarchicalColor: {
                                        dark: item.iconColor ?? "white",
                                        light: item.iconColor ?? "white",
                                    },
                                }}
                            />
                        )}
                    </ContextMenu.Item>
                ))}
            </ContextMenu.Content>
        </ContextMenu.Root>
    );
});
// 