import Geocoder from "react-native-geocoder";

export async function getAddress(location) {
    return Geocoder.geocodePosition(location)
}

export async function getDistance(lat1, long1, lat2, long2) {
    const response =  await fetch('http://localhost:3000/api/distance?lat1='+lat1+'&long1='+long1 +'&lat2='+lat2+'&long2='+long2)
    return response.json()
}