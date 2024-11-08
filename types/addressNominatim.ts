export type GeocodingProperties = {
    place_id: number;
    osm_type: string;
    osm_id: number;
    osm_key: string;
    osm_value: string;
    type: string;
    accuracy: number;
    label: string;
    housenumber: string;
    postcode: string;
    street: string;
    locality: string;
    district: string;
    city: string;
    county: string;
    country: string;
    country_code: string;
    admin: {
        level7: string;
        level4: string;
    };
};

export type Geometry = {
    type: "Point";
    coordinates: [number, number];
};

export type Feature = {
    type: "Feature";
    properties: {
        geocoding: GeocodingProperties;
    };
    geometry: Geometry;
};

export type Geocoding = {
    version: string;
    attribution: string;
    licence: string;
    query: string;
};

export interface Address {
    house_number: string;
    road: string;
    neighbourhood: string;
    town: string;
    state_district: string;
    state: string;
    ISO3166_2_lvl4: string;
    postcode: string;
    country: string;
    country_code: string;
}

export interface Location {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    category: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: Address;
    boundingbox: [string, string, string, string]; // Tuple with 4 strings for lat/lon bounding box
}


export interface PlaceJsonv2 {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    category: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: Address;
}