import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { TouchableOpacity } from "react-native";

export const ButtonSave = ({ onPress, iconColor }: { onPress: () => void, iconColor?: string }) => {
  const { colorScheme } = useColorScheme()

  const newColor = iconColor ? iconColor : (colorScheme == 'dark' ? "#fff" : "#000")

  return (
    <TouchableOpacity onPress={onPress}>
      <FontAwesome name="save" size={24} color={newColor} />
    </TouchableOpacity>
  )

}
