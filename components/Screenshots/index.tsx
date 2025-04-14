import { Image, ImageStyle, Pressable, ScrollView, View, ViewStyle } from "react-native";
import { Screenshot } from "@/interfaces/Shikimori.interfaces";
import EnhancedImageViewing from "react-native-image-viewing";
import { useEffect, useRef, useState } from "react";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import { ThemedText } from "@/components/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

interface ScreenshotsListProps {
    images: Screenshot[];
    containerStyle?: ViewStyle;
    imageStyle?: ImageStyle;
    horizontal?: boolean;
    limitShow?: number;
}

export const ScreenshotsList = ({
                                    images,
                                    containerStyle,
                                    imageStyle,
                                    horizontal = false,
                                    limitShow = 5,
                                }: ScreenshotsListProps) => {
    const safeBottom = useSafeAreaInsets().bottom;
    const imageIndexRef = useRef<number>(0);

    const [imageViewerArr, setImageViewerArr] = useState<Array<ImageSource>>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [displayIndex, setDisplayIndex] = useState<number>(0); // только для текста внизу

    useEffect(() => {
        const arr: Array<ImageSource> = images.map((item) => ({
            uri: item.originalUrl,
        }));
        setImageViewerArr(arr);
    }, [images]);

    const openViewer = (index: number) => {
        imageIndexRef.current = index;
        setDisplayIndex(index);
        setVisible(true);
    };

    return (
    <>
        <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={containerStyle}
        bounces={false}
        >
            {images.slice(0, limitShow).map((image, index) => (
            <Pressable key={index} onPress={() => openViewer(index)}>
                <Image source={{uri: image.originalUrl}} style={imageStyle}/>
            </Pressable>
            ))}

            {limitShow <= images.length && (
            <Pressable
            style={{padding: 20, justifyContent: "center", alignItems: "center"}}
            onPress={() => openViewer(0)}
            >
                <ThemedText type="subtitle">+ {images.length - limitShow}</ThemedText>
                <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.8)"]}
                style={{
                    position: "absolute",
                    width: 200,
                    height: 40,
                    left: -30,
                    transform: [{rotateZ: "270deg"}],
                }}
                />
            </Pressable>
            )}
        </ScrollView>

        {imageViewerArr.length > 0 && visible && (
        <>
            <BlurView
            style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
            tint="regular"
            />
            <EnhancedImageViewing
            images={imageViewerArr}
            imageIndex={imageIndexRef.current}
            visible={visible}
            onRequestClose={() => {
                setVisible(false);
                imageIndexRef.current = 0;
                setDisplayIndex(0);
            }}
            onImageIndexChange={(index) => setDisplayIndex(index)}
            doubleTapToZoomEnabled={true}
            backgroundColor={"rgba(0, 0, 0, 0.9)"}
            presentationStyle="overFullScreen"
            FooterComponent={() => (
            <ThemedText
            style={{
                color: "white",
                textAlign: "center",
                marginBottom: safeBottom,
            }}
            >
                {displayIndex + 1} / {images.length}
            </ThemedText>
            )}
            />
        </>
        )}
    </>
    );
};
