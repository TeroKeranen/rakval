import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Alert } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";


export const getCurrentSubscription = async () => {

    try {
        const customerInfo = await Purchases.getCustomerInfo();
        // access latest customerInfo
          // Etsi aktiivinen tilaus käyttäjän entitlementsista
        const activeSubscription = Object.keys(customerInfo.entitlements.active).map(key => {
            return customerInfo.entitlements.active[key];
        })[0]; // Oletetaan että käyttäjällä on vain yksi aktiivinen tilaus

        if (activeSubscription) {
            return {
              productIdentifier: activeSubscription.productIdentifier,
              purchaseDate: activeSubscription.latestPurchaseDate,
              expirationDate: activeSubscription.expirationDate
            };
          } else {
            return null; // Ei aktiivista tilausta
          }
      } catch (e) {
       // Error fetching customer info
       console.error("Virhe tarkistettaessa aktiivista tilausta:", error);
       return null;
      
    }
}

// katsotaan nykyinen tilaus ja asetetaan määrä montako työmaata käyttäjä voi lisätä
// export const fetchSubscription = async (currentWorksitesCount, setMaxWorksites, setCurrentWorksites) => {
//   try {
//     const activeSubscription = await getCurrentSubscription();

//     if (activeSubscription) {
//       switch (activeSubscription.productIdentifier) {
//         case 'b4sic':
//           setMaxWorksites(3);
//           break;
//         case 'exted3d':
//           setMaxWorksites(5);
//           break;
//         case 'prof3ss10':
//           setMaxWorksites(10);
//           break;
//         case 'unl1m1t3d':
//           setMaxWorksites(Infinity); // Ei rajoitusta
//           break;
//         default:
//           setMaxWorksites(0);
//           break;
//       }
//     } else {
//       Alert.alert("Virhe", "Aktiivista tilausta ei löytynyt.");
//       setMaxWorksites(1);
//     }

//     setCurrentWorksites(currentWorksitesCount);
//   } catch (error) {
//     Alert.alert("Virhe", "Tilauksen tarkistuksessa tapahtui virhe.");
//     setMaxWorksites(0);
//   }
// };

export const fetchSubscription = async (setMaxItems, setCurrentItems, currentItemsCount) => {
  try {
    const activeSubscription = await getCurrentSubscription();

    if (activeSubscription) {
      let maxItems;
      switch (activeSubscription.productIdentifier) {
        case 'b4sic':
          maxItems = 3;
          break;
        case 'exted3d':
          maxItems = 5;
          break;
        case 'prof3ss10':
          maxItems = 10;
          break;
        case 'unl1m1t3d':
          maxItems = Infinity; // Ei rajoitusta
          break;
        default:
          maxItems = 0;
          break;
      }
      setMaxItems(maxItems);
    } else {
      Alert.alert("Virhe", "Aktiivista tilausta ei löytynyt.");
      setMaxItems(1);
    }

    setCurrentItems(currentItemsCount);
  } catch (error) {
    Alert.alert("Virhe", "Tilauksen tarkistuksessa tapahtui virhe.");
    setMaxItems(0);
  }
};

