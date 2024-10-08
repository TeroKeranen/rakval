import React, { useContext, useEffect, useState } from "react"
import { Context as Autcontext} from '../context/AuthContext'
import { Alert, FlatList, Platform, StyleSheet, Text, View,Button, ImageBackground, Dimensions, SafeAreaView, TouchableOpacity, Linking } from "react-native"
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { useFocusEffect } from "@react-navigation/native";
import DownloadScreen from "../components/DownloadScreen";
import { useTranslation } from "react-i18next";
import RestorePurchasesButton from "../components/RestorePurchasesButton";
import Checkbox from 'expo-checkbox';





const APIkeys = {
    apple: process.env.apikey
}

const { width, height } = Dimensions.get('window'); // Saadaan näytön leveys

const Subscription = () => {
    const {t} = useTranslation();
    const { state, fetchUser,updateSubscription,subscriptionDatabaseUpdate } = useContext(Autcontext); 
    const [products, setProducts] = useState([]);
    const [activeProductIdentifier, setActiveProductIdentifier] = useState(null); //tila aktiiviselle tilaukselle
    const [currentIndex, setCurrentIndex] = useState(0); // Nykyinen näkyvillä oleva sivu
    const [isChecked, setIsChecked] = useState(false); // Valintaruutu
    const [isLoading, setIsLoading] = useState(false);
    



    useFocusEffect(
        React.useCallback(() => {
            const setup = async () => {
                try {
                    setIsLoading(true);
                    setCurrentIndex(0);
                    if (Platform.OS === "android") {
                        console.log("Ei androidille ole tuotteita");
                        return;
                    } else {
                        await Purchases.configure({ apiKey: APIkeys.apple });
                    }
                    
                    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
                    
                    const customerInfo = await Purchases.getCustomerInfo();
                    
                    const activeSubscription = Object.keys(customerInfo.entitlements.active).map(key => {
                    return customerInfo.entitlements.active[key];
                })[0];
   
                if (activeSubscription) {
                    setActiveProductIdentifier(activeSubscription.productIdentifier);
                    await updateSubscription({
                        productIdentifier: activeSubscription.productIdentifier,
                        purchaseDate: activeSubscription.latestPurchaseDate,
                    });
                }
                
                await loadOfferings();
            } catch (error) {
                console.error("Error during setup", error);
            } finally {
                setIsLoading(false)
            }
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

        if (!isChecked) {
            Alert.alert(t('subscription-screen-errorTitle'), t('subscription-screen-acceptTermsError'));
            return;
        }
        try {
            setIsLoading(true);
            const purchaseInfo = await Purchases.purchasePackage(purchasePackage);
   
            if (purchaseInfo?.customerInfo?.entitlements.active) {
                const activeSubscription = Object.keys(purchaseInfo.customerInfo.entitlements.active).map(key => {
                    return purchaseInfo.customerInfo.entitlements.active[key];
                })[0];
   
                if (activeSubscription) {
                    const subscription = {
                        productIdentifier: activeSubscription.productIdentifier,
                        purchaseDate: activeSubscription.latestPurchaseDate,
                    };
   
                    // Päivitä tilaustiedot välittömästi
                    setActiveProductIdentifier(activeSubscription.productIdentifier);
                    await updateSubscription(subscription);
   
                    Alert.alert(t('subscription-screen-orderSuccessTitle'), "Tilaus on aktivoitu!");
                    await subscriptionDatabaseUpdate(purchasePackage.identifier, 1);
   
                    // Päivitä tuotelista
                    await loadOfferings();
                }
            }
        } catch (error) {
            if (!error.userCancelled) {
                console.error("Osto epäonnistui", error);
                Alert.alert(t('subscription-screen-orderErrorTitle'), t('subscription-screen-orderErrorText'));
                setIsLoading(false);
            } else {
                console.log("Käyttäjä peruutti oston.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderProduct = ({item}) => {
        const isActiveSubscription = item.product.identifier === activeProductIdentifier;
        
            // Määritellään tuotteen tunnisteiden perusteella käännökset 
        let productTitleKey;
        let productDescriptionKey;
        let productDescriptionKeySecond;

    switch (item.product.identifier) {
        case 'b4sic':
            productTitleKey = 'subscription-product-title1';
            productDescriptionKey = 'subscription-product-description1';
            productDescriptionKeySecond = 'subscription-product-description1-2'
            break;
        case 'exted3d':
            productTitleKey = 'subscription-product-title2';
            productDescriptionKey = 'subscription-product-description2';
            productDescriptionKeySecond = 'subscription-product-description2-2'
            break;
        case 'prof3ss10':
            productTitleKey = 'subscription-product-title3';
            productDescriptionKey = 'subscription-product-description3';
            productDescriptionKeySecond = 'subscription-product-description3-2'
            break;
        case 'unl1m1t3d':
            productTitleKey = 'subscription-product-title4';
            productDescriptionKey = 'subscription-product-description4';
            productDescriptionKeySecond = 'subscription-product-description4-2'
            break;
        default:
            productTitleKey = item.product.title; // Oletusarvoisesti näytetään alkuperäinen englanninkielinen title
            productDescriptionKey = item.product.description; // Oletusarvoisesti näytetään alkuperäinen englanninkielinen kuvaus
            break;
    }

        

        return (
            
            <View style={[styles.productContainer, isActiveSubscription && styles.activeProduct]}>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>{t(productTitleKey)}</Text>
                    <View style={styles.includeText}>

                        <View style={styles.bulletPointContainer}>

                        {/* <View style={styles.bulletPoint} /> */}
                            <Text style={styles.descriptionText}>{t(productDescriptionKey)}</Text>
                        </View>

                        <View style={styles.bulletPointContainer}>

                        {/* <View style={styles.bulletPoint} /> */}
                            <Text style={styles.descriptionText}>{t(productDescriptionKeySecond)}</Text>
                        </View>

                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{item.product.priceString} / {t('month')}</Text>
                    {isActiveSubscription ? (
                        <Text style={styles.activeText}>{t('subscription-screen-active')}</Text>
                    ) : (
                        <TouchableOpacity onPress={() => purchasePackage(item)} style={[styles.button, !isChecked && styles.notActiveBtn]}>
                            <Text style={{color:'white'}}>{t('subscription-screen-btn')}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                {/* <Button title={isActiveSubscription ? "Tilaus on aktiivinen": "Osta"} onPress={() => purchasePackage(item)} disabled={isActiveSubscription}/> */}
        </View>
        )
    }

    const handleScroll = (event) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
    };

    if (isLoading) {
        return <DownloadScreen message={t('loading')} />
      }

    return (
        <SafeAreaView style={{flex:1, backgroundColor: "#404558"}}>
            

                <View style={styles.container}>
                {!activeProductIdentifier && <RestorePurchasesButton setIsLoading={setIsLoading} isLoading={isLoading}/>}
                    
                    <FlatList
                        data={products}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.identifier}
                        horizontal={true}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false} // Piilottaa vaakasuoran vierityspalkin
                        onScroll={handleScroll} // Kutsutaan, kun käyttäjä selaa
                        scrollEventThrottle={16} // Suorituskykyyn liittyvä asetus
                        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        />

                    <View style={styles.pagination}>
                        {products.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentIndex ? styles.activeDot : styles.inactiveDot,
                                ]}
                                />
                            ))}
                    </View>


                    {/* EULA ja Privacy Policy linkit ja checkbox */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <Checkbox
                            value={isChecked}
                            onValueChange={setIsChecked}
                            style={{ marginRight: 10 }}
                        />

                        <View style={{flexDirection: 'row'}}>

                            <Text>{t('subscription-screen-acceptTerms')}</Text>

                            <TouchableOpacity onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
                                <Text style={{ color: 'blue' }}>{t('subscription-screen-eula')}</Text>
                            </TouchableOpacity>
                            <Text> and </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('https://rakival.com/privacypolicy')}>
                                <Text style={{ color: 'blue' }}>{t('subscription-screen-privacyPolicy')}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>
            
        </SafeAreaView>
    )

}



const styles = StyleSheet.create({
    background: {
        flex: 1, // Varmista, että ImageBackground täyttää koko näytön
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productContainer: {
        width: width *0.8, // Asetetaan tuotteen leveys näytön leveydeksi
        height: height * 0.6,
        marginHorizontal: width * 0.1,
        // justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: "#dad0d0", 
        borderColor: '#ccc',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.45,
        shadowRadius: 6,
        elevation: 5,
    },
    textContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    includeText: {
        
    },
    bulletPointContainer: {
        flexDirection: 'row', // Tämä asettaa pallon ja tekstin samalle riville
        alignItems: 'center', // Tämä keskittää tekstin pystysuunnassa suhteessa palloon
        marginBottom: 8, // Etäisyys seuraavaan kohtaan
    },
    bulletPoint: {
        width: 8, // Pallon leveys
        height: 8, // Pallon korkeus
        borderRadius: 4, // Pyöreä pallo (puolet leveydestä/korkeudesta)
        backgroundColor: '#000', // Pallon väri
        marginRight: 8, // Etäisyys pallon ja tekstin välillä
    },
    priceContainer: {
        flex: 1,
        // borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 19,
        fontWeight: '500',
        margin: 4,
    },
    price: {
        marginVertical: 6,
        fontSize: 20,
        fontWeight: '700'
    },
    activeProduct: {
        backgroundColor: '#d4edda', // Vihreä tausta aktiiviselle tilaukselle
        borderColor: '#28a745',
    },
    button: {
        backgroundColor: "#507ab8",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    notActiveBtn: {
        backgroundColor: "#656a70",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    activeText: {
        color: '#28a745',
        fontWeight: 'bold',
        marginTop: 10,
    },
    pagination: {
        position: 'absolute',
        bottom: height * 0.15, // Nostaa pisteet ylemmäs
        flexDirection: 'row',
        
        padding: 5,
        borderRadius: 5
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#507ab8',
    },
    inactiveDot: {
        backgroundColor: '#ffffff',
    }

})


export default Subscription;