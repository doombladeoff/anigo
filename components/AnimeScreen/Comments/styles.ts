import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    buttonWrapper: {
        marginHorizontal: 10,
        marginBottom: 20,
        shadowColor: 'red',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.65,
        shadowRadius: 10,
        elevation: 5,
    },
    button: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 20
    },
    modalCancelArea: {
        flex: 1,
        gap: 20
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
    },
    sectionTitle: {
        paddingHorizontal: 20,
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 20,
    },
    ratingValue: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "center",
        marginTop: 8,
    },
    input: {
        fontSize: 16,
        marginHorizontal: 20,
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    characterCount: {
        paddingHorizontal: 20,
        paddingTop: 10,
        fontSize: 14,
        color: 'gray',
    },
});
