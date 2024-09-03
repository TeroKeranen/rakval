import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Input } from "react-native-elements";


const FetchCompanyProducts = ({products, onHandleProductSelect}) => {

    const {t} = useTranslation();

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [searchQuery, setSearchQuery] = useState("");

    const handleTouchableSearchView = () => {
        handleOpenSearch();
    }


            // Päivitetään suodatettu tuotelista hakukyselyn perusteella
            useEffect(() => {
                if (searchQuery.trim().length > 0) {
                    const filtered = products.filter((product) =>
                        product.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setFilteredProducts(filtered);
                } else {
                    setFilteredProducts(products);
                }
            }, [searchQuery, products]);


    return (

        

            <View style={styles.searchInputContainer}>
            <Input 
                placeholder={t('fetchCompanyProducts-inputPlaceholder')}
                value={searchQuery} 
                onChangeText={setSearchQuery} 
                style={styles.searchInput} 
                />

            <View style={styles.productTitleContainer}>
                <Text style={styles.productTitleText}>Tuote</Text>
                <Text style={styles.productTitleText}>Määrä</Text>
                <Text style={styles.productTitleText}>hinta</Text>
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    
                    <TouchableOpacity onPress={() => onHandleProductSelect(item)} style={styles.productItem}>
                        <View style={styles.productContainer}>

                            <Text style={styles.productText}>{item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name}</Text>
                            <Text style={styles.productText}>{item.quantity}</Text>
                            <Text style={styles.productText}>{item.price.$numberDecimal}</Text>
                        </View>
                        
                    </TouchableOpacity>
                )}
                />
            </View>
        

    )
}


const styles = StyleSheet.create({

    searchInputContainer: {
        borderWidth: 1,
        borderRadius: 5,
        width: '100%'

        
      },
      searchInput: {
        marginVertical: 10,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        width: '90%',
        alignSelf: 'center'
    },
    productTitleContainer: {
        flexDirection: 'row', // Asettaa elementit riviin
        justifyContent: 'space-between', // Lisää tilaa elementtien välille
        alignItems: 'center', // Kohdistaa elementit keskelle pystysuunnassa
        padding: 4, // Lisää pystysuuntaista täytettä
    },
    productTitleText: {
        minWidth: 60, // Varmistaa, että kaikki tekstit ovat samankokoisia (voit säätää tämän tarpeen mukaan)
        textAlign: 'left', // Asettaa tekstin kohdistuksen vasemmalle
        fontWeight: '700'
    },
    productItem: {
        // justifyContent: 'center',
        // alignItems: 'center',
        padding: 4,
        borderBottomWidth: 1,

    },
    productContainer: {
        flexDirection: 'row', // Asettaa elementit riviin
        justifyContent: 'space-between', // Lisää tilaa elementtien välille
        alignItems: 'center', // Kohdistaa elementit keskelle pystysuunnassa
        paddingVertical: 5, // Lisää pystysuuntaista täytettä
    },
    productText: {
        minWidth: 60, // Varmistaa, että kaikki tekstit ovat samankokoisia (voit säätää tämän tarpeen mukaan)
        textAlign: 'left', // Asettaa tekstin kohdistuksen vasemmalle
    }
    
})

export default FetchCompanyProducts;