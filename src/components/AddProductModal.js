import { Modal, StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView, ScrollView, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform} from "react-native";

import { Context as WorksiteContext } from "../context/WorksiteContext"
import { Context as CompanyContext } from "../context/CompanyContext"
import { Context as AuthContext } from "../context/AuthContext"

import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FetchCompanyProducts from "./FetchCompanyProducts";
import { Input } from "react-native-elements";

const AddProductModal = ({isVisible, onClose, handleAdd}) => {

    const {state: companyState, addCompanyProduct,getCompanyProducts, fetchCompany} = useContext(CompanyContext);
    const {state, deleteProductFromWorksite, updateProduct, addProduct} = useContext(WorksiteContext);
    const {state: userState} = useContext(AuthContext);

    const { t } = useTranslation();
    const [name,setName] = useState("");
    const [quantity,setQuantity] = useState("")
    const [searchVisible, setSearchVisible] = useState(false); // Kun tämä on true, niin tuotteet ja hakukenttä tulee esille

    const [productName, setProductName] = useState(""); // tuodaan tuotteen nimi
    const [productDescription, setProductDescription] = useState(""); // tuodaan tänne selitys tuotteesta
    const [productQuantity, setProductQuantity] = useState(0); // tuodaan tänne tuotteen määrä
    const [productPrice, setProductPrice] = useState(0); // tuodaan tänne tuotteen hinta
    const [scannedDataCode, setScannedDataCode] = useState(""); // Viivakoodin numerosarja

    const companyId = userState?.user?.company?._id;


    useEffect(() => {
        if (companyId) {
            getCompanyProducts(companyId);
            fetchCompany();
        }
    }, [companyId])

    // useEffect(() => {
    //     if (state.currentWorksite.products) {
    //         getCompanyProducts(companyId); // Tämä varmistaa, että yrityksen tuotteet päivittyvät kun työmaan tuotteita muutetaan
    //         // fetchCompany();
    //     }
    // }, [state.currentWorksite.products]);


    const companyProducts = companyState.company?.products;

    // console.log("KJSALJDALKSJDLK", companyProducts);

    // const handleAddProduct = () => {
    //     const productData = {

    //     }
    //     handleAdd(name, quantity)
    // }
    const handleAddProduct = async () => {
        const productData = {
          productName: productName,
          quantity: Number(productQuantity),
          description: productDescription,
          barcode: scannedDataCode,
          price: Number(productPrice),
          companyId: companyId
        };
    
        await handleAdd(productData);
        await getCompanyProducts(companyId);
        handleCloseModal(); // Tyhjennä lomake ja sulje modal
      };

    // const handleCloseModal = () => {
    //     setName("");
    //     setQuantity("");
    //     onClose()
    // }
    const handleCloseModal = () => {
        setProductName("");
        setProductDescription("");
        setProductQuantity(0);
        setProductPrice(0);
        setScannedDataCode("");
        onClose();
      };
    // avataan tai suljetaan tällä tuotelista ja haku ominaisuus
    const handleOpenSearch = () => {
        setSearchVisible(!searchVisible);
    };
    
    // Käytetään kun painetaan haluttua tuotetta listassa. tämä vie tuottee inputteihin
    const handleProductSelect = (product) => {
        setProductName(product.name);
        setProductDescription(product.description);
        const priceAsNumber = parseFloat(product.price.$numberDecimal);
        setProductPrice(priceAsNumber.toFixed(2));
        setProductQuantity(0);
        setScannedDataCode(product.barcode);
        setSearchVisible(false);  // Sulkee hakukentän
    };

    // Käytetään tätä kun halutaan input kentät tyhjäksi
    const handleEmpthyInputs = () => {
        setProductName("");
        setProductDescription("");
        setProductPrice(0);
        setProductQuantity(0);
        
        setScannedDataCode("");
    }

    const handleTouchableWithoutFeedback = () => {
        if (searchVisible) {

            handleOpenSearch();
        }
        Keyboard.dismiss();
    }
    
    


    return (

        <Modal animationType="slide" transparent={true} visible={isVisible} >

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
            <TouchableWithoutFeedback onPress={handleTouchableWithoutFeedback}>

            
            <SafeAreaView style={{flex: 1}}>

                <View style={styles.container}>

                    <View style={styles.modalView}>

                                
                        <TouchableOpacity onPress={handleOpenSearch} style={styles.button}>
                            <Text style={{ color: 'white' }}>{t('productsData-screen-searchBtn')}</Text>
                        </TouchableOpacity>
                            {searchVisible && 
                            <FetchCompanyProducts products={companyProducts} onHandleProductSelect={handleProductSelect} />
                            }

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

                                <View style={styles.buttonContainer}>

                                    <TouchableOpacity onPress={handleEmpthyInputs} style={styles.button}>
                                        <Text style={{color: 'white'}}>{t('productsData-screen-clearBtn')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleAddProduct} style={styles.button}>
                                        <Text style={{color: 'white'}}>{t('save')}</Text>
                                    </TouchableOpacity>

                                </View>
                                
                            </View>
 
                                </ScrollView>
                        </View>

                    <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    </View>



                </View>

            </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </Modal>
    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems:'center'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 35,
        paddingHorizontal: 55,
        width: "100%",
        height: '100%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputs: {
        
        width: "100%",
    },
    titleInput: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 3,
        padding: 5,
        
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
    addButton: {
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        padding: 10,
        backgroundColor: "#5656e2",
        borderTopRightRadius: 20,
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
        width: "100%",
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



export default AddProductModal;