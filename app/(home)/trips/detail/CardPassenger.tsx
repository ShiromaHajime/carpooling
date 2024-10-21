import { Badge } from "@/components/Badge"
import { Button } from "@/components/buttons/Button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Card"
import { User, Vehicle } from "@/types/types"
import { Medal } from "lucide-react-native"
import { Text, View } from "react-native"

export const CardPassenger = ({ passenger, isSimple, title }: { passenger: User, isSimple: boolean, title: string }) => {

    return (
        <View className="flex gap-2">
            <Text className="font-semibold text-xl text-foreground">{title}</Text>
            <Card>
                <CardHeader>
                    <View className="flex flex-row justify-between items-center">
                        <View className="flex flex-row items-center">
                            <CardTitle>{passenger.first_name} {passenger.last_name}</CardTitle>
                            <View className="ml-3"><Medal size={25} color={'rgb(251,191,36)'} /></View>
                        </View>
                        {(!isSimple) && (<Button className="bg-background border border-secondary" labelClasses="text-foreground" label="Ver perfil" />)}
                    </View>
                    <CardDescription>Automóvil</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-row justify-between items-center flex-wrap">
                    <Text className="text-sm dark:text-slate-100">Viajes realizados: 4</Text>
                    <Badge label="Conductor destacado" variant={"secondary"} />
                    <View className="flex-wrap"><Badge label="Simpático" className="text-green-500" variant={"secondary"} /></View>
                </CardFooter>
            </Card>
        </View>
    )
}