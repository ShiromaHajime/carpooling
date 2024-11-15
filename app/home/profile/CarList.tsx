import { CardDescription } from "@/components/Card";
import { Button } from "@/components/buttons/Button";
import { Vehicle } from "@/types/types";
import { Foundation, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { FlatList, Text, View } from "react-native";

export const CarList = ({ cars }: { cars: Vehicle[] }) => {
    const { colorScheme } = useColorScheme();

    const CardCar = ({ car }: { car: Vehicle }) => {
        const colorIcon = colorScheme === 'dark' ? 'white' : 'black';

        return (
            <View className="bg-card border border-border rounded-lg p-4 shadow-lg">
                <View className="flex flex-row justify-between items-center mb-3">
                    <Text className="font-semibold text-lg text-foreground flex-1">{car.brand} {car.model}</Text>
                    <Button className="bg-secondary border border-secondary px-4 py-2 rounded-md" labelClasses="text-foreground text-sm" label="Ver detalle" />
                </View>
                <CardDescription className="mb-2">Año {car.year}</CardDescription>
                <View className="flex flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Text className="text-foreground mr-2">Matrícula: </Text>
                        <MaterialCommunityIcons name="numeric" size={20} color={colorIcon} />
                        <Text className="text-foreground ml-1">{car.license_plate}</Text>
                    </View>
                    {car.color && (
                        <View className="flex-row items-center">
                            <Foundation name="paint-bucket" size={20} color={colorIcon} />
                            <Text className="text-foreground ml-2">{car.color}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <FlatList
            style={{ flex: 1 }}
            data={cars}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingBottom: 20 }}
            keyExtractor={car => car.license_plate}
            renderItem={({ item }) => <CardCar car={item} />}
        />
    );
};