import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../Color';
import { DataContext } from '../../context/DataContext';
import { Url } from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const AverageAttendance = () => {
  const customIconSize = 24;
  const { userLoginData } = useContext(DataContext);
  // const currentDate = new Date();
  // Get the current year
  // const currentYear = currentDate.getFullYear();

  // Get the current month (0-indexed, so January is 0)
  // const currentMonth = currentDate.getMonth();

  // Get the number of days in the current month
  // const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create a new date for the start of the month
  // const startDate = new Date(currentYear, currentMonth, 1);

  // Create a new date for the end of the month
  // const endDate = new Date(currentYear, currentMonth, daysInMonth);

  // Format the start date and end date as required
  // const formattedStartDate = startDate.toLocaleDateString('en-US', {
  //   // year: 'numeric',
  //   month: 'short',
  // });
  // const formattedEndDate = endDate.toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'short',
  //   day: 'numeric',
  // });

  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(
        //   Url + `/pre_ab_count?student_id=${userLoginData.student_id}&batch_id=${userLoginData.batch_id}&degree_branch_id=${userLoginData.degree_branch_id}&semester=${userLoginData.current_semester}`,
        // );
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        const response = await authenticatedFetch(
          Url + `/attendance?user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&semester=${userLoginData.current_semester}&degree_branch_id=${userLoginData.degree_branch_id}&date=${currentDate}`,
        );
        // console.log("ATT", response)

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log("ATTdfsdfs",data)
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text style={styles.title}>Overall Attendance</Text>

      {attendanceData && (
        <View style={styles.container}>
          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: 'black' }}>0</Text>
              <Text style={{ color: 'black' }}>100</Text>
            </View>

            <View style={{ width: '100%' }}>
              <ProgressBar
                progress={attendanceData.result.present_percentage / 100}
                color={Colors.RedDarkF}
                style={styles.progressBar}
              />
              <View style={styles.progressBarInner}>
                <Text style={styles.percentageText}>
                  {attendanceData?.result?.present_percentage?.toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.improvementContainer}>
              <MaterialCommunityIcons
                name="thumb-up"
                size={customIconSize}
                color={Colors.RedDarkF}
                style={styles.icon}
              />
              <Text style={styles.improvingText}>You are Improving</Text>
            </View>
          </View>
        </View>
      )}
      {/* <View style={styles.attendanceInfoContainer}>
        <Text style={styles.attendanceInfoText}>
          This Month :
          <Text style={{color: Colors.RedColorDark, fontSize: 18}}>
            {formattedStartDate} ({daysInMonth} Days)
          </Text>
        </Text>
      </View> */}
      <View style={styles.cardContainer}>
        <View style={styles.circleCard}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Present</Text>
            <View style={styles.circle}>
              <Text style={styles.circleText}>
                {attendanceData?.result?.present_percentage + '%' || ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.circleCard}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Absent</Text>
            <View style={styles.circleAbsent}>
              <Text style={styles.circleText}>
                {attendanceData?.result?.absent_percentage + '%' || ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.circleCard}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>OD</Text>
            <View style={styles.circleAbsent}>
              <Text style={styles.circleText}>
                {attendanceData?.result?.od_percentage + '%' || ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WhiteF,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(5),
    margin: responsiveWidth(2),
    elevation: 5,
    marginBottom: responsiveHeight(4),
    width: responsiveWidth(92),
    marginLeft: 8,
  },
  title: {
    marginBottom: responsiveHeight(0),
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginVertical: 6,
    color: Colors.blackF,
    paddingHorizontal: responsiveWidth(2),
  },
  PresentageProgressBar: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  progressBar: {
    height: responsiveHeight(4),
    backgroundColor: Colors.Grey2F,
    borderRadius: responsiveWidth(1.5),
  },

  progressBarInner: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    marginTop: 5,
    color: Colors.WhiteF,
  },
  progressBarContent: {
    color: Colors.Grey4F,
  },
  improvementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: responsiveWidth(5),
  },
  improvingText: {
    color: Colors.RedDarkF,
    fontWeight: '800',
    marginTop: 8,
    fontSize: responsiveFontSize(1.8),
  },
  attendanceInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: responsiveHeight(2),
  },
  attendanceInfoText: {
    color: Colors.blackF,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: responsiveHeight(1),
    fontSize: responsiveFontSize(1.8),
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(0),
    marginBottom: responsiveHeight(4),
    width: responsiveWidth(80),
    marginLeft: 10,
  },
  circleCard: {
    backgroundColor: 'white',
    borderRadius: responsiveWidth(10),

    elevation: 3,
    justifyContent: 'center',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    marginRight: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: responsiveWidth(10),
    width: '32%',
    elevation: 3,
    justifyContent: 'center',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: 'black',
    marginRight: responsiveWidth(1),
  },
  circle: {
    width: responsiveWidth(13),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(6),
    backgroundColor: Colors.RedDarkF,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleAbsent: {
    width: responsiveWidth(13),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(8),
    backgroundColor: Colors.sandalF,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white',
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
  },
});

export default AverageAttendance;
