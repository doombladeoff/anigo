import { StyleSheet } from "react-native";

export default StyleSheet.create({
    card: {
        borderRadius: 10,
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3.84,
    },
    overlay: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        borderRadius: 10,
        zIndex: 1,
    },
    modalContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalFilterBlurBackground: {
        borderRadius: 16,
        padding: 20,
        gap: 10,
        marginBottom: 30,
        overflow: 'hidden',
    },
    modalCloseButton: {
        marginTop: 10,
        alignSelf: "center",
    },
    modalAnimationBackground: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
    }
});
