import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";


const InstructionsAdmin = () => {
    const {t} = useTranslation();

    return (
        <View style={styles.ohjeContainer}>
        <ScrollView style={styles.scrollView}>

        <Text style={styles.ohjeText}>{t('adminInfoTitle1')}</Text>
            
                <View>

                    <Text style={styles.text}>{t('adminInfoText1')}:</Text>
                                                                        
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image}
                            
                            source={require('../../assets/ohje/1.png')}
                            />
                    </View>

                    <Text style={styles.title}>{t('adminInfoTitle2')}:</Text>

                    <Text style={styles.text}>{t('adminInfoText2')}
                    </Text>
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image}
                            source={require('../../assets/ohje/6.png')}
                            />
                    </View>

                    <Text style={styles.title}>{t('adminInfoTitle3')}:</Text>
                    <Text style={styles.text}>{t('adminInfoText3')}</Text>
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image}
                            source={require('../../assets/ohje/2.png')}
                            />
                    </View>

                    <Text style={styles.title}>{t('adminInfoTitle4')}:</Text>
                    <Text style={styles.text}>{t('adminInfoText4')}</Text>
                    
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image}
                            source={require('../../assets/ohje/3.png')}
                            />
                    </View>

                    <Text style={styles.text}>{t('adminInfoText4-2')}</Text>
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image}
                            source={require('../../assets/ohje/4_4.png')}
                            />
                    </View>

                    <Text style={styles.title}>{t('adminInfoTitle5')}:</Text>
                    <Text style={styles.text}>{t('adminInfoText5')}</Text>
                    
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image}
                            source={require('../../assets/ohje/5.png')}
                            />
                    </View>

                    <Text style={styles.title}>{t('adminInfoTitle6')}:</Text>
                    <Text style={styles.text}>{t('adminInfoText6')}</Text>
                    
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image}
                            source={require('../../assets/ohje/7.png')}
                            />
                    </View>

                    <Text style={styles.title}>{t('adminInfoTitle7')}:</Text>
                    <Text style={styles.text}>{t('adminInfoText7')}</Text>

                </View>

            
        </ScrollView>
    </View>
    )

}

const styles = StyleSheet.create({

    ohjeContainer: {
        padding: 12,
        marginVertical: 8,
        backgroundColor: "#dad0d0",
        borderRadius: 6,
        elevation: 3,
        shadowColor: "black",
        shadowRadius: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        width: "90%",
        alignItems: 'center',
        justifyContent: 'center'
      },
      scrollView: {
        width: '100%'
      },
      ohjeText: {
        alignSelf: 'center',
        fontSize: 23,
        fontWeight: "700",
        marginVertical: 10,
        color: "#000000",
      },
      title: {
        fontWeight: '600',
        marginTop: 10,
        fontSize: 20
      },
      text: {
        fontSize: 16
      },
      imageContainer: {
        margin: 10,
        alignItems: 'center'
    },
    image: {
        width: 600,
        height: 600,
        resizeMode: 'contain', // Muita arvoja ovat 'cover', 'stretch', 'repeat', 'center'
    
    },

})

export default InstructionsAdmin;