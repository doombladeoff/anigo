import { useVideoPlayer, VideoView } from "expo-video";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Loader } from "../ui/Loader";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconSymbol } from "../ui/IconSymbol";

type VideoContainerProps = {
    player: ReturnType<typeof useVideoPlayer>;
    videoUrl: string | null;
    videoLoaded: boolean;
    showPlayButton: boolean;
    onPlayPress: () => void;
    nativeControls?: boolean;
};

export const VideoPlayer = ({
    player,
    videoUrl,
    videoLoaded,
    showPlayButton,
    onPlayPress,
    nativeControls = true
}: VideoContainerProps) => {
    const playerRef = useRef<VideoView>(null);

    return (
        <>
            {videoUrl ? (
                <VideoView
                    style={styles.video}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                    contentFit="contain"
                    startsPictureInPictureAutomatically
                    nativeControls={nativeControls}
                    ref={playerRef}
                    importantForAccessibility="no"
                />
            ) : (
                <View style={styles.loaderContainer}>
                    <Loader size={42} color="white" />
                </View>
            )}

            {!videoLoaded && (
                <View style={styles.overlay}>
                    <Loader size={44} color="white" />
                </View>
            )}

            {videoLoaded && showPlayButton && (
                <View style={styles.overlay}>
                    <TouchableOpacity activeOpacity={0.8} onPress={onPlayPress} style={styles.iconShadow} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <IconSymbol name='play.fill' size={44} color={'white'} />
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: 275,
    },
    loaderContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        height: 275,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    iconShadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.65,
        shadowRadius: 10,
    }
});
