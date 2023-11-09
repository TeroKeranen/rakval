
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
      <View>
        <Text style={styles.text}>{t("companyScreen-companyInfo")}:</Text>
        <Text>
          {t("companyScreen-companyInfo-name")}: {authState.user.company.name}
        </Text>
        <Text>
          {t("companyScreen-companyInfo-address")}: {authState.user.company.address}
        </Text>
        <Text>
          {t("companyScreen-companyInfo-city")}: {authState.user.company.city}
        </Text>
        <Text>
          {t("companyScreen-companyInfo-code")}: {authState.user.company.code}
        </Text>
      </View>
    );
  };

  // Funktio lomakkeen renderöintiin
  const renderCreateForm = () => {
    return (
      <View>
        <Text style={styles.text}>{t("companyScreen-create")}</Text>
        <Input placeholder={t("companyScreen-companyInfo-name")} value={name} onChangeText={setName} />
        <Input placeholder={t("companyScreen-companyInfo-address")} value={address} onChangeText={setAddress} />
        <Input placeholder={t("companyScreen-companyInfo-city")} value={city} onChangeText={setCity} />
        {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
        {/* <Button title="Luo yritys" onPress={() => createCompany({ name, address, city })} /> */}
        {/* <Button title="Luo yritys" onPress={handleCreateCompany} /> */}
        <Button title={t("companyScreen-create")} onPress={handleCreateCompany} />
      </View>
    );
  };

  return <View>{authState.user.company ? renderCompanyInfo() : renderCreateForm()}</View>;
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
});

export default CompanyScreen;
