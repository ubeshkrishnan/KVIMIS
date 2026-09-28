import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../GlobalStyles';
import Colors from '../../Color';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import Octicons from 'react-native-vector-icons/Octicons';

const CourseCard = ({course}) => {
  const renderCircle = (value, backgroundColor) => (
    <View
      style={[
        styles.circle,
        {backgroundColor: backgroundColor || Colors.RedColorDark},
      ]}>
      <Text style={styles.circleText}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          Course Code:
          <Text style={{fontStyle: 'italic'}}> {course.code}</Text>
        </Text>
        <Text style={styles.CardSem}>Sem: {course.sem_no}</Text>
      </View>
      <Text style={styles.courseName}>{course.course_name}</Text>
      <View style={styles.row}>
        <CourseDetail label="Int.Mark " value={course.internal_mark} />
        <View style={styles.divider} />
        <CourseDetail label="Ext. Mark" value={course.external_mark} />
        <View style={styles.divider} />
        <CourseDetail label="Total" value={course.total_mark} />
      </View>
      <View style={styles.row}>
        <View style={[styles.cardGrade, { flex: 0.7 }]}>
          <Text style={styles.gradeLabel}>Result:</Text>
          {renderCircle(course.result, course.result === 'P' ? 'green' : 'red')}
        </View>
        <View style={[styles.cardGrade, { flex: 0.7 }]}>
          <Text style={styles.gradeLabel}>Grade:</Text>
          {renderCircle(course.lg, Colors.sandalF)}
        </View>
        <View style={[styles.cardGrade, { flex: 1.2 }]}>
          <Text style={styles.gradeLabel}>Month:</Text>
          <Text style={styles.gradeValueText}>{`${course.pass_month} / ${course.pass_year}`}</Text>
        </View>
      </View>
      <Text style={styles.creditText}>
        Credit: <Text style={styles.creditData}>{course.num_credits}</Text>
      </Text>
    </View>
  );
};

const CourseDetail = ({label, value}) => {
  return (
    <View style={styles.detailContainer}>
      <Text style={styles.cardText}>{label}: </Text>
      <Text style={styles.cardText}>{value}</Text>
    </View>
  );
};

const Complete = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {userLoginData} = useContext(DataContext);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await authenticatedFetch(
          Url +
            `/course_complete?user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&degree_branch_id=${userLoginData.degree_branch_id}`,
        );
        // console.log(response);

        const data = await response.json();
        setIsLoading(false);
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [userLoginData]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="medium" color={Colors.RedColorDark} />
          <Text style={{color: Colors.Grey4F}}>Loading</Text>
        </View>
      ) : data.length === 0 ? (
        <View style={globalStyles.noDataContainer}>
          <Octicons name="alert" size={21} color={Colors.sandalF} />
          <Text style={globalStyles.noDataText}>NO DATA AVAILABLE</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {data.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};
const cardMargin = responsiveWidth(1);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(2),
    backgroundColor: Colors.Grey1F,
  },
  scrollContainer: {
    paddingHorizontal: responsiveWidth(1),
    paddingBottom: responsiveHeight(2),
  },
  card: {
    backgroundColor: Colors.WhiteF,
    padding: responsiveWidth(3),
    marginTop: responsiveHeight(1.5),
    marginBottom: cardMargin,
    borderRadius: responsiveWidth(6),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1),
  },
  cardTitle: {
    fontSize: 15,
    color: Colors.Grey3F,
    fontWeight: '600',
  },
  courseName: {
    fontSize: responsiveFontSize(2.2),
    marginBottom: responsiveHeight(0.5),
    color: Colors.blackF,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    marginBottom: responsiveHeight(0.8),
    alignItems: 'center',
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cardText: {
    fontSize: responsiveFontSize(1.6),
    marginBottom: responsiveHeight(0.5),
    color: Colors.RedColorDark,
    fontWeight: '800',
  },
  cardGrade: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.Grey1F,
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(1),
    marginRight: responsiveWidth(1),
    justifyContent: 'center',
    minHeight: responsiveHeight(5),
  },
  gradeLabel: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
    color: 'black',
    marginRight: 4,
  },
  gradeValueText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '700',
    color: Colors.blackF,
  },
  creditText: {
    fontStyle: 'italic',
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
  CardSem: {
    color: Colors.RedColorDark,
    fontWeight: '700',
    fontSize: 14,
  },
  circle: {
    width: 32,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  circleText: {
    color: 'white',
  },
  divider: {
    height: '80%',
    padding: 1,
    backgroundColor: Colors.blackF,
    marginHorizontal: 5,
  },
  creditData: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: Colors.Grey3F,
  },
  noDataText: {
    fontSize: responsiveFontSize(2),
    color: Colors.blackF,
    textAlign: 'center',
    marginTop: responsiveHeight(2),
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Complete;
