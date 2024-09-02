import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Context as WorksiteContext } from "../../context/WorksiteContext"
import { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import UpdateProductModal from "../../components/UpdateProductModal";
import AddProductModal from "../../components/AddProductModal";
import { useTranslation } from "react-i18next";
import DownloadScreen from "../../components/DownloadScreen";
import {CameraView,Camera, useCameraPermissions} from "expo-camera";

const ProductScreen = () => {



    const { t } = useTranslation();
    const {state, deleteProductFromWorksite, updateProduct, addProduct} = useContext(WorksiteContext);
    const [modalVisible, setModalVisible] = useState(false); // tuotteen updatea varten
    const [addProductVisible, setAddProductVisible] = useState(false) // tuotteen lisäämistä varten
    const [selectedProduct, setSelectedProduct] = useState(null); // valitaan tuote joka näytetään modalissa
    // const [products, setProducts] = useState(state.currentWorksite?.products || []);
    const [isLoading, setIsLoading] = useState(false);
    const products = state.currentWorksite?.products;
    const worksiteId = state.currentWorksite._id;

    //barcode
    // const [permission, requestPermission] = useCameraPermissions();
    // const [hasPermission, setHasPermission] = useState(null);
    // const [scanned, setScanned] = useState(false);

    // useEffect(() => {
    //     (async () => {
        
    //       const { status } = await Camera.requestCameraPermissionsAsync();
    //       setHasPermission(status === 'granted');
    //     })();
    //   }, []);




    
    useEffect(() => {
        
        // setProducts(state.currentWorksite?.products || []);
    }, [state.currentWorksite.products]);
    
    const deleteProduct = (productId) => {
        setIsLoading(true)
        Alert.alert(
            t('productScreen-deleteTitle'),
            t('productScreen-deleteSure'),
            [
                {
                    text: t('cancel'),
                    onPress: () => {
                        setIsLoading(false)
                    },
                    style: "cancel",
                },
                {
                    text: t('yes'),
                    onPress: () => {

                        deleteProductFromWorksite(worksiteId, productId)
                            .then(response => {
                                if (response.success) {
                                    Alert.alert(t('succeeded'))
                                    setIsLoading(false);
                                }
                            })
                            .catch(error => {

                                Alert.alert(t('fail'))
                                setIsLoading(false);
                                return;
                            })
                    }
                }
            ],
            { cancelable: true }
        )

    }

    const openUpdateModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    }

    const openAddProductModal = () => {
        setAddProductVisible(true);
    }

    const handleUpdateProduct = async (updatedProduct) => {

        setIsLoading(true)

        const producId = updatedProduct._id;

        Alert.alert(
            t('productScreen-updateTitle'),
            t('productScreen-updateSure'),
            [
                {
                    text: t('cancel'),
                    onPress: () => {
                        setIsLoading(false)
                        setModalVisible(false);
                    }
                },
                {
                    text: t('yes'),
                    onPress: () => {

                        updateProduct(worksiteId, producId,updatedProduct.name, updatedProduct.quantity)
                            .then(result => {
                                if (result.success) {
                                    Alert.alert(t('succeeded'))
                                }
                                setIsLoading(false)
                                setModalVisible(false);
                            })
                            .catch(error => {
                                Alert.alert(t('fail'))
                                setIsLoading(false)
                                setModalVisible(false);
                            })
                    }
                }
            ],
            { cancelable: true }
        )
        
        // setProducts(products.map(product => {
        //     if (product._id === updatedProduct._id) {
        //         console.log("Updated product:", updatedProduct);
        //         return updatedProduct;
        //     }
        //     return product;
        // }));
        setModalVisible(false);
    };

    const handleAddProduct = async (name, quantity) => {

        setIsLoading(true)
        const productData = {
            productName: name,
            quantity: quantity
        }
        await addProduct(worksiteId, productData)
            .then(result => {
                if (result.success) {
                    Alert.alert(t('succeeded'))
                }
                setAddProductVisible(false);
                setIsLoading(false);
            })
            .catch(error => {
                Alert.alert(t('fail'))
                setAddProductVisible(false);
                setIsLoading(false);
            })
            
        setAddProductVisible(false);

    }
    

    const renderItem = ({item}) => (
        <View style={styles.productlist}>

            <View style={styles.product}>

            <Text style={styles.text}>{t('product')}: {item.name}</Text>
            <Text style={styles.text}>{t('kpl')}: {item.quantity}</Text>
            </View>
            {/* <Text>{item._id}</Text> */}

            <View style={styles.buttonsContainer}>

                <TouchableOpacity onPress={() => openUpdateModal(item)}>
                    <Ionicons name="pencil" size={20}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteProduct(item._id)}>
                    <Ionicons name="trash" size={20}/>
                </TouchableOpacity>

            </View>

            
        </View>
    )


    // const handleBarCodeScanned = ({ type, data }) => {
    //     console.log("Jsjsjsj")
    //     setScanned(true);
    //     Alert.alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    //   };

    
    // if (hasPermission === null) {
    //     return <Text>reguest camerapermission</Text>;
    //   }
    //   if (hasPermission === false) {
    //     return <Text>ei yhteyttä kameraan</Text>;
    //   }

    if (isLoading) {
        return (
            <DownloadScreen message={t('loading')} />
        )
      }

    return (
        <View style={styles.container}>

                {/* <View style={styles.containerS}>
                    <CameraView
                        
                        style={StyleSheet.absoluteFillObject}
                        facing="back"
                        onBarcodeScanned={({type,data}) => {
                            console.log("data", data)
                            console.log("type", type);
                        }}
                        // onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ['aztec', 'ean13', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a'],
                          }}
                        
                    />
                        {scanned && <Button title="tap to scan again" onPress={() => setScanned(false)} />}
                            
                </View> */}

            <View>
                <TouchableOpacity onPress={() => openAddProductModal()} style={styles.workDaybutton} >
                    {/* <Text style={{color: 'white'}}>{t('productScreen-addproductBtn')}</Text> */}
                    <Ionicons style={{color: 'white'}} name="add-circle-outline" size={30} />
                </TouchableOpacity>
            </View>

            <View style={styles.productContainer}>
                <FlatList 
                    data = {products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContentContainer}
                />
            </View>

            {selectedProduct && (
                <UpdateProductModal 
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    product={selectedProduct}
                    onUpdate={handleUpdateProduct}
                />
            )}

            <AddProductModal 
                isVisible={addProductVisible}
                onClose={() => setAddProductVisible(false)}
                handleAdd={handleAddProduct}
            />


        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    // containerS: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   },
    workDaybutton: {
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
      productContainer: {
        flex: 1,
        
      },
      productlist: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        
        marginVertical: 10,
        backgroundColor: '#e2dbdb',
        padding: 10,
        borderRadius: 5,
      },
      product: {
        marginBottom: 10
      },
      listContentContainer: {
        paddingBottom: 20
      },
      buttonsContainer: {
        
        width: 100,
        
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      text: {
        fontSize: 18,
        margin: 5,
      }

})


export default ProductScreen;