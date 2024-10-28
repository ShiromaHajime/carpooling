import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "@/components/buttons/Button";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/utils/Provider";


export default function HomeScreen() {
    const context = useContext(GlobalContext);
    const contextRole = context?.role
    const user = context?.user
    console.log('renderHome');

    useEffect(() => {
        // get RequestPassengers
        // get activeTrips
    }, [])

    const handleButtonTrip = () => {
        if (contextRole == 'Driver') {
            router.replace({ pathname: "/(home)/trips/createTrip" })
            return
        }
        if (contextRole == 'Passenger') {
            // router.replace({pathname: "/(home)/trips/createTrip"}) //ir a buscar viaje
            return
        }

    }
    const RequestPassengers = () => {

        return (
            <View>

            </View>
        )
    }

    const ActiveTrips = () => {
        return (
            <View>
                <Text>Viajes activos</Text>
            </View>
        )
    }

    return (
        <View className="bg-background flex items-center justify-center h-full pl-5 pr-5">
            {(contextRole == 'Driver') && (<RequestPassengers />)}
            <Button label={`${contextRole == 'Driver' ? 'Crear nuevo viaje' : 'Buscar nuevo viaje'}`} onPress={handleButtonTrip} className="px-28 py-2" />
            <ActiveTrips />
        </View>
    );
}