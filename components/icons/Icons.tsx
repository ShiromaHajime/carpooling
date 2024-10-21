import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export const IconSave = () => {
  const { colorScheme } = useColorScheme()

  return (
    <FontAwesome name="save" size={24} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}

export const IconArrowUp = () => {
  const { colorScheme } = useColorScheme()

  return (
    <Entypo name="chevron-up" size={24} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}