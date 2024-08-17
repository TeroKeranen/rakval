import { useFocusEffect } from "@react-navigation/native";
import React from "react";
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