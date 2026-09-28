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

const Miscellaneous = () => {
  const userLoginData = useContext(DataContext);
  const [misData, setMisData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMiscellaneous = async () => {
      try {
        const apiUrl = `${Url}/miscellaneous_details?student_id=${userLoginData.userLoginData.student_id}`;
        const response = await authenticatedFetch(apiUrl);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMisData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchMiscellaneous();
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
          misData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Row label="Regulation" value={item.regulation || '-'} />
              <Row label="Batch" value={item.batch || '-'} />
              <Row label="Degree Branch" value={item.degree_branch || '-'} />
              <Row label="First Name" value={item.first_name || '-'} />
              <Row label="Last Name" value={item.last_name || '-'} />
              <Row label="Roll Number" value={item.roll_number || '-'} />
              <Row
                label="Register Number"
                value={item.register_number || '-'}
              />
              <Row
                label="Current Semester"
                value={item.current_semester || '-'}
              />
              <Row
                label="Student Status"
                value={item.student_status_name || '-'}
              />
              <Row label="Section" value={item.section || '-'} />
              <Row label="Quota" value={item.QUOTA || '-'} />
              <Row label="Medium" value={item.medium || '-'} />
              <Row
                label="Mode of Admission"
                value={item.modeof_admission || '-'}
              />
              <Row
                label="Mode of Education"
                value={item.mode_of_education || '-'}
              />
              <Row
                label="Do You Need Hostel Facility?"
                value={item.is_hosteller || '-'}
              />
              <Row
                label="Special Categories"
                value={item.special_categories || '-'}
              />
              <Row
                label="Second Language"
                value={item.second_language || '-'}
              />
              <Row label="Remarks" value={item.remarks || '-'} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const Row = ({label, value}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.value}>{value}</Text>
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
    // justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    marginRight: 50,
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
    marginRight: 5,
    fontSize: 17,
    marginRight: 20
  },
});

export default Miscellaneous;
