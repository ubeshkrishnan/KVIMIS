import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Color';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const PersonalInfo = () => {
  const userLoginData = useContext(DataContext);
  const [personalData, setPersonalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalInformation = async () => {
      try {
        const apiUrl = `${Url}/personal_info?user_id=${userLoginData.userLoginData.user_id}`;
        const response = await authenticatedFetch(apiUrl);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setPersonalData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchPersonalInformation();
  }, [userLoginData]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.cardContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="medium" color={Colors.RedColorDark} />
            <Text style={{color: Colors.Grey4F}}>Loading</Text>
          </View>
        ) : (
          personalData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Row
                label="Father / Guardian Name "
                value={item.father_guardian_name || '-'}
              />
              <Row
                label="Father Mobile Number"
                value={item.father_mobile_number || '-'}
              />
              <Row label="Mother Name" value={item.mother_name || '-'} />
              <Row
                label="Mother Mobile Number"
                value={item.mother_mobile_number || '-'}
              />
              <Row
                label="Occupation of Father/Guardian"
                value={item.occupation_of_father_guardian || '-'}
              />
              <Row
                label="Occupation of Mother"
                value={item.occupation_of_mother || '-'}
              />
              <Row
                label="Father Annual Income"
                value={item.father_annual_income || '-'}
              />
              <Row
                label="Mother Annual Income"
                value={item.mother_annual_income || '-'}
              />
              <Row
                label="Door No & Street Name "
                value={item.door_no_street_name || '-'}
              />
              <Row
                label="Name of Area/Village/Town "
                value={item.name_of_area_village_town || '-'}
              />
              <Row label="Pincode " value={item.pincode || '-'} />
              <Row label="City " value={item.city || '-'} />
              <Row label="State " value={item.state || '-'} />
              <Row label="Country " value={item.country || '-'} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const Row = ({label, value}) => (
  <View style={styles.row}>
    <Text style={styles.label}>
      {label}
      {/* <Text style={{color: 'red'}}>*</Text> */}
    </Text>
    <Text style={{color: 'black', marginRight: 20, fontWeight: 'bold'}}>:</Text>
    <Text style={styles.value}> {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: Colors.Grey1F,
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.WhiteF,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    marginRight: 50,
    width: responsiveWidth(25),
    fontSize: 17,
  },
  value: {
    flex: 1,
    color: 'black',
    fontSize: Colors.Data_FontSize,
  },
  required: {
    color: 'red',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  colon: {
    color: 'black',
    fontSize: 17,
    marginRight: 20,
  },
});

export default PersonalInfo;
