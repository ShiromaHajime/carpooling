import { Trip, Trips } from "@/types/input";
import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trips>([]);  // Se cambió "trip" por "trips" para claridad
  const [loading, setLoading] = useState(true);

  // Petición para obtener los viajes
  useEffect(() => {
    fetch('http://10.0.2.2:5000/trip')  // Asegúrate de que esta URL esté correcta
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
              De: {item.departure_date}
            </Text>
            <Text className="text-gray-800 text-lg font-bold">
              A: {item.creation_timestamp}
            </Text>
            <Text className="text-gray-600 text-sm">
              Hora de salida: {item.departure_time}
            </Text>
          </View>
        )}
      />
    </View>
  );
  
  
}