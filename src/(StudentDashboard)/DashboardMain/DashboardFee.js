import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Colors from '../../Color';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';

const DashboardFee = () => {
  const {userLoginData} = useContext(DataContext);
  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch(
          Url + `/fee_details?student_id=${userLoginData.student_id}`,
        );
        if (!response.ok) {
          throw new Error('Network response for total paid fee was not ok');
        }
        const data = await response.json();
        console.log('Received paid data:', data);
        setData(data);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading state or error state if data is missing
  if (isLoading || !data) {
    return (
      <View style={{marginTop: 0}}>
        <Text style={styles.averageAttendance}>Fees Information</Text>
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }]}>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.RedColorDark} />
          ) : (
            <Text style={{ fontWeight: 'bold', color: Colors.Grey4F }}>No fee data available</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={{marginTop: 0}}>
        <Text style={styles.averageAttendance}>Fees Information</Text>
        {/* <View style={styles.GreyBg}> */}
        <View>
          <View style={styles.container}>
            <View style={styles.feeHead} />
            <View style={styles.paymentStatus}>
              <View
                style={[
                  styles.paymentStatusCircle,
                  {
                    width: responsiveWidth(20),
                    height: responsiveWidth(20),
                    borderRadius: responsiveWidth(10),
                    borderWidth: responsiveWidth(3),
                    borderColor: Colors.sandalF, // Outer color
                    backgroundColor: Colors.WhiteF, // Inner color
                  },
                ]}>
                <View style={styles.innerCircle}>
                  <Text style={styles.paymentStatusCircleText}>
                    {data.percentage_paid}%
                  </Text>
                </View>
              </View>
              <Text style={styles.verticalLinePaid}>|</Text>
              <View style={styles.feeDetails}>
                <Text style={styles.feePaid}>Fee Paid</Text>
                <Text style={styles.amount}>{data.paid}</Text>
              </View>
              <Text style={styles.verticalLineDue}>|</Text>
              <View style={styles.feeDetails}>
                <Text style={styles.feeDue}>Fee Due</Text>
                <Text style={styles.amountDue}>{data.due}</Text>
              </View>
            </View>
          </View>
          {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 5,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  fontWeight: '900',
                  paddingLeft: 10,
                }}>
                Last Date for payment
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons
                  name="calendar-text"
                  size={responsiveFontSize(2)}
                  color={Colors.RedColorDark}
                  style={{marginRight: 5}}
                />
                <Text style={styles.lastPaymentDate}>
                  <Text
                    style={{
                      backgroundColor: 'yellow',
                    }}>
                    {data.last_fee_date}
                  </Text>
                </Text>
              </View>
            </View> */}
        </View>
        {/* </View> */}
      </View>
    </View>
  );
};

export default DashboardFee;

const styles = StyleSheet.create({
  container: {
    padding: responsiveWidth(4),
    borderRadius: responsiveWidth(5),
    backgroundColor: 'white',
    margin: responsiveWidth(1),
    elevation: 5,
    width:responsiveWidth(92)
  },
  GreyBg: {
    backgroundColor: '#EEEEEE',
    borderRadius: responsiveWidth(5),
    marginHorizontal: responsiveWidth(2), // Adjust horizontal margin only
    paddingBottom: responsiveWidth(2), // Maintain height of the top part
    // marginBottom: responsiveWidth(6), // Increase height only at the bottom
    // borderTopWidth: 1, // Add a transparent border at the top
    elevation: 5,
  },

  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  paymentStatusCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentStatusCircleText: {
    fontWeight: '800',
    fontSize: responsiveFontSize(2.0),
    color: Colors.blackF,
  },
  verticalLinePaid: {
    fontSize: responsiveFontSize(2.0), // Adjust as needed
    color: Colors.RedDarkF, // Example color, replace with your desired color
    borderLeftWidth: responsiveWidth(1), // Thickness of the line, adjust as needed
    borderLeftColor: Colors.RedDarkF, // Border color, replace with your desired color
    marginLeft: responsiveHeight(3), // Adjust margin as needed
    height: responsiveHeight(5),
  },
  verticalLineDue: {
    fontSize: responsiveFontSize(2.0), // Adjust as needed
    color: Colors.sandalF, // Example color, replace with your desired color
    borderLeftWidth: responsiveWidth(1), // Thickness of the line, adjust as needed
    borderLeftColor: Colors.sandalF, // Border color, replace with your desired color
    marginLeft: responsiveHeight(3), // Adjust margin as needed
    height: responsiveHeight(5),
  },
  feeDetails: {
    marginLeft: responsiveWidth(2),
  },
  feePaid: {
    fontWeight: '800',
    fontSize: responsiveFontSize(2.0),
    color: Colors.Grey4F,
  },
  feeDue: {
    fontWeight: '800',
    color: Colors.Grey4F,
    fontSize: responsiveFontSize(2.0),
  },
  amount: {
    fontWeight: '800',
    fontSize: responsiveFontSize(2.3),
    color: Colors.RedColorDark,
  },
  amountDue: {
    fontWeight: '800',
    fontSize: responsiveFontSize(2.3),
    color: Colors.sandalF,
  },
  lastPaymentHead: {
    backgroundColor: Colors.Grey2F,
    // borderRadius: responsiveWidth(1),
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'row',
    paddingLeft: responsiveWidth(4),
    padding: 10,
  },
  lastPaymentDateLabel: {
    fontWeight: '800',
    fontSize: responsiveFontSize(1.8),
    color: Colors.blackF,
  },
  lastPaymentDate: {
    fontWeight: '900',
    fontSize: responsiveFontSize(1.8),
    color: Colors.RedColorDark,
  },
  averageAttendance: {
    marginBottom: responsiveHeight(0),
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
    marginVertical: 6,
    color: Colors.blackF,
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(1),
  },
});
