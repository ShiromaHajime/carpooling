import { getPassengers } from "@/services/trip";
import { GlobalContext } from "@/utils/Provider";
import { User } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { FlatList, Text, View, } from "react-native";
import { Rating } from '@kolking/react-native-rating';
import { useLocalSearchParams } from "expo-router";
import { parseUrlParams } from "@/utils/utils";

export default function DetailTripScreen() {
    const context = useContext(GlobalContext);
    const [passengers, setpassengers] = useState<User[]>()
    const [rating, setRating] = useState(0);
    const { idTrip } = useLocalSearchParams();
    const id_trip = parseUrlParams(idTrip);
    
    useEffect(() => {
        const fetchPassengers = async () => {
            let passengers = await getPassengers(idTrip as string);
            if (!passengers) return;
            console.log(passengers);
            passengers = passengers.filter((passenger) => passenger === 'accepted');
            setpassengers(passengers);
            //filter passenger by only accepted
        };
        fetchPassengers();
    }, []);


    const handleChange = useCallback(
        (value: number) => setRating(Math.round((rating + value) * 5) / 10),
        [rating],
    );

    return ( 
        <View>

            <View>
            <Text className="font-semibold dark:color-slate-200">Califica a los pasajeros:</Text>
            </View>

            <FlatList data={passengers}
                renderItem={({ item }) => <Text>{item}</Text>}
                keyExtractor={(item, index) => index.toString()}
            />
            const handleChange = useCallback(
            (value: number) => setRating(Math.round((rating + value) * 5) / 10),
            [rating],
            );
            <Rating size={40} rating={rating} onChange={handleChange} />
        </View>
    )

}