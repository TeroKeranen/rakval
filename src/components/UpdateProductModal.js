import { useEffect, useState } from "react";
import { Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";


const UpdateProductModal = ({isVisible, onClose, product, onUpdate}) => {

    const {t} = useTranslation();
    const [name, setName] = useState(product.name);
    const [quantity, setQuantity] = useState(String(product.quantity));

    useEffect(() => {
        setName(product.name);
        setQuantity(String(product.quantity));
    }, [product]);

    const handleUpdate = () => {
        const updatedProduct = {
            ...product,
            name,
            quantity: parseInt(quantity, 10)
        };
        onUpdate(updatedProduct);
    };

    const handleCloseModal = () => {
        setName(product.name);
        setQuantity(String(product.quantity));
        onClose();
    }

       
    return (

        <Modal animationType="slide" transparent={true} visible={isVisible} >
        <SafeAreaView style={{flex:1}}>

            <View style={styles.container}>

                <View style={styles.modalView}>
                    <View style={styles.inputs}>

                        <TextInput
                            style={styles.titleInput}
                            placeholder="name"
                            value={name}
                            onChangeText={setName}
                            editable={true}
                            />
                        <TextInput
                            style={styles.titleInput}
                            placeholder="quantity"
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                            
                            />
                    </View>

                    <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                        <Text style={{color: 'white'}}>{t('update')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>


            </View>

        </SafeAreaView>
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
        width: "90%",
        height: '70%',
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
        padding: 3,
        
      },
    updateButton: {
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
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        padding: 10,
        backgroundColor: "#5656e2",
        borderTopRightRadius: 20,
      },
})
    
export default UpdateProductModal;