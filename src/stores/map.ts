import { defineStore } from "pinia";
import { ref } from "vue";
import StorageUtil from "@/utils/storageUtil";

export const useMap = defineStore("Map",()=> {

  const mapStyles = [
    {
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffcb3d"
        },
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#f2bd2c"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "stylers": [
        {
          "color": "#e4f22c"
        },
        {
          "visibility": "on"
        },
        {
          "weight": 1.5
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#e4f22c"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "color": "#f2bd2c"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#85b52c"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#f2bd2c"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "color": "#f2bd2c"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.icon",
      "stylers": [
        {
          "color": "#f2bd2c"
        },
        {
          "visibility": "on"
        },
        {
          "weight": 1.5
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f2bd2c"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f2bd2c"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "transit.station.airport",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "transit.station.rail",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    }
  ]
  const mapStyleValue = ref(StorageUtil.Get<any[]>("MapStyles", mapStyles))

  const mapCenterValue = ref(StorageUtil.Get<any>("MapCenter", { lat: -33.865143, lng: 151.209900 }))

  return { mapStyleValue,mapCenterValue };

});
