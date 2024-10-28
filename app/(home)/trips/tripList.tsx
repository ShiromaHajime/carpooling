import { Trips } from "@/types/types";
import React, { useEffect, useState, useContext } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Importa el hook router para navegación
import { API_URL } from "@/constants/const";
import { getAllTrips } from "@/services/trip";
import { GlobalContext } from "@/utils/Provider";
import { Button } from "@/components/buttons/Button";
import * as Location from 'expo-location';
import { useLocalPosition } from "@/hooks/useLocalPosition";
import { haversineDistance } from "@/utils/utils";

export default function TripsScreen() {
  const context = useContext(GlobalContext);
  const [trips, setTrips] = useState<Trips>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  // Inicializa el router
  const [errorMsg, setErrorMsg] = useState('');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | undefined>();

  useEffect(() => {
    const getUserLocation = async () => {
        const { error, userLocation } = await useLocalPosition()
        setErrorMsg(error)
        setUserLocation(userLocation)
    }
    getUserLocation()
  }, []);

  const OrdenarViajes = async () => {
    if (userLocation) {
      const trips = await getAllTrips();
      if (trips) {
        const sortedTrips = trips.sort((a, b) => {
          const distanceA = haversineDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            a.departure_address.coords.latitude,
            a.departure_address.coords.longitude
          );
          const distanceB = haversineDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            b.departure_address.coords.latitude,
            b.departure_address.coords.longitude
          );
          return distanceA - distanceB;
        });
        setTrips(sortedTrips);
      }
    }
  };

  if (loading) {
    return (
      <View className="bg-slate-400 flex items-center justify-center h-full pl-5 pr-5">
        <Text className="text-gray-200">Cargando viajes...</Text>
      </View>
    );
  }

  return (
    <View className="bg-slate-400 flex items-center justify-center h-full p-5">
      <Text className="text-gray-200 text-2xl mb-4">Lista de viajes</Text>
      <FlatList
        className="w-full"
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/trips/detail/${item.id}`)}>
            <View className="bg-white p-4 mb-4 w-full rounded-lg shadow-lg">
              <Text className="text-gray-800 text-lg font-bold">
                De:  {item.departure_address.city.province.name} - {item.departure_address.city.name} - {item.departure_address.street} {item.departure_address.number}
              </Text>
              <Text className="text-gray-800 text-lg font-bold">
                A: {item.arrival_address.city.province.name} - {item.arrival_address.city.name} - {item.arrival_address.street} {item.arrival_address.number}
              </Text>
              <Text className="text-gray-600 text-sm">
                Hora de salida: {item.departure_time}
              </Text>
              <Text className="text-gray-600 text-sm">
                {/* da error pero funciona, hay que arreglar los tipos una vez que este definido vehicle_driver */}
                Conductor : {item.vehicle_driver.driver.user.first_name} {item.vehicle_driver.driver.user.last_name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {context?.role === 'Driver' && (
        <Button className="w-52 bg-[#104736] text-stone-50" label="Crear viaje" onPress={() => router.push('/trips/createTrip')}  />
      )}
    </View>
  );
}