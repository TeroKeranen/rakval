import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import BarCodeScanner from "../components/BarCodeScanner";
import { useContext, useEffect, useState } from "react";
import { Input } from "react-native-elements";


import {Context as AuthContext} from '../context/AuthContext'
import {Context as CompanyContext} from '../context/CompanyContext'
import FetchCompanyProducts from "../components/FetchCompanyProducts";
import { useTranslation } from "react-i18next";
import DownloadScreen from "../components/DownloadScreen";

const ProductsData = () => {

    const {t} = useTranslation();

    const {state: userState} = useContext(AuthContext);
    const {state: companyState, addCompanyProduct,getCompanyProducts} = useContext(CompanyContext);


    // const userId = userState._id;
    const companyId = userState?.user?.company?._id;

    

    useEffect(() => {
        if (companyId) {
            getCompanyProducts(companyId);
        }
    }, [companyId])

    const products = companyState.company?.products;
    // console.log("TUOTTEET", products)

    const [scannedData, setScannedData] = useState(null);

    const [productName, setProductName] = useState(""); // tuodaan tuotteen nimi
    const [productDescription, setProductDescription] = useState(""); // tuodaan tänne selitys tuotteesta
    const [productQuantity, setProductQuantity] = useState(0); // tuodaan tänne tuotteen määrä
    const [productPrice, setProductPrice] = useState(0); // tuodaan tänne tuotteen hinta
    const [scannedDataCode, setScannedDataCode] = useState(""); // Viivakoodin numerosarja
    const [scannedDataString, setScannedDataString] = useState(""); // viivakoodin tyyppi esim qr, ean13... Voidaan käyttää tätä halutessa
    const [modalVisible, setModalVisible] = useState(false); // Käytetään tätä  tuomaan viivakoodilukija esille

    const [searchVisible, setSearchVisible] = useState(false); // Kun tämä on true, niin tuotteet ja hakukenttä tulee esille
    // const [searchQuery, setSearchQuery] = useState("");
    // const [filteredProducts, setFilteredProducts] = useState(products); // tänne tuodaan suodatetut tuotteet ja tämä viedään flatlistiin joka näyttää käyttäjälle tuotteen / tuotteet
    const [isLoading, setIsLoading] = useState(false);

    
        // Päivitetään suodatettu tuotelista hakukyselyn perusteella
        // useEffect(() => {
        //     if (searchQuery.trim().length > 0) {
        //         const filtered = products.filter((product) =>
        //             product.name.toLowerCase().includes(searchQuery.toLowerCase())
        //         );
        //         setFilteredProducts(filtered);
        //     } else {
        //         setFilteredProducts(products);
        //     }
        // }, [searchQuery, products]);

    const handleBarCodeScanned = (type, data) => {
        setScannedData({ type, data });
        
                // Tarkista, että type ja data eivät ole undefined ennen tilojen päivittämistä
                if (type && data) {
                    setScannedDataCode(type);
                    setScannedDataString(data);

                    const foundProduct = products.find(product => product.barcode === type)

                    if (foundProduct) {
                        Alert.alert(t('productsData-screen-scannerFoundItem'));
                        setProductName(foundProduct.name);
                        setProductDescription(foundProduct.description);

                         // Muunna Decimal128-muotoinen price merkkijonoksi ja sitten numeroksi
                        const priceAsNumber = parseFloat(foundProduct.price.$numberDecimal);
                        setProductPrice(priceAsNumber.toFixed(2)); // Aseta aina kahden desimaalin tarkkuudella
                        setProductQuantity(foundProduct.quantity.toString());
                    } else {
                        Alert.alert(t('productsData-screen-scannerNotFoundItem-title'),t('productsData-screen-scannerNotFoundItem-text'))
                    }
                }
        setModalVisible(false);
        
        
    };


    // Käytetään kun painetaan haluttua tuotetta listassa. tämä vie tuottee inputteihin
    const handleProductSelect = (product) => {
        setProductName(product.name);
        setProductDescription(product.description);
        const priceAsNumber = parseFloat(product.price.$numberDecimal);
        setProductPrice(priceAsNumber.toFixed(2));
        setProductQuantity(product.quantity.toString());
        setScannedDataCode(product.barcode);
        setSearchVisible(false);  // Sulkee hakukentän
    };
    
    const addProduct = async () => {
        setIsLoading(true);
        // Tarkista, että price on numero ja pyöristä se kahden desimaalin tarkkuudelle
        const validatedPrice = parseFloat(productPrice).toFixed(2);
        if (isNaN(validatedPrice)) {
            Alert.alert(t('error'), t('productsData-screen-validPriceError'));
            setIsLoading(false);
            return;
        }

        const validatedQuantity = Number(productQuantity);
        if (isNaN(validatedQuantity) || validatedQuantity < 0) {
            Alert.alert(t('error'), t('productsData-screen-validQuantityError'));
            setIsLoading(false);
            return;
        }
        
        const result = await addCompanyProduct({
            companyId,
            barcode: scannedDataCode,
            name: productName.toLowerCase(),
            description: productDescription,
            quantity: validatedQuantity,
            price: parseFloat(validatedPrice)
        })

        if (result.success) {
            Alert.alert(t('productsData-screen-addedProduct-success'))
            handleEmpthyInputs();
            await getCompanyProducts(companyId);
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.alert(t('productsData-screen-addedProduct-fail'), result.error);
        }
        
    }

    // käytetään kun halutaan tallentaa tuotteen tiedot
    const handleSubmit = () => {
        // console.log("tuote", productName, productDescription, productQuantity, productPrice, scannedDataCode)
        addProduct();
    }
    

    // Käytetään tätä kun halutaan input kentät tyhjäksi
    const handleEmpthyInputs = () => {
        setProductName("");
        setProductDescription("");
        setProductPrice(0);
        setProductQuantity(0);
        setScannedDataString("");
        setScannedDataCode("");
    }


    // avaa viivakoodilukijan modalin
    const handleOpenModal = () => {
        handleEmpthyInputs();
        setModalVisible(!modalVisible)

    }

    // avataan tai suljetaan tällä tuotelista ja haku ominaisuus
    const handleOpenSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const handleTouchableWithoutFeedback = () => {
        if (searchVisible) {

            handleOpenSearch();
        }
        Keyboard.dismiss();
    }

    if (isLoading) {
        return <DownloadScreen message={t('loading')} />
      }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >

        <TouchableWithoutFeedback onPress={handleTouchableWithoutFeedback}>

            <View style={styles.container}>
                <View style={styles.addWorksiteButtonContainer}>

                    <TouchableOpacity onPress={handleOpenModal} style={styles.button}>
                        <Text style={{color: 'white'}}>{t('productsData-screen-barcodeBtn')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleOpenSearch} style={styles.button}>
                        <Text style={{ color: 'white' }}>{t('productsData-screen-searchBtn')}</Text>
                    </TouchableOpacity>
                </View>

                {searchVisible && 

                    <FetchCompanyProducts products={products}  onHandleProductSelect={handleProductSelect}   />
                }
                <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} isVisible={modalVisible} onClose={() => setModalVisible(false)}/>


                
                <View style={styles.inputContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    <View onStartShouldSetResponder={() => true}>

                    <Input 
                        style={styles.input} 
                        label={t('product')} labelStyle={{ color: 'gray', fontSize: 16, marginBottom: 5 }} 
                        value={productName} 
                        onChangeText={setProductName}
                        />
                    <Input 
                        style={styles.input} 
                        label={t('description')}
                        labelStyle={{ color: 'gray', fontSize: 16, marginBottom: 5 }}  
                        value={productDescription} 
                        onChangeText={setProductDescription}
                        />
                    <Input 
                        style={styles.input} 
                        label={t('quantity')} 
                        labelStyle={{ color: 'gray', fontSize: 16, marginBottom: 5 }} 
                        keyboardType="numeric" 
                        value={productQuantity} 
                        onChangeText={setProductQuantity}
                        />
                    <Input 
                        style={styles.input} 
                        label={t('price')}
                        labelStyle={{ color: 'gray', fontSize: 16, marginBottom: 5 }} 
                        keyboardType="numeric" 
                        value={productPrice} 
                        onChangeText={setProductPrice}
                        />
                    <Input 
                        style={styles.input} 
                        label={t('barcodeNumber')}
                        labelStyle={{ color: 'gray', fontSize: 16, marginBottom: 5 }} 
                        value={scannedDataCode} 
                        onChangeText={setScannedDataCode}
                        />
                    
                    </View>
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity onPress={handleEmpthyInputs} style={styles.button}>
                            <Text style={{color: 'white'}}>{t('productsData-screen-clearBtn')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={{color: 'white'}}>{t('save')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                </View>

            </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    addWorksiteButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 20,
        
        width: '100%'
        
      },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    button: {
        backgroundColor: "#507ab8",
            padding: 10,
            borderRadius: 5,
            marginVertical: 10,
            // width: "50%",
            alignItems: "center",
            alignSelf:'center',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
      },
      inputContainer: {
        flex: 1,
        backgroundColor: "#e8e8f0",
        width: "90%",
        padding: 40,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
      },
  
})



export default ProductsData;