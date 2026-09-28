import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Color';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import {DataContext} from '../../context/DataContext';

const Results = () => {
  const {userLoginData} = useContext(DataContext);
  // console.log("USR",userLoginData)
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch(
          `${Url}/e_result?register_number=${userLoginData.register_number}`,
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log('STDD', data);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.RedColorDark} />
      ) : (
        <View style={styles.container}>
          <View>
            <View style={styles.whiteCard}>
              <Text style={styles.cardText}>
                End Semester Examination Nov/Dec 2023
              </Text>
              <View style={styles.HorizontalLine} />

              <View style={styles.row}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>AKASH</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Register No</Text>
                <Text style={styles.value}>
                  {userLoginData.register_number}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>DOB</Text>
                <Text style={styles.value}>{userLoginData.dob}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Regulation</Text>
                <Text style={styles.value}>-adadasdsa</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Batch</Text>
                <Text style={styles.value}>-adadasdsa</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Branch</Text>
                <Text style={styles.value}>-adadasdsa</Text>
              </View>
            </View>
          </View>
          {data.map((item, index) => (
            <View key={index} style={styles.subjectCard}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.subjectCourseCode}>Course Code :</Text>
                <Text style={styles.subjectCourseCodeValue}>
                  {item.course_code}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.subjectName}>{item.course_name}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.semValue}>Sem : </Text>
                <Text style={styles.gradeValue}>{item.exam_sem_no}</Text>

                <View style={styles.VerticalLine} />
                <Text style={styles.Grade}>Grade : </Text>
                <Text style={styles.gradeValue}>{item.lg}</Text>
              </View>
              <Text style={styles.CreditValue}>Credit - {item.credits}</Text>
              <Text style={styles.PassMonth}>
                Pass Month - {item.pass_month || null}
              </Text>
              <View style={styles.circleContainer}>
                <View style={styles.circle}>
                  <Text
                    style={[
                      styles.circleText,
                      {
                        backgroundColor:
                          item.status === 'Pass' ? 'green' : 'green',
                        width: 70,
                        height: 70,
                        borderRadius: 37,
                        textAlign: 'center', // Center the text horizontally
                        lineHeight: 65, // Center the text
                        fontWeight: '500',
                        fontSize: 18,
                      },
                    ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '15%',
    alignItems: 'center',
    backgroundColor: Colors.RedDarkF,
  },

  whiteCard: {
    width: responsiveWidth(95),
    height: responsiveHeight(35),
    backgroundColor: Colors.WhiteColor,
    borderRadius: 10,
    padding: responsiveWidth(4),
    marginTop: 20,
    elevation: 5,
  },
  HorizontalLine: {
    height: 2,
    backgroundColor: Colors.Grey2F,
    marginVertical: responsiveWidth(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    marginRight: 8,
    fontSize: 17,
  },
  value: {
    flex: 1,
    color: 'black',
    fontSize: 16,
  },

  cardText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: Colors.blackF,
    paddingBottom: responsiveWidth(2),
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically
    marginBottom: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2), // Add horizontal padding
  },
  cardLabel: {
    flexDirection: 'column',
    fontWeight: 'bold',
    color: Colors.blackF,
    paddingBottom: responsiveWidth(1),
    fontSize: responsiveFontSize(1.8),
  },
  cardValue: {
    flexDirection: 'column',
    color: Colors.blackF,
    textAlign: 'right', // Align text to the right
    paddingBottom: responsiveWidth(1),
    fontSize: responsiveFontSize(1.8),
  },

  subjectCard: {
    marginTop: responsiveWidth(4),
    backgroundColor: Colors.WhiteF,
    height: 'auto', // Remove fixed height
    width: responsiveWidth(95), // Use percentage width
    padding: responsiveWidth(3), // Adjust padding as needed
    elevation: 5,
    borderRadius: 10,
    marginBottom: responsiveWidth(4), // Adjust margin as needed
  },

  subjectCourseCode: {
    color: Colors.Grey3F,
    padding: 6,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  subjectCourseCodeValue: {
    color: Colors.Grey3F,
    padding: 5,
    fontSize: responsiveFontSize(2),
  },
  subjectDetails: {
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(2),
  },
  subjectName: {
    color: Colors.blackF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.2),
    width: '80%',
  },
  SEM: {
    fontSize: responsiveFontSize(2),
    color: Colors.RedColorDark,
  },
  semValue: {
    color: Colors.RedColorDark,
    // fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  VerticalLine: {
    width: 2,
    height: '50%', // Adjust the height of the line
    backgroundColor: Colors.blackF,
    marginHorizontal: 8,
  },
  Grade: {
    fontSize: responsiveFontSize(2),
    color: Colors.RedColorDark,
  },
  gradeValue: {
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(2),

    fontWeight: 'bold',
  },
  circleContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // to make sure it's on top of other content
    padding: 10,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white', // Change color as needed
    fontSize: 16, // Change size as needed
  },
  CreditValue: {
    color: Colors.Grey3F,
    fontSize: 17, // Change size as needed

    fontWeight: '800',
  },
  PassMonth: {
    color: Colors.sandalF,
    fontSize: 17, // Change size as needed
    fontWeight: 'bold',
  },
});

export default Results;
