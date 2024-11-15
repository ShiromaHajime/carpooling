import { Button } from "@/components/buttons/Button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Card"
import { User, Vehicle } from "@/types/types"
import { Text, View } from "react-native"
import { AvatarImage } from "@/components/Avatar";
import { Toggle } from "@/components/Toggle"
import { Toast } from "@/components/Toast"
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

interface Passanger {
    rating: number,
    rating_count: number,
    user: User
}
interface PropCard {
    passenger: Passanger,
    isSimple: boolean,
    title: string,
    handleDecision: (desicion: boolean, id_user: string) => void,
}

export const CardPassenger = ({ passenger, isSimple, title, handleDecision }: PropCard) => {
    const { colorScheme } = useColorScheme()
    const avatarBlack = require('@/assets/images/user-avatar-black.png')
    const avatarWhite = require('@/assets/images/user-avatar-white.png')
    return (
        <View className="flex gap-2">
            <Text className="font-semibold text-xl text-foreground">{title}</Text>
            <Card>
                <CardHeader>
                    <View className="flex flex-row justify-between items-center">
                        <View className="mr-2">
                            <AvatarImage
                                className="w-16 h-16"
                                source={colorScheme == 'dark' ? avatarWhite : avatarBlack}
                            />
                        </View>
                        <View className="flex flex-row items-center">
                            <CardTitle>{passenger.user.first_name} {passenger.user.last_name}</CardTitle>
                        </View>

                    </View>

                    {(!isSimple) && (
                        <View>
                            <Button className="bg-background border border-secondary" labelClasses="text-foreground" label="ACEPTAR" onPress={() => handleDecision(true, passenger.user.id)} />
                            <Button className="bg-background border border-secondary" labelClasses="text-foreground" label="RECHAZAR" onPress={() => handleDecision(false, passenger.user.id)} />
                        </View>
                    )}
                    <CardDescription></CardDescription>

                </CardHeader>
                <CardFooter className="flex flex-row justify-between items-center flex-wrap">
                    <Button className="bg-background border border-secondary" labelClasses="text-foreground" label="Ver perfil"
                        onPress={() => router.navigate({ pathname: "/home/profile", params: { idDriver: passenger.user.id } })}
                    />
                </CardFooter>
            </Card>
        </View>
    )
}