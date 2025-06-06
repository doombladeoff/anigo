import { ImageStyle, ScrollView, ViewStyle } from "react-native";
import { Screenshot } from "@/interfaces/Shikimori.interfaces";
import EnhancedImageViewing from "react-native-image-viewing";
import { useEffect, useRef, useState } from "react";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import { ThemedText } from "@/components/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Skeleton from "@/components/ui/Skeleton";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ScreenshotsListProps {
    images: Screenshot[];
    containerStyle?: ViewStyle;
    imageStyle?: ImageStyle;
    horizontal?: boolean;
    limitShow?: number;
}

export const Screenshots = ({
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
    const [displayIndex, setDisplayIndex] = useState<number>(0);
    const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(images.length).fill(false));

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

    const handleImageLoad = (index: number) => {
        setLoadedImages((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    };

    return (
        <>
            <ScrollView
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={containerStyle}
                bounces={false}
            >
                {images.slice(0, limitShow).map((image, index) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={index} onPress={() => {
                                openViewer(index)
                            }}>
                            {!loadedImages[index] && (
                                <Skeleton width={280} height={180} borderRadius={12} style={{position: 'absolute', zIndex: 200}} />
                            )}
                            <Image
                                source={{ uri: image.originalUrl }}
                                style={imageStyle}
                                onLoadEnd={() => handleImageLoad(index)}
                                transition={1200}
                            />
                        </TouchableOpacity>
                    )
                })}

                {limitShow <= images.length && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ padding: 20, justifyContent: "center", alignItems: "center", flex: 1 }}
                        onPress={() => openViewer(5)}
                    >
                        <ThemedText type="subtitle">+ {images.length - limitShow}</ThemedText>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {imageViewerArr.length > 0 && visible && (
                <>
                    <BlurView
                        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                        tint='dark'
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
                        swipeCloseVelocity={80}
                        swipeToCloseEnabled={true}
                        onImageIndexChange={(index) => setDisplayIndex(index)}
                        doubleTapToZoomEnabled={true}
                        backgroundColor={"rgba(0, 0, 0, 0.9)"}
                        animationType='fade'
                        presentationStyle='overFullScreen'
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