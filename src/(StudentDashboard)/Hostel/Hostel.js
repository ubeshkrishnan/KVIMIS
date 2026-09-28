import React, {useContext} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../Color';
import {DataContext} from '../../context/DataContext';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Octicons from 'react-native-vector-icons/Octicons';

import {globalStyles} from '../../GlobalStyles';

const HostelCard = () => {
  const {hostelContestData} = useContext(DataContext);

  if (!hostelContestData) {
    return (
      <View style={globalStyles.noDataContainer}>
        <Octicons name="alert" size={21} color={Colors.sandalF} />
        <Text style={globalStyles.noDataText}>NO DATA AVAILABLE</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.whiteCard}>
          <Text style={styles.cardText}>Outing History</Text>
        </View>
        <View style={styles.additionalCardContainer}>
          {hostelContestData.map((hostel, index) => (
            <View style={styles.card} key={index}>
              <View style={styles.row}>
                <Text style={styles.label}>Outing Request ID:</Text>
                <Text style={styles.value}>{hostel.outingRequestid}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Requested Date:</Text>
                <Text style={styles.value}>{hostel.dateReq}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Outing Time:</Text>
                <Text style={styles.value}>{hostel.outingTime}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Return Time:</Text>
                <Text style={styles.value}>{hostel.rtrnTime}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Outing Type:</Text>
                <Text style={styles.value}>{hostel.outing_type}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Reason:</Text>
                <Text style={styles.OutingResonValue}>{hostel.reason}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '1.5%',
    backgroundColor: Colors.RedColorDark,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  whiteCard: {
    // width: '90%',
    height: responsiveHeight(8),
    marginTop: '2%',
    margin: 10,
    backgroundColor: Colors.WhiteColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  cardText: {
    color: Colors.blackF,
    fontSize: 18,
    fontWeight: '800',
  },
  additionalCardContainer: {
    padding: 15,
    marginBottom: responsiveHeight(10),
  },
  errorText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: responsiveHeight(1),
  },
  label: {
    fontWeight: 'bold',
    marginRight: responsiveWidth(2),
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(2),
  },
  value: {
    flex: 1,
    color: Colors.blackF,
    fontSize: responsiveFontSize(2),
  },
  OutingResonValue: {
    // flex: 1,
    color: Colors.blackF,
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    width: '80%',
  },
  noDataText: {
    fontSize: responsiveFontSize(2),
    color: Colors.blackF,
    textAlign: 'center',
    marginTop: responsiveHeight(2),
  },
});

export default HostelCard;
