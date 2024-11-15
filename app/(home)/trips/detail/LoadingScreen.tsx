import { Skeleton } from "@/components/Skeleton"
import { Text, View } from "react-native"

export const LoadingScreen = () => {
    return (
        <View className="self-center w-full h-full">

            <Skeleton className="w-full h-[230]" />
            <View className="bg-gray-200 dark:bg-gray-900 flex items-start justify-start h-full pl-8 pr-8">

                <View className="mt-7 " >
                    <Text className="font-semibold dark:color-slate-200 ">Lugar de inicio de viaje</Text>
                    <Skeleton className="w-fit h-4" />
                </View>

                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Lugar de finalizacion del viaje</Text>
                    <Skeleton className="w-fit h-4" />
                </View>

                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Fecha y hora de salida</Text>
                    <Skeleton className="w-fit h-4" />

                </View>

                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Asientos disponibles</Text>
                    <Skeleton className="w-fit h-4" />

                </View>

                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Precio por asiento</Text>
                    <Skeleton className="w-fit h-4" />

                </View>

            </View>

            <Skeleton className="w-fit h-4" />
        </View>
    )
}