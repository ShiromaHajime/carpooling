import { useContext, useEffect, useState } from "react";
import { TripContext } from "../TripProvider";
import { modeMap } from "@/types/types";
import { AlertSelecting } from "@/components/alerts/AlertSelecting";
import { View } from "react-native";

export const SectionAlertSelecting = () => {
    const context = useContext(TripContext);
    const [mode, setMode] = useState<modeMap>();

    useEffect(() => {
        if (context.selectingMode) setMode(context.selectingMode)
    }, [context.selectingMode])

    if (mode == 'selectingOrigin') return (
        <View className="pt-6 bg-background">
            <AlertSelecting title='Marcando punto de origen' description='Para marcar un punto puedes tocar el mapa' />
        </View>
    )
    if (mode == 'selectingDestination') return (
        <View className="pt-6 bg-background">
            <AlertSelecting title='Marcando punto de destino' description='Para marcar un punto puedes tocar el mapa' />
        </View>
    )
}