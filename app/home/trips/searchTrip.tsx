import { Trips } from "@/types/types";
import React, { useEffect, useState, useContext } from "react";
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router"; // Importa el hook router para navegación
import { getAllTrips } from "@/services/trip";
import { GlobalContext } from "@/utils/Provider";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function SearchTripScreen() {
  const context = useContext(GlobalContext);
  const [trips, setTrips] = useState<Trips>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trips>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  // Inicializa el router

  if (context.role != 'Passenger') {
    router.replace({ pathname: "/home" })
    return
  }

  useEffect(() => {
    const getTrips = async () => {
      const trips = await getAllTrips();
      const filtredTrips = trips ? trips.filter(trip => trip.available_seats > 0 && trip.status === 'active') : []
      setFilteredTrips(filtredTrips)
      setLoading(false)
      if (trips) setTrips(trips)
    }
    setLoading(true)
    getTrips()
  }, []);


  const InitialRegion = {
    latitude: -34.95541540632269,
    longitude: -57.95246359267004,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }


  if (loading) {
    return (
      <View className="bg-background flex items-center justify-center h-full pl-5 pr-5">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="relative flex h-full">

      <View className="flex-1">

        <MapView
          style={{ flex: 1, width: '100%' }}
          className='flex-1 w-auto h-screen bg-background'
          initialRegion={InitialRegion}
          provider={PROVIDER_GOOGLE}
        >
          {filteredTrips.map((trip) => (
            <Marker
              key={trip.id}
              coordinate={{
                latitude: trip.departure_address.latitude,
                longitude: trip.departure_address.longitude
              }}
              title={`Desde: ${trip.departure_address.locality.name}`}
              description={`Hasta: ${trip.arrival_address.locality.name}`}
              onCalloutPress={() => router.push(`/home/trips/detail/${trip.id}`)}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
}