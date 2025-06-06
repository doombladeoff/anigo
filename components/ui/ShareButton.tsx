import { Share } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { TouchableOpacity } from "react-native-gesture-handler";

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
        <TouchableOpacity hitSlop={12} onPress={() => onShare({text, id})} activeOpacity={0.8} style={{alignItems: 'center'}}>
            <IconSymbol name='arrowshape.turn.up.forward.fill' size={26} color={iconColor}/>
        </TouchableOpacity>
    )
}