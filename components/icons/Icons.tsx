import { AntDesign, Entypo, FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { Car } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Image } from "react-native";

export const IconEdit = () => {
  const { colorScheme } = useColorScheme()

  return (
    <FontAwesome5 name="edit" size={20} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}

export const IconMarker = ({ color }: { color?: string }) => {
  const { colorScheme } = useColorScheme()

  return (
    <FontAwesome5 name="map-marked" size={26} color={color ? color : colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}

export const IconMarkerPin = ({ color }: { color?: string }) => {
  const { colorScheme } = useColorScheme()

  return (
    <FontAwesome5 name="map-marker-alt" size={24} color={color ? color : colorScheme == 'dark' ? "#fff" : "#000"} />

  )
}




export const IconGoogle = ({ className }: { className?: string }) => {
  return (
    <Image source={require('@/assets/images/icons/icon-google.png')} className={className} />
  )
}

export const IconSave = () => {
  const { colorScheme } = useColorScheme()

  return (
    <FontAwesome name="save" size={24} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}

export const IconArrowUp = () => {
  const { colorScheme } = useColorScheme()

  return (
    <FontAwesome6 name="chevron-up" size={20} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}

export const IconChevronDown = () => {
  const { colorScheme } = useColorScheme()
  return (
    <Entypo name="chevron-down" size={20} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}

export const IconChevronUp = () => {
  const { colorScheme } = useColorScheme()
  return (
    <Entypo name="chevron-up" size={20} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}

export const IconCar = () => {
  const { colorScheme } = useColorScheme()
  return (
    <Car size={18} color={colorScheme == 'dark' ? "#fff" : "#000"} />
  )
}


export const IconSendMessage = () => {
  const { colorScheme } = useColorScheme()

  return (
    <FontAwesome name="send-o" size={16} color="#fff" />
  )
}

export const IconCamera = ({ size }: { size?: number }) => {
  const { colorScheme } = useColorScheme()

  return (
    <Entypo name="camera" size={size ?? 24} color={colorScheme == 'light' ? '#fff' : '#000'} />
  )
}
