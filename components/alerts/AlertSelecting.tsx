import { AlertProp } from "@/types/types";
import { useColorScheme } from "nativewind";
import { Alert, AlertDescription, AlertTitle } from "../Alert";
import { Locate } from "lucide-react-native";

export const AlertSelecting = ({ title, description }: AlertProp) => {
    const { colorScheme } = useColorScheme()
    return (
        <Alert iconSize={25} icon={() => (<Locate color={(colorScheme == 'dark') ? '#fff' : '#000'} />)} iconClassName="white" className="max-w-xl">
            <AlertTitle className="ml-2">{title}</AlertTitle>
            <AlertDescription className="ml-2">{description}</AlertDescription>
        </Alert>
    );
};