import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";


const StartingWork = ({futureStart}) => {
    const navigation = useNavigation();
    const {t} = useTranslation();
 
    // Käytetään tätä funktiota kun painetaan tietystä työmaasta
    const handlePressWorksite = (worksiteId) => {
        navigation.navigate("WorksiteDetails", { worksiteId });
    };
    const renderStarting = ({item}) => {
        
        return (

            <Pressable onPress={() => handlePressWorksite(item._id)} style={({pressed}) => pressed && styles.pressed}>
                <View style={styles.startingContainer}>
                    <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{item.address}</Text>
                    <Text style={styles.text}>{item.city}</Text>
                    <Text style={styles.text}>{item.startTime}</Text>
                </View>
            </Pressable>

        )

    }

    if (futureStart.length < 1) {
        return (
            <View style={styles.empthyContainer}>
                <Text style={{color:'white'}}>{t('etusivu-noFuturework')}</Text>
            </View>
        )
    }



    return (
        <View style={styles.container}>

            


            <FlatList
                data={futureStart}
                renderItem={renderStarting}
                keyExtractor={item => item._id.toString()}
                numColumns={3} // Asetetaan 3 kohdetta per rivi
                columnWrapperStyle={styles.columnWrapper}
                
                />
            </View>

           

        
    )

}

const styles = StyleSheet.create({
    container: {
        height: 250,
        width: '90%',

        padding:10,
        borderRadius: 10,
        flexDirection: 'row',
        marginTop: 15,
        marginHorizontal: 10,
        shadowColor: '#000000', // Varjon väri
        shadowOffset: { width: 0, height: 4 }, // Varjon offset (suunta)
        shadowOpacity: 1, // Varjon peittävyys
        shadowRadius: 4, // Varjon sumeus
        elevation: 5, // Android-varjo
        backgroundColor: '#333644', // Tausta lisättävä, jotta varjo näkyy kunnollas Androidilla)
        elevation: 5, // Vain Androidille

    },
    pressed: {
        opacity: 0.75,
    },
    empthyContainer: {
        height: 250,
        width: '90%',
        justifyContent: 'center',
        alignItems:'center',
        padding:10,
        borderRadius: 10,
        flexDirection: 'row',
        marginTop: 15,
        marginHorizontal: 10,
        shadowColor: '#000000', // Varjon väri
        shadowOffset: { width: 0, height: 4 }, // Varjon offset (suunta)
        shadowOpacity: 1, // Varjon peittävyys
        shadowRadius: 4, // Varjon sumeus
        elevation: 5, // Android-varjo
        backgroundColor: '#333644', // Tausta lisättävä, jotta varjo näkyy kunnollas Androidilla)
        elevation: 5, // Vain Androidille

    },

    startingContainer: {
        flex: 1,
        margin: 5, // Lisää väliä elementtien välille
        padding: 10, // Lisää sisäistä tyhjää
        backgroundColor: '#fff', // Aseta taustaväri
        borderRadius: 5, // Pyöristetyt kulmat
        alignItems: 'center', // Keskittää tekstin
        minWidth: 100, // Aseta minimileveys
        maxWidth: '30%', // Aseta maksimi leveys suhteessa konttiin
    },
    columnWrapper: {
        // Jakaa kohteet tasaisesti vaakasuunnassa
    },
    text: {
        color: 'black',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center', // Keskittää tekstin laatikon sisälle
    }
})

export default StartingWork;