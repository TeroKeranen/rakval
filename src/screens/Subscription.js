// import React, { useContext, useEffect, useState } from "react"
// import { Context as Autcontext} from '../context/AuthContext'
// import { Alert, FlatList, Platform, StyleSheet, Text, View,Button, ImageBackground, Dimensions, SafeAreaView, TouchableOpacity } from "react-native"
// import Purchases, { LOG_LEVEL } from "react-native-purchases";
// import { useFocusEffect } from "@react-navigation/native";



// const APIkeys = {
//     apple:"appl_wHjihsMCXNIMqxwrRuAHWKfeAFz"
// }

// const { width, height } = Dimensions.get('window'); // Saadaan näytön leveys

// const Subscription = () => {
//     const { state, fetchUser,updateSubscription,subscriptionDatabaseUpdate } = useContext(Autcontext); 
//     const [products, setProducts] = useState([]);
//     const [activeProductIdentifier, setActiveProductIdentifier] = useState(null); //tila aktiiviselle tilaukselle
//     const [currentIndex, setCurrentIndex] = useState(0); // Nykyinen näkyvillä oleva sivu
    

    

//     console.log("userState", state);
//     useFocusEffect(
//         React.useCallback(() => {
//             const setup = async () => {
//                 if (Platform.OS === "android") {
//                     console.log("Ei androidille ole tuotteita");
//                     return;
//                 } else {
//                     await Purchases.configure({ apiKey: APIkeys.apple });
//                 }

//                 Purchases.setLogLevel(LOG_LEVEL.DEBUG);

//                 // Kuuntelija päivittää käyttäjän tilaustiedot AuthContextiin
//                 Purchases.addCustomerInfoUpdateListener((customerInfo) => {
//                     // console.log("customerInfo", customerInfo);
                    
//                     const activeSubscription = Object.keys(customerInfo.entitlements.active).map(key => {
//                         return customerInfo.entitlements.active[key];
//                     })[0]; // Oletetaan että käyttäjällä on vain yksi aktiivinen tilaus

                    

//                     if (activeSubscription) {

//                         setActiveProductIdentifier(activeSubscription.productIdentifier); // Aseta aktiivinen tilaustunnus
//                         const subscription = {
//                             productIdentifier: activeSubscription.productIdentifier,
//                             purchaseDate: activeSubscription.latestPurchaseDate,
//                         };
//                         updateSubscription(subscription);
//                     }
//                 });

//                 await loadOfferings();
//             };

//             setup();
//         }, []) // Tämä tyhjä taulukko tarkoittaa, että koukku aktivoituu vain, kun sivu tulee näkyville
//     );

//     const loadOfferings = async () => {
//         try {
//             const offerings = await Purchases.getOfferings();
            

//             const currentOffering = offerings.current;
//             if (currentOffering && currentOffering.availablePackages.length > 0) {
                
//                 setProducts(currentOffering.availablePackages);
//             } else {
//                 console.log("Ei saatavilla olevia paketteja");
//             }
//         } catch (error) {
//             console.error("Error loading offerings", error);
//         }
//     };

//     const purchasePackage = async (purchasePackage) => {
//         try {
//             const purchaseInfo = await Purchases.purchasePackage(purchasePackage);

//             // console.log("Käyttäjä on ostamassa pakettia:", {
//             //     packageIdentifier: purchasePackage.identifier,
//             //     productIdentifier: purchasePackage.product.identifier,
//             //     productTitle: purchasePackage.product.title,
//             //     productDescription: purchasePackage.product.description,
//             //     productPrice: purchasePackage.product.price,
//             //     productPriceString: purchasePackage.product.priceString,
//             // });

//             if (purchaseInfo?.customerInfo?.entitlements.active) {

                

//                 const subscription = {
//                     packageIdentifier: purchasePackage.identifier,
//                     productIdentifier: purchasePackage.product.identifier,
//                     purchaseDate: purchaseInfo.customerInfo.entitlements.active[purchasePackage.identifier]?.latestPurchaseDate,
//                 };
                
                
//                 updateSubscription(subscription);
//                 Alert.alert("Osto onnistui", "Tilaus on aktivoitu!");
//                 subscriptionDatabaseUpdate(purchasePackage.identifier, 1);
//             }
//         } catch (error) {
//             if (!error.userCancelled) {
//                 console.error("Osto epäonnistui", error);
//                 Alert.alert("Osto epäonnistui", error.message);
//             } else {
//                 console.log("Käyttäjä peruutti oston.");
//             }
//         }
//     };

//     const renderProduct = ({item}) => {
//         const isActiveSubscription = item.product.identifier === activeProductIdentifier;

        

//         return (
            
//             <View style={[styles.productContainer, isActiveSubscription && styles.activeProduct]}>
//             <Text style={styles.title}>{item.product.title}</Text>
//             <Text>{item.product.description}</Text>
//             <Text style={styles.price}>{item.product.price}€</Text>
//             {isActiveSubscription ? (
//                 <Text style={styles.activeText}>Tilaus on aktiivinen</Text>
//             ) : (
//                 <TouchableOpacity onPress={() => purchasePackage(item)} style={styles.button}>
//                     <Text >Osta</Text>
//                 </TouchableOpacity>
//             )}
            
//             {/* <Button title={isActiveSubscription ? "Tilaus on aktiivinen": "Osta"} onPress={() => purchasePackage(item)} disabled={isActiveSubscription}/> */}
//         </View>
//         )
//     }

//     const handleScroll = (event) => {
//         const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
//         setCurrentIndex(newIndex);
//     };

//     return (
//         <SafeAreaView style={{flex:1}}>



//                 <View style={styles.container}>
                    
//                     <FlatList
//                         data={products}
//                         renderItem={renderProduct}
//                         keyExtractor={(item) => item.identifier}
//                         horizontal={true} 
//                         pagingEnabled={true}
//                         showsHorizontalScrollIndicator={false} // Piilottaa vaakasuoran vierityspalkin
//                         onScroll={handleScroll} // Kutsutaan, kun käyttäjä selaa
//                         scrollEventThrottle={16} // Suorituskykyyn liittyvä asetus
//                         />

//                     <View style={styles.pagination}>
//                         {products.map((_, index) => (
//                             <View
//                                 key={index}
//                                 style={[
//                                     styles.dot,
//                                     index === currentIndex ? styles.activeDot : styles.inactiveDot,
//                                 ]}
//                                 />
//                             ))}
//                     </View>
//                 </View>
            
//         </SafeAreaView>
//     )

// }



// const styles = StyleSheet.create({
//     background: {
//         flex: 1, // Varmista, että ImageBackground täyttää koko näytön
//         width: '100%',
//         height: '100%',
//     },
//     container: {
//         flex: 1,
//         backgroundColor:'white',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     productContainer: {
//         width: width, // Asetetaan tuotteen leveys näytön leveydeksi
//         height: height,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 1,
//         backgroundColor: "#dad0d0", 
//         borderColor: '#ccc',
//         borderRadius: 5,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     price: {
//         marginVertical: 6,
//         fontSize: 20,
//         fontWeight: '700'
//     },
//     activeProduct: {
//         backgroundColor: '#d4edda', // Vihreä tausta aktiiviselle tilaukselle
//         borderColor: '#28a745',
//     },
//     button: {
//         backgroundColor: "#507ab8",
//         padding: 10,
//         borderRadius: 5,
//         marginVertical: 10,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     activeText: {
//         color: '#28a745',
//         fontWeight: 'bold',
//         marginTop: 10,
//     },
//     pagination: {
//         position: 'absolute',
//         bottom: height * 0.15, // Nostaa pisteet ylemmäs
//         flexDirection: 'row',
//     },
//     dot: {
//         height: 10,
//         width: 10,
//         borderRadius: 5,
//         marginHorizontal: 5,
//     },
//     activeDot: {
//         backgroundColor: '#507ab8',
//     },
//     inactiveDot: {
//         backgroundColor: '#ffffff',
//     }

// })


// export default Subscription;