import { Text, View } from "react-native"
import MapView from "react-native-maps"
// import MapView from 'react-native-maps';

export default function TestScreen() {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <MapView style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: -34.95541540632269,
                    longitude: -57.95246359267004,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04
                }}
            />
        </View>
    )
}