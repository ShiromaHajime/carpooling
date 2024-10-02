import { Trips } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trips>([]);  // Se cambió "trip" por "trips" para claridad
  const [loading, setLoading] = useState(true);

  // Petición para obtener los viajes
  useEffect(() => {
    fetch('http://192.168.0.225:5000/trip')  // Asegúrate de que esta URL esté correcta
      .then(response => response.json())
      .then(data => {
          setTrips(data);
          console.log(data);  // Verifica aquí la estructura que te devuelve el backend
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
        data={trips}  // Asegúrate de que "trips" es un array de objetos con id, salida, llegada, y hora
        keyExtractor={(item) => item.id.toString()}  // Usa el campo id de cada objeto
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-4 w-full rounded-lg shadow-lg">
            <Text className="text-gray-800 text-lg font-bold">
              De:  {item.deaparture_address.city.province.name} - {item.deaparture_address.city.name} - {item.deaparture_address.street} {item.deaparture_address.number}
            </Text>
            <Text className="text-gray-800 text-lg font-bold">
              A: {item.arrival_address.city.province.name} - {item.arrival_address.city.name} - {item.arrival_address.street} {item.arrival_address.number}
            </Text>
            <Text className="text-gray-600 text-sm">
              Hora de salida: {item.departure_time}
            </Text><Text className="text-gray-600 text-sm">
              Conductor : {item.vehicle_driver.driver.user.first_name} {item.vehicle_driver.driver.user.last_name}
            </Text>
          </View>
        )}
      />
    </View>
  );
  
  
}