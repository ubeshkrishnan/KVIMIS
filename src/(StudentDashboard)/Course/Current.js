import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Color';
import { Url } from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import { DataContext } from '../../context/DataContext';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { globalStyles } from '../../GlobalStyles';
import Octicons from 'react-native-vector-icons/Octicons';

const CurrentCourseCard = ({ course }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.courseCode}>
          Course Code:<Text style={{ fontStyle: 'italic' }}> {course.code}</Text>
        </Text>
        <Text style={styles.cardSem}>Sem: {course.semester_no}</Text>
      </View>
      <Text style={styles.courseName}>{course.course_name}</Text>
      
      <View style={styles.facultyRow}>
        <Text style={styles.cardText}>Faculty: </Text>
        <Text style={styles.facultyName} numberOfLines={1} ellipsizeMode="tail">
          {course.prof_name || '-'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.cardText}>
          Internal: <Text style={styles.statValue}>{course.internal_total ? parseFloat(course.internal_total) : '-'}</Text>
        </Text>
        <Text style={styles.cardText}>
          Credit: <Text style={styles.statValue}>{course.num_credits ? parseFloat(course.num_credits).toFixed(2) : '-'}</Text>
        </Text>
      </View>
    </View>
  );
};

const Current = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userLoginData } = useContext(DataContext);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await authenticatedFetch(
          Url +
          `/current_course?user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&semester_no=${userLoginData.current_semester}&degree_branch_id=${userLoginData.degree_branch_id}`,
        );
        // console.log(response)

        const data = await response.json();
        console.log("data : ", data)
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
    <ScrollView>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="medium" color={Colors.RedColorDark} />
          <Text style={{ color: Colors.Grey4F }}>Loading</Text>
        </View>
      ) : data.length === 0 ? (
        <View style={globalStyles.noDataContainer}>
          <Octicons name="alert" size={21} color={Colors.sandalF} />
          <Text style={globalStyles.noDataText}>NO DATA AVAILABLE</Text>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          {data.map((course, index) => (
            <CurrentCourseCard key={index} course={course} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 15,
    // fontWeight: 'bold',
    marginTop: 20,
  },
  cardSem: {
    color: Colors.RedColorDark,
    fontWeight: '700',
    fontSize: responsiveFontSize(2),
  },
  cardCode: {
    color: Colors.RedPure,
    fontWeight: '500',
  },
  cardContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  courseCode: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.LitWhiteF,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 8,
    marginTop: 5,

    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  courseName: {
    fontSize: responsiveFontSize(2.1),
    marginBottom: 8,
    color: 'black',
    fontWeight: '700',
  },
  facultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  facultyName: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.Grey4F,
    fontWeight: '700',
    flex: 1, // Truncate cleanly instead of overlapping
    marginLeft: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  cardText: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.RedColorDark,
    fontWeight: '700',
  },
  statValue: {
    color: Colors.Grey4F,
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
export default Current;
