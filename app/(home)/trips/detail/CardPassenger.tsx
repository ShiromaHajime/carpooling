import { Badge } from "@/components/Badge"
import { Button } from "@/components/buttons/Button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Card"
import { User, Vehicle } from "@/types/types"
import { Text, View } from "react-native"
import { AvatarImage } from "@/components/Avatar";
import { Toggle } from "@/components/Toggle"
import { Toast } from "@/components/Toast"



const handleAccept = () => {
    console.log("ha aceptado al pasajero")
}
const handleReject = () => {
    console.log("NOOOOOOOO LO RECHAZOOO")
}


export const CardPassenger = ({ passenger, isSimple, title }: { passenger: User, isSimple: boolean, title: string }) => {

    return (
        <View className="flex gap-2">
            <Text className="font-semibold text-xl text-foreground">{title}</Text>
            <Card>
                <CardHeader>
                    <View className="flex flex-row justify-between items-center">
                        <View> 
                            <AvatarImage 
                                source={require('../../assets/images/userlogoblack.png')} 
                                />
                        </View>
                        <View className="flex flex-row items-center">
                            <CardTitle>{passenger.first_name} {passenger.last_name}</CardTitle>
                        </View>
                        {(!isSimple) && (
                            <View>
                                <Button className="bg-background border border-secondary" labelClasses="text-foreground" label="ACEPTAR" onPress={handleAccept} />
                                <Button className="bg-background border border-secondary" labelClasses="text-foreground" label="RECHAZAR" onPress={handleReject}/>
                            </View> 
                        )}   
                    </View>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-row justify-between items-center flex-wrap">
                    <Button className="bg-background border border-secondary" labelClasses="text-foreground" label="Ver perfil" />
                </CardFooter>
            </Card>
        </View>
    )
}