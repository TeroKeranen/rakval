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
    marginBottom: 15,
    width: "50%",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default SignoutButton