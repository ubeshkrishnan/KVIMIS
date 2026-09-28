import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../context/DataContext';
import { Url } from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Octicons from 'react-native-vector-icons/Octicons';
import { globalStyles } from '../../GlobalStyles';

// Calculate Present / Absent status
const getPresentText = is_present => {
  switch (is_present) {
    case '1':
      return 'Present';
    case '0':
      return 'Absent';
    case '2':
      return 'OD';
    default:
      return '';
  }
};

const getPresentColor = is_present => {
  switch (is_present) {
    case '1':
      return Colors.GreenColorF || '#4CAF50';
    case '0':
      return Colors.RedColor || 'red';
    case '2':
      return Colors.BrownColorF || '#8D6E63';
    default:
      return Colors.Grey3F || '#9E9E9E';
  }
};

const TimeTableCardData = ({ date }) => {
  const { userLoginData } = useContext(DataContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let currentDateParam = date !== 'null-null-null' ? date : undefined;
      if (!currentDateParam) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        currentDateParam = `${year}-${month}-${day}`;
      }

      const response = await authenticatedFetch(
        Url +
          `/timetable?batch_id=${userLoginData.batch_id}&degree_branch_id=${userLoginData.degree_branch_id}&section=${userLoginData.section}&current_semester=${userLoginData.current_semester}&student_id=${userLoginData.student_id}&current_date=${currentDateParam}`,
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setData(responseData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      setIsLoading(false);
    }
  };

  const customIconSize = responsiveFontSize(2.2);

  const scheduleList = Array.isArray(data)
    ? data
    : Array.isArray(data?.final)
    ? data.final
    : null;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.RedColorDark} />
          <Text style={styles.loadingText}>Loading Time Table...</Text>
        </View>
      ) : data?.flag === 1 ? (
        <View style={[styles.noDataContainer, styles.shadowProp]}>
          <Image
            style={styles.profilePictureStaff}
            source={require('../../../assets/holiday.png')}
          />
          <Text style={styles.holidayText}>
            {typeof data?.final === 'string' ? data.final : 'Holiday'}
          </Text>
        </View>
      ) : scheduleList && scheduleList.length > 0 ? (
        <View style={styles.listContainer}>
          {scheduleList.map((item, index) => (
            <View key={index} style={styles.cardContainer}>
              <View style={[styles.container, styles.shadowProp]}>
                <View style={styles.infoContainer}>
                  <View style={styles.courseCodeContainer}>
                    <Text style={styles.courseCode}>
                      Course Code:{' '}
                      <Text style={styles.courseData}>{item.code}</Text>
                    </Text>
                    {item.is_present && (
                      <View style={styles.presentContainer}>
                        <Text style={styles.presentSign}>
                          {getPresentText(item.is_present)}
                        </Text>
                        <View
                          style={[
                            styles.greenDot,
                            { backgroundColor: getPresentColor(item.is_present) },
                          ]}
                        />
                      </View>
                    )}
                  </View>
                  <Text style={styles.subject}>{item.course_name}</Text>
                  <View style={styles.timeContainer}>
                    <MaterialCommunityIcons
                      name="clock-time-four-outline"
                      size={customIconSize}
                      color={Colors.RedDarkF}
                    />
                    <Text style={styles.time}>
                      {item.start_time} - {item.end_time}
                    </Text>
                  </View>
                  <View style={styles.horizontalLine} />
                  <View style={styles.staffContainer}>
                    <Image
                      source={require('../../../assets/graduate.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                    <Text style={styles.staffName}>{item.professorName}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={[styles.noDataContainer, styles.shadowProp]}>
          <Octicons name="alert" size={responsiveFontSize(3.5)} color={Colors.sandalF || '#B68F64'} />
          <Text style={styles.noDataText}>NO SCHEDULE AVAILABLE FOR THIS DATE</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: responsiveHeight(4),
    paddingTop: responsiveHeight(1),
  },
  listContainer: {
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: responsiveHeight(0.8),
  },
  container: {
    backgroundColor: Colors.WhiteF,
    width: responsiveWidth(92),
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(4),
  },
  shadowProp: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  infoContainer: {
    width: '100%',
  },
  courseCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.8),
  },
  courseCode: {
    fontWeight: '700',
    fontSize: responsiveFontSize(1.6),
    color: Colors.blackF || '#212121',
  },
  courseData: {
    color: Colors.Grey3F || '#757575',
    fontWeight: '700',
  },
  presentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presentSign: {
    color: Colors.RedDarkF,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.6),
  },
  greenDot: {
    width: responsiveWidth(2.5),
    height: responsiveWidth(2.5),
    borderRadius: responsiveWidth(1.25),
    marginLeft: responsiveWidth(1.5),
  },
  subject: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: Colors.blackF || '#212121',
    marginBottom: responsiveHeight(1),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    color: Colors.RedDarkF,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.7),
  },
  horizontalLine: {
    height: 1,
    borderColor: Colors.borderF || '#E0E0E0',
    borderStyle: 'dashed',
    borderWidth: 1,
    marginVertical: responsiveHeight(1.2),
  },
  staffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffName: {
    color: Colors.blackF || '#212121',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.7),
    marginLeft: responsiveWidth(2),
  },
  logo: {
    height: responsiveHeight(3.5),
    width: responsiveWidth(7),
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(6),
  },
  loadingText: {
    marginTop: responsiveHeight(1),
    color: Colors.Grey4F || '#424242',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
  noDataContainer: {
    backgroundColor: Colors.WhiteF,
    width: responsiveWidth(92),
    alignSelf: 'center',
    borderRadius: responsiveWidth(4),
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(3),
  },
  profilePictureStaff: {
    width: responsiveWidth(26),
    height: responsiveWidth(26),
    resizeMode: 'contain',
    marginBottom: responsiveHeight(1.5),
  },
  holidayText: {
    fontSize: responsiveFontSize(2),
    color: Colors.RedDarkF,
    textAlign: 'center',
    fontWeight: '700',
  },
  noDataText: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.sandalF || '#B68F64',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: responsiveHeight(1),
  },
});

export default TimeTableCardData;
