import { Trips } from "@/types/types";
import React, { useEffect, useState, useContext } from "react";
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router"; // Importa el hook router para navegación
import { getAllTrips } from "@/services/trip";
import { GlobalContext } from "@/utils/Provider";
import MapView, { Marker } from 'react-native-maps';

export default function TripsScreen() {
  const context = useContext(GlobalContext);
  const [trips, setTrips] = useState<Trips>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  // Inicializa el router

  useEffect(() => {
    const getTrips = async () => {
      const trips = await getAllTrips();
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


  if (loading && context.role === 'Passenger') {
    return (
      <View className="bg-background flex items-center justify-center h-full pl-5 pr-5">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (context.role === 'Passenger') {
    let filtredTrips = trips.filter(trip => trip.available_seats > 0 && trip.status === 'active')
    return (
      <MapView
        style={{ flex: 1, width: '100%' }}
        initialRegion={InitialRegion}
      >
        {filtredTrips.map((trip) => (
          <Marker
            key={trip.id}
            coordinate={{
              latitude: trip.departure_address.latitude,
              longitude: trip.departure_address.longitude
            }}
            title={`Desde: ${trip.departure_address.locality.name}`}
            description={`Hasta: ${trip.arrival_address.locality.name}`}
            onCalloutPress={() => router.navigate(`/home/trips/detail/${trip.id}`)}
          />
        ))}
      </MapView>
    );
  }
  if (context.role === 'Driver') {
    const activeTrips = trips.length > 0 ? trips.filter(trip => trip.vehicle_driver.driver_id === context.user.id && trip.status === 'active') : []
    return (
      <View className="bg-background flex items-center justify-center h-full p-5">
        <Text className="text-foreground font-semibold text-2xl mb-4">Lista de mis viajes</Text>
        <FlatList
          className="w-full"
          data={activeTrips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.navigate(`/home/trips/detail/${item.id}`)} className="p-4 bg-card mb-6 w-full rounded-lg shadow-lg">
              <Text className="text-foreground text-lg font-bold">
                Desde: {item.departure_address.locality.principal_subdivision.name} - {item.departure_address.locality.name} - {item.departure_address.street} {item.departure_address.number}
              </Text>
              <Text className="text-foreground text-lg font-bold">
                Hasta: {item.arrival_address.locality.principal_subdivision.name} - {item.arrival_address.locality.name} - {item.arrival_address.street} {item.arrival_address.number}
              </Text>
              <Text className="text-foreground text-sm">
                Fecha y Hora de salida: <Text className="text-foreground text-sm italic">{item.departure_date} {item.departure_time}</Text>
              </Text>
              <Text className="text-foreground text-sm">
                {/* da error pero funciona, hay que arreglar los tipos una vez que este definido vehicle_driver */}
                Conductor : {item.vehicle_driver.driver.user.first_name} {item.vehicle_driver.driver.user.last_name}
              </Text>
            </TouchableOpacity>
          )}
        />
        {(loading) &&
          (
            <View className="bg-background flex items-center justify-center h-full pl-5 pr-5">
              <ActivityIndicator size="large" />
            </View>
          )
        }
      </View>
    );
  }
}