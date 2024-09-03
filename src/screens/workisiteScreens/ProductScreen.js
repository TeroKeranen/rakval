import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Context as WorksiteContext } from "../../context/WorksiteContext"
import {Context as CompanyContext} from "../../context/CompanyContext"
import {Context as AuthContext} from "../../context/AuthContext"
import { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import UpdateProductModal from "../../components/UpdateProductModal";
import AddProductModal from "../../components/AddProductModal";
import { useTranslation } from "react-i18next";
import DownloadScreen from "../../components/DownloadScreen";
import {CameraView,Camera, useCameraPermissions} from "expo-camera";
import FetchCompanyProducts from "../../components/FetchCompanyProducts";

const ProductScreen = () => {



    const { t } = useTranslation();
    const {state: companyState, addCompanyProduct,getCompanyProducts, fetchCompany} = useContext(CompanyContext);
    const {state, deleteProductFromWorksite, updateProduct, addProduct} = useContext(WorksiteContext);
    const {state: userState} = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false); // tuotteen updatea varten
    const [addProductVisible, setAddProductVisible] = useState(false) // tuotteen lisäämistä varten
    const [selectedProduct, setSelectedProduct] = useState(null); // valitaan tuote joka näytetään modalissa
    // const [searchVisible, setSearchVisible] = useState(false); // Kun tämä on true, niin tuotteet ja hakukenttä tulee esille
    // const [products, setProducts] = useState(state.currentWorksite?.products || []);
    const [isLoading, setIsLoading] = useState(false);
    
    const products = state.currentWorksite?.products;
    

    const worksiteId = state.currentWorksite._id;

    
    const companyId = userState?.user?.company?._id;

    

    useEffect(() => {
        if (companyId) {
            // getCompanyProducts(companyId);
        }
    }, [companyState.company?.products])
    
    useEffect(() => {
        
        // setProducts(state.currentWorksite?.products || []);
    }, [state.currentWorksite.products]);
    
    // const companyProducts = companyState.company?.products;
    // Manuaalisten tuotteiden poistaminen listalta
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
    // manuaalisten tuotteiden lisäyksen modal
    const openAddProductModal = () => {
        setAddProductVisible(true);
    }

    // // avataan tai suljetaan tällä tuotelista ja haku ominaisuus
    // const handleOpenSearch = () => {
    //     setSearchVisible(!searchVisible);
    // };


    // manuaalisten tuotteiden muokkaus
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

                        updateProduct(worksiteId, producId,updatedProduct.name, updatedProduct.quantity,companyId, updatedProduct.barcode)
                            .then(result => {
                                // console.log("resultrestul",result)
                                if (result.success) {
                                    Alert.alert(t('succeeded'))
                                }
                                setIsLoading(false)
                                setModalVisible(false);
                            })
                            .catch(error => {
                                console.log(error);
                                Alert.alert(t('fail'))
                                setIsLoading(false)
                                setModalVisible(false);
                            })
                    }
                }
            ],
            { cancelable: true }
        )
        

        setModalVisible(false);
    };



    const handleAddProduct = async (productData) => {
        setIsLoading(true);
        await addProduct(worksiteId, productData)
          .then(result => {
            if (result.success) {
                console.log("resuuult", result);
              Alert.alert(t('succeeded'));
            }
            setAddProductVisible(false);
            setIsLoading(false);
          })
          .catch(error => {
            Alert.alert(t('fail'));
            setAddProductVisible(false);
            setIsLoading(false);
          });
      };


    const renderItem = ({item}) => (
        <View style={styles.productlist}>

            <View style={styles.product}>

            <Text style={styles.text}>{t('product')}: {item.name}</Text>
            <Text style={styles.text}>{t('kpl')}: {item.quantity}</Text>
            {/* <Text style={styles.text}>{t('price')}: {item?.price?.$numberDecimal}</Text> */}
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




    if (isLoading) {
        return (
            <DownloadScreen message={t('loading')} />
        )
      }

    return (
        <View style={styles.container}>


            <View style={styles.addWorksiteButtonContainer}>


                {/* <TouchableOpacity onPress={handleOpenSearch} style={styles.button}>
                    <Text style={{ color: 'white' }}>{t('productsData-screen-searchBtn')}</Text>
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => openAddProductModal()} style={styles.workDaybutton} >
                    {/* <Text style={{color: 'white'}}>{t('productScreen-addproductBtn')}</Text> */}
                    <Ionicons style={{color: 'white'}} name="add-circle-outline" size={30} />
                </TouchableOpacity>
            </View>

                {/* {searchVisible && 
                    <FetchCompanyProducts products={companyProducts}/>
                } */}
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
      },
      addWorksiteButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 20,
        
        width: '100%'
        
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

})


export default ProductScreen;