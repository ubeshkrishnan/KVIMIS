import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { DataContext } from '../../context/DataContext';
import Colors from '../../Color';
import { Url } from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import { globalStyles } from '../../GlobalStyles';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Octicons from 'react-native-vector-icons/Octicons';

const FutureCourseCard = ({ sub }) => {
  return (
    <View style={styles.card}>
      <View style={styles.HeaderCard}>
        <Text style={styles.courseName}>
          Course Code : <Text style={{ fontStyle: 'italic' }}>{sub.code} </Text>{' '}
        </Text>
        <Text style={styles.cardSem}>Sem: {sub.semester_no}</Text>
      </View>
      <Text style={styles.cardSubject}>Subject: {sub.course_name}</Text>
      <Text style={styles.cardTextFaculty}>Faculty :</Text>
      <Text style={{ color: 'black', fontWeight: '700', fontSize: 16 }}>
        {sub.prof_name}
      </Text>
      <Text style={styles.courseCredit}>
        Credit : <Text style={{ fontStyle: 'italic' }}>{sub.num_credits} </Text>{' '}
      </Text>
    </View>
  );
};

const Future = () => {
  const { userLoginData } = useContext(DataContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // console.log('USER', userLoginData);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await authenticatedFetch(
          Url +
          `/future_course?user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&degree_branch_id=${userLoginData.degree_branch_id}&semester_no=${userLoginData.current_semester}`,
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="medium" color={Colors.RedColorDark} />
        <Text style={{ color: Colors.Grey4F }}>Loading</Text>
      </View>
    );
  }

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
          {data.map((sub, index) => (
            <FutureCourseCard key={index} sub={sub} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  cardContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  HeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    marginTop: 13,
    elevation: 5,
  },
  cardText: {
    fontSize: 17,
    marginBottom: 5,
    color: 'black',
  },
  courseName: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.Grey3F,
    fontWeight: '600',
  },
  cardSem: {
    color: Colors.RedColorDark,
    fontWeight: '600',
    fontSize: 14,
  },
  cardSubject: {
    color: Colors.blackF,
    fontWeight: '600',
    fontSize: 20,
  },
  cardTextFaculty: {
    color: Colors.RedColorDark,
    fontWeight: '800',
    fontSize: 15,
  },
  courseCredit: {
    color: Colors.Grey3F,
    fontSize: 15,
    fontWeight: '800',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Future;
