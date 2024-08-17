import React, { useContext, useEffect, useState } from "react"
import { Context as Autcontext} from '../context/AuthContext'
import { Alert, FlatList, Platform, StyleSheet, Text, View,Button } from "react-native"
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { useFocusEffect } from "@react-navigation/native";

const APIkeys = {
    apple:"appl_wHjihsMCXNIMqxwrRuAHWKfeAFz"
}

const Subscription = () => {
    const { state, fetchUser,updateSubscription,subscriptionDatabaseUpdate } = useContext(Autcontext); 
    const [products, setProducts] = useState([]);
    const [activeProductIdentifier, setActiveProductIdentifier] = useState(null); //tila aktiiviselle tilaukselle

    

    console.log("userState", state);
    useFocusEffect(
        React.useCallback(() => {
            const setup = async () => {
                if (Platform.OS === "android") {
                    console.log("Ei androidille ole tuotteita");
                    return;
                } else {
                    await Purchases.configure({ apiKey: APIkeys.apple });
                }

                Purchases.setLogLevel(LOG_LEVEL.DEBUG);

                // Kuuntelija päivittää käyttäjän tilaustiedot AuthContextiin
                Purchases.addCustomerInfoUpdateListener((customerInfo) => {
                    // console.log("customerInfo", customerInfo);
                    
                    const activeSubscription = Object.keys(customerInfo.entitlements.active).map(key => {
                        return customerInfo.entitlements.active[key];
                    })[0]; // Oletetaan että käyttäjällä on vain yksi aktiivinen tilaus

                    

                    if (activeSubscription) {

                        setActiveProductIdentifier(activeSubscription.productIdentifier); // Aseta aktiivinen tilaustunnus
                        const subscription = {
                            productIdentifier: activeSubscription.productIdentifier,
                            purchaseDate: activeSubscription.latestPurchaseDate,
                        };
                        updateSubscription(subscription);
                    }
                });

                await loadOfferings();
            };

            setup();
        }, []) // Tämä tyhjä taulukko tarkoittaa, että koukku aktivoituu vain, kun sivu tulee näkyville
    );

    const loadOfferings = async () => {
        try {
            const offerings = await Purchases.getOfferings();
            

            const currentOffering = offerings.current;
            if (currentOffering && currentOffering.availablePackages.length > 0) {
                
                setProducts(currentOffering.availablePackages);
            } else {
                console.log("Ei saatavilla olevia paketteja");
            }
        } catch (error) {
            console.error("Error loading offerings", error);
        }
    };

    const purchasePackage = async (purchasePackage) => {
        try {
            const purchaseInfo = await Purchases.purchasePackage(purchasePackage);

            // console.log("Käyttäjä on ostamassa pakettia:", {
            //     packageIdentifier: purchasePackage.identifier,
            //     productIdentifier: purchasePackage.product.identifier,
            //     productTitle: purchasePackage.product.title,
            //     productDescription: purchasePackage.product.description,
            //     productPrice: purchasePackage.product.price,
            //     productPriceString: purchasePackage.product.priceString,
            // });

            if (purchaseInfo?.customerInfo?.entitlements.active) {

                

                const subscription = {
                    packageIdentifier: purchasePackage.identifier,
                    productIdentifier: purchasePackage.product.identifier,
                    purchaseDate: purchaseInfo.customerInfo.entitlements.active[purchasePackage.identifier]?.latestPurchaseDate,
                };
                
                
                updateSubscription(subscription);
                Alert.alert("Osto onnistui", "Tilaus on aktivoitu!");
                subscriptionDatabaseUpdate(purchasePackage.identifier, 1);
            }
        } catch (error) {
            if (!error.userCancelled) {
                console.error("Osto epäonnistui", error);
                Alert.alert("Osto epäonnistui", error.message);
            } else {
                console.log("Käyttäjä peruutti oston.");
            }
        }
    };

    const renderProduct = ({item}) => {
        const isActiveSubscription = item.product.identifier === activeProductIdentifier;
        console.log("ksksksk", activeProductIdentifier)

        return (

            <View style={[styles.productContainer, isActiveSubscription && styles.activeProduct]}>
            <Text style={styles.title}>{item.product.title}</Text>
            <Text>{item.product.description}</Text>
            <Text>{item.product.price_string}</Text>
            <Button title={isActiveSubscription ? "Tilaus on aktiivinen": "Osta"} onPress={() => purchasePackage(item)} disabled={isActiveSubscription}/>
        </View>
        )
}

    return (
        <View style={styles.container}>
            <Text>Moooo</Text>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.identifier}
            />
        </View>
    )

}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      productContainer: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '100%',
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      activeProduct: {
        backgroundColor: '#d4edda', // Vihreä tausta aktiiviselle tilaukselle
        borderColor: '#28a745',
    },

})


export default Subscription;