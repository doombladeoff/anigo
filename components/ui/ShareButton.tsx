import { Share, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

interface ShareButtonProps {
    text: string;
    id: string | number;
    iconColor?: string
}

const onShare = async ({text, id}: ShareButtonProps) => {
    try {
        await Share.share({
            message: `${text}:\n\nhttps://anigoapp.netlify.app/id/${id}`,
            url: `https://anigoapp.netlify.app/id/${id}`,
            title: 'Моя страница',
        });
    } catch (error: any) {
        console.error(error.message);
    }
};

export const ShareButton = ({text, id, iconColor = 'white'}: ShareButtonProps) => {
    return (
        <TouchableOpacity hitSlop={12} onPress={() => onShare({text, id})} style={{paddingBottom: 10}}>
            <FontAwesome6 name="share" size={28} color={iconColor}/>
        </TouchableOpacity>
    )
}