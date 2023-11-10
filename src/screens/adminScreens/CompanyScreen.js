
import { useContext, useState, useEffect } from "react";
import { Context as CompanyContext } from "../../context/CompanyContext";
import {Context as AuthContext} from '../../context/AuthContext'

import { StyleSheet, View, Button, Text, ActivityIndicator } from "react-native";
import {  Input } from "react-native-elements";
import DownloadScreen from "../../components/DownloadScreen";
import { useTranslation } from "react-i18next";




const CompanyScreen = ({ navigation }) => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // Käytetään latausindikaattoria
  const { state, createCompany, fetchCompany } = useContext(CompanyContext);
  const {state:authState, fetchUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      setIsLoading(true);
      await fetchCompany();
      
      setIsLoading(false);
    };
    loadCompany();
    
  }, []);

  const handleCreateCompany = async () => {
    setIsLoading(true);
    await createCompany({ name, address, city });
    await fetchUser();
    setIsLoading(false);
  };

  if (isLoading) {
    return <DownloadScreen message={t("companyScreen-downloadScreen-message")} />;
  }
  const renderCompanyInfo = () => {
    return (
      <View style={styles.companyInfo}>
          <Text style={styles.title}>{t("companyScreen-companyInfo")}</Text>
        <View style={styles.infoCard}>

          <Text style={styles.text}>
            {t("companyScreen-companyInfo-name")}: {authState.user.company.name}
          </Text>
          <Text style={styles.text}>
            {t("companyScreen-companyInfo-address")}: {authState.user.company.address}
          </Text>
          <Text style={styles.text}>
            {t("companyScreen-companyInfo-city")}: {authState.user.company.city}
          </Text>
          <Text style={styles.text}>
            {t("companyScreen-companyInfo-code")}: {authState.user.company.code}
          </Text>
        </View>
      </View>
    );
  };

  // Funktio lomakkeen renderöintiin
  const renderCreateForm = () => {
    return (
      <View style={styles.companyInfo}>
          <Text style={styles.title}>{t("companyScreen-create")}</Text>
        <View style={styles.infoCard}>
          <Input placeholder={t("companyScreen-companyInfo-name")} value={name} onChangeText={setName} />
          <Input placeholder={t("companyScreen-companyInfo-address")} value={address} onChangeText={setAddress} />
          <Input placeholder={t("companyScreen-companyInfo-city")} value={city} onChangeText={setCity} />
          {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
          {/* <Button title="Luo yritys" onPress={() => createCompany({ name, address, city })} /> */}
          {/* <Button title="Luo yritys" onPress={handleCreateCompany} /> */}
          <Button title={t("companyScreen-create")} onPress={handleCreateCompany} />
        </View>
      </View>
    );
  };

  return <View style={styles.container}>{authState.user.company ? renderCompanyInfo() : renderCreateForm()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    
  },
  infoCard: {
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
  companyInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
  },
  text: {
    color: "black",
    fontSize: 15,
    padding: 6,
    margin: 4,
  },
});

export default CompanyScreen;
