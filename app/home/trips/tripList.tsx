import { useContext } from "react";
import { GlobalContext } from "@/utils/Provider";
import SearchTripScreen from "./searchTrip";
import DriverTripListScreen from "./driverTripList";

export default function TripsScreen() {
  const context = useContext(GlobalContext);

  if (context.role === 'Passenger') return <SearchTripScreen />
  if (context.role === 'Driver') return <DriverTripListScreen />
}