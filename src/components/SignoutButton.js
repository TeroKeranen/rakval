import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useTranslation } from "react-i18next";


const SignoutButton = ({onLogout}) => {
    const { t } = useTranslation();
    return (
        <View>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                <Text style={styles.buttonText}>{t("profileScreen-signout")}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  logoutButton: {
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
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default SignoutButton