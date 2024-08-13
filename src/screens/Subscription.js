import { useEffect, useState } from "react"
import { FlatList, Platform, StyleSheet, Text, View } from "react-native"
import Purchases, { LOG_LEVEL } from "react-native-purchases";

const APIkeys = {
    apple:"appl_wHjihsMCXNIMqxwrRuAHWKfeAFz"
}

const Subscription = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const setup = async () => {
            if (Platform.OS == "android") {
                console.log("Ei androidille ole tuotteita");
                return;
            } else {
                await Purchases.configure({apiKey: APIkeys.apple})
            }

            Purchases.setLogLevel(LOG_LEVEL.DEBUG);

            await loadOfferings();
            // const offerings = await Purchases.getOfferings();
            // setProducts(offerings.current);
        };

        setup();
    }, [])

    const loadOfferings = async () => {
        try {
            const offerings = await Purchases.getOfferings();
            console.log("OFFERINGS", offerings);

            const currentOffering = offerings.current;
            if (currentOffering && currentOffering.availablePackages.length > 0) {
                console.log("Juuri nyt saatavilla oleva paketti:", currentOffering.availablePackages[0].product);
                setProducts(currentOffering.availablePackages);
            } else {
                console.log("Ei saatavilla olevia paketteja");
            }
        } catch (error) {
            console.error("Error loading offerings", error);
        }
    };


    const renderProduct = ({item}) => (
    <View style={styles.productContainer}>
        <Text style={styles.title}>{item.product.title}</Text>
        <Text>{item.product.description}</Text>
        <Text>{item.product.price_string}</Text>
        
      </View>
    )

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

})


export default Subscription;