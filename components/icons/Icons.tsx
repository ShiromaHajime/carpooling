import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export const IconSave = () => {
  const { colorScheme } = useColorScheme()

  return (
    <FontAwesome name="save" size={24} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}