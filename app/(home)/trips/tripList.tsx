import { Trips } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Importa el hook router para navegación
import { API_URL } from "@/constants/const";

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trips>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  // Inicializa el router

  useEffect(() => {
    fetch(API_URL + '/trip')
      .then(response => response.json())
      .then(data => {
          setTrips(data);
          console.log(data); 
          setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-5">
        <Text className="text-gray-200">Cargando viajes...</Text>
      </View>
    );
  }

  return (
    <View className="bg-slate-400 flex items-center justify-center h-screen p-5">
      <Text className="text-gray-200 text-2xl mb-4">Lista de viajes</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/trips/detail/${item.id}`)}>
            <View className="bg-white p-4 mb-4 w-full rounded-lg shadow-lg">
              <Text className="text-gray-800 text-lg font-bold">
                De:  {item.deaparture_address.city.province.name} - {item.deaparture_address.city.name} - {item.deaparture_address.street} {item.deaparture_address.number}
              </Text>
              <Text className="text-gray-800 text-lg font-bold">
                A: {item.arrival_address.city.province.name} - {item.arrival_address.city.name} - {item.arrival_address.street} {item.arrival_address.number}
              </Text>
              <Text className="text-gray-600 text-sm">
                Hora de salida: {item.departure_time}
              </Text>
              <Text className="text-gray-600 text-sm">
                Conductor : {item.vehicle_driver.driver.user.first_name} {item.vehicle_driver.driver.user.last_name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}