import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Card"
import { Driver } from "@/types/types"
import { Medal } from "lucide-react-native"
import { Text, View } from "react-native"

export const CardDriver = ({ driver }: { driver: Driver }) => {

    return (
        <View className="flex gap-2">
            <Text className="font-semibold text-xl text-primary">Acerca del conductor</Text>
            <Card>
                <CardHeader>
                    <View className="flex flex-row justify-between items-center">
                        <View className="flex flex-row items-center">
                            <CardTitle>{driver.first_name} {driver.last_name}</CardTitle>
                            <View className="ml-3"><Medal size={25} color={'rgb(251,191,36)'} /></View>
                        </View>

                        <Button label="Ver perfil" />
                    </View>
                    <CardDescription>Automovil: Bora negro</CardDescription>
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