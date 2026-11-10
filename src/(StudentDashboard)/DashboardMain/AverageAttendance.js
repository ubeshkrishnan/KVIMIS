import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../Color';
import { DataContext } from '../../context/DataContext';
import { Url } from '../../../Global_Variable/api_link';
import { authenticatedFetch, logError } from '../../../Global_Variable/api_helper';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const AverageAttendance = () => {
  const customIconSize = 24;
  const { userLoginData } = useContext(DataContext);
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userLoginData?.user_id) return;
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        const response = await authenticatedFetch(
          Url + `/attendance?user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&semester=${userLoginData.current_semester}&degree_branch_id=${userLoginData.degree_branch_id}&date=${currentDate}`,
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        logError('AverageAttendance', error);
      }
    };

    fetchData();
  }, [userLoginData]);

  const presentPercentage = Number(attendanceData?.result?.present_percentage) || 0;
  const absentPercentage = Number(attendanceData?.result?.absent_percentage) || 0;
  const odPercentage = Number(attendanceData?.result?.od_percentage) || 0;

  return (
    <View>
      <Text style={styles.title}>Overall Attendance</Text>

      {attendanceData && (
        <View style={styles.container}>
          <View>
            <View style={styles.rangeRow}>
              <Text style={styles.rangeText}>0</Text>
              <Text style={styles.rangeText}>100</Text>
            </View>

            <View style={styles.progressBarWrapper}>
              <ProgressBar
                progress={presentPercentage / 100}
                color={Colors.RedDarkF}
                style={styles.progressBar}
              />
              <View style={styles.progressBarInner}>
                <Text style={styles.percentageText}>
                  {presentPercentage.toFixed(1)}%
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

      <View style={styles.cardContainer}>
        <View style={styles.circleCard}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Present</Text>
            <View style={styles.circle}>
              <Text style={styles.circleText}>
                {attendanceData?.result ? `${presentPercentage}%` : '-'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.circleCard}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Absent</Text>
            <View style={styles.circleAbsent}>
              <Text style={styles.circleText}>
                {attendanceData?.result ? `${absentPercentage}%` : '-'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.circleCard}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>OD</Text>
            <View style={styles.circleAbsent}>
              <Text style={styles.circleText}>
                {attendanceData?.result ? `${odPercentage}%` : '-'}
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
    marginBottom: responsiveHeight(1),
    width: responsiveWidth(92),
    marginLeft: 8,
  },
  title: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
    marginVertical: 6,
    color: Colors.blackF,
    paddingHorizontal: responsiveWidth(5),
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    color: Colors.blackF || 'black',
  },
  progressBarWrapper: {
    width: '100%',
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
    fontSize: responsiveFontSize(2.0),
    fontWeight: '800',
    marginTop: 5,
    color: Colors.WhiteF,
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
    fontSize: responsiveFontSize(2.0),
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1),
    width: responsiveWidth(80),
    marginLeft: 10,
  },
  circleCard: {
    backgroundColor: Colors.WhiteF || 'white',
    borderRadius: responsiveWidth(10),
    elevation: 3,
    justifyContent: 'center',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    marginRight: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: Colors.blackF || 'black',
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
    color: Colors.WhiteF || 'white',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});

export default AverageAttendance;
