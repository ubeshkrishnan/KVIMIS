import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import Colors from '../../Color';
import {DataContext} from '../../context/DataContext';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const DashboardHostel = () => {
  const {userLoginData} = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [hostelData, setHostelData] = useState([]);
  const [hostelDataCount, setHostelDataCount] = useState([]);
  const [otherHostelData, setOtherHostelData] = useState([]);
  const [otherHostelDataCount, setOtherHostelDataCount] = useState([]);
  const {setHostelDataContest} = useContext(DataContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await authenticatedFetch(
          Url + `/hostel?user_id=${userLoginData.user_id}`,
        );

        if (!response1.ok) {
          throw new Error('Network response was not ok');
        }

        const data1 = await response1.json();
        setHostelData(data1.Hostel);
        setHostelDataCount(data1.outing_type_counts);

        const response2 = await authenticatedFetch(
          Url + `/hostelDetails?user_id=${userLoginData.user_id}`,
        );

        if (!response2.ok) {
          throw new Error('Network response was not ok');
        }

        const data2 = await response2.json();
        setOtherHostelData(data2);
        setOtherHostelDataCount(data2.length > 0 ? data2[0].hostel_name : []);

        setHostelDataContest(data1.Hostel);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching hostel data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Array.isArray(otherHostelData) && otherHostelData.length > 0 && (
        <View style={styles.scheduleDetails}>
          <Text style={styles.sectionHeader}>Hostel</Text>
          {/* <TouchableOpacity
            style={styles.viewAllContainer}
            onPress={() => navigation.navigate('HostelCard')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity> */}
        </View>
      )}
      {Array.isArray(otherHostelData) &&
        otherHostelData.map((data, index) => (
          <View style={styles.BoysHostelcontainer} key={index}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={styles.sectionHeader}>{data.hostel_name}</Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.Room_NO,
                    {textAlign: 'right', paddingRight: responsiveWidth(5)},
                  ]}>
                  Room No:{' '}
                  <Text style={{color: Colors.Grey3F}}> {data.room_no}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.boysHostelCards}>
              {Object.entries(hostelDataCount).map(([type, count], index) => (
                <View key={index} style={styles.cardBoysHostel}>
                  <Text style={styles.textBoysCount}>{count}</Text>
                  <Text style={styles.textBoys}>{type}</Text>
                </View>
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: responsiveHeight(2),
              }}
            />
          </View>
        ))}
    </View>
  );
};
export default DashboardHostel;

const styles = StyleSheet.create({
  BoysHostelcontainer: {
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveWidth(5),
    backgroundColor: 'white',
    elevation: 5,
    margin: 10,
    marginBottom: responsiveHeight(4),
    width: responsiveWidth(92),
  },
  sectionHeader: {
    fontSize: responsiveFontSize(2.3),
    color: Colors.Grey4F,
    paddingLeft: responsiveWidth(5),
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  Room_NO: {
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(1.8),
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  boysHostelCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3),
  },
  cardBoysHostel: {
    backgroundColor: Colors.LitPinkF,
    borderRadius: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.8),
    width: '28%',
    // elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: responsiveWidth(2), // Adjust horizontal margin only
  },
  textBoys: {
    color: Colors.Grey4F,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '800',
  },
  textBoysCount: {
    color: Colors.RedColorDark,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(3.5),
  },
  Floor: {
    fontStyle: 'italic',
    color: Colors.Grey2F,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: Colors.RedDarkF,
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: responsiveWidth(95),
  },
});
