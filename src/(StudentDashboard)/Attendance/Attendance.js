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
import {ProgressBar} from 'react-native-paper';
import Colors from '../../Color';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DataContext} from '../../context/DataContext';

const SubjectCard = ({
  subjectCode,
  subjectName,
  profName,
  totalClasses,
  attendancePercentage,
  presentPercentage,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <View style={styles.circleContainer}>
          <View style={[styles.circle, {borderColor: Colors.RedColorDark}]}>
            <Text style={styles.circleText}>{presentPercentage + '%'}</Text>
          </View>
          <View>
            <Text style={styles.totalClasses}>
              Total Classes :{' '}
              <Text style={{color: Colors.RedColorDark}}>{totalClasses}</Text>
            </Text>
            <Text style={styles.totalClasses}>
              Attended :{' '}
              <Text style={{color: Colors.RedColorDark}}>
                {attendancePercentage}
              </Text>
            </Text>
          </View>
        </View>
        <Text style={styles.VerticalLine} />
        <View style={styles.detailsLeft}>
          <Text style={styles.subjectCode}>Course Code: {subjectCode}</Text>
          <Text style={styles.subjectName}>{subjectName}</Text>
          <Text style={styles.horizontalLine} />
          <Text style={styles.profLabel}>Professor:</Text>
          <Text style={styles.profName}>{profName}</Text>
        </View>
      </View>
    </View>
  );
};

const Attendance = () => {
  const {userLoginData} = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [averagePercentage, setAveragePercentage] = useState(0);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;
        const response = await authenticatedFetch(
          `${Url}/attendance?user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&semester=${userLoginData.current_semester}&degree_branch_id=${userLoginData.degree_branch_id}&date=${currentDate}`
        );
        // console.log('attendance url: ', `${Url}/attendance?user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&semester=${userLoginData.current_semester}&degree_branch_id=${userLoginData.degree_branch_id}&date=${currentDate}`)
        // console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        setSubjects(data.final || []); // Set subjects data from 'final' property of the response
        setAveragePercentage(data.result.present_percentage); // Set average percentage from the result object
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [userLoginData]);

  return (
    <ScrollView>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="medium" color={Colors.RedColorDark} />
          <Text style={{color: Colors.Grey4F}}>Loading</Text>
        </View>
      ) : (
        <>
          <View style={styles.shiftCard}>
            <Text style={styles.averageText}>Average Attendance</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: 'black'}}>0</Text>
                <Text style={{color: 'black'}}>100</Text>
              </View>
              <View style={styles.PresentageProgressBar}>
                <ProgressBar
                  progress={averagePercentage / 100} // Convert to progress value between 0 and 1
                  color={Colors.RedColorDark}
                  style={styles.progressBar}
                  contentStyle={{color: Colors.Grey4F}}
                />
                <View style={styles.progressBarInner}>
                  <Text style={styles.percentageText}>
                    {averagePercentage}%
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.improvementContainer}>
              <MaterialCommunityIcons
                name="thumb-up"
                size={responsiveWidth(6)}
                color={Colors.RedColorDark}
                style={styles.thumbIcon}
              />
              <Text style={styles.improvingText}>You are Improving</Text>
            </View>
          </View>
          <View>
            {subjects.map((subject, index) => (
              <SubjectCard
                key={index}
                subjectCode={subject.code}
                subjectName={subject.course_name}
                profName={subject.prof_name}
                totalClasses={subject.tot_hour}
                attendancePercentage={subject.attend_hours}
                presentPercentage={subject.present_percentage || 0}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Grey4F,
    height: '5%',
  },
  card: {
    backgroundColor: Colors.WhiteF,
    padding: responsiveWidth(2), // 2% of total screen width
    borderRadius: responsiveWidth(3), // 3% of total screen width
    elevation: 5,
    margin: responsiveWidth(3), // 2% of total screen width
    marginTop: responsiveWidth(0), // 2% of total screen width
    height: 'auto',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsLeft: {
    flex: 1,
    padding: 5,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  circle: {
    height: responsiveWidth(20), // 20% of total screen width
    width: responsiveWidth(20), // 20% of total screen width
    borderRadius: responsiveWidth(15), // 15% of total screen width
    borderWidth: responsiveWidth(1.5), // Increase the thickness to 0.6% of total screen width
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleText: {
    fontSize: responsiveFontSize(2.2), // 2.2% of total screen width
    fontWeight: 'bold',
    color: Colors.RedColorDark,
  },
  totalClasses: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(1.8), // 1.8% of total screen width
    fontWeight: '600',
    marginTop: responsiveHeight(0.5), // 0.5% of total screen height
  },
  shiftCard: {
    backgroundColor: Colors.WhiteF,
    paddingVertical: responsiveHeight(1), // 3% of total screen height
    paddingHorizontal: responsiveWidth(3), // 5% of total screen width
    marginHorizontal: responsiveWidth(3), // 2% of total screen width
    borderRadius: responsiveWidth(5), // 10% of total screen width
    marginTop: responsiveHeight(2), // 6% of total screen height
    elevation: 3,
    marginBottom: responsiveHeight(2),
  },
  averageText: {
    fontSize: responsiveFontSize(2.3), // 2.5% of total screen width
    fontWeight: 'bold',
    color: 'black',
    marginBottom: responsiveHeight(2), // 2% of total screen height
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(10), // Adjust this value as needed
  },
  progressBar: {
    height: responsiveHeight(5), // Adjust as needed
    backgroundColor: Colors.Grey2F,
    borderRadius: responsiveWidth(1.5), // Adjust as needed
  },

  progressBarInner: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    color: Colors.WhiteF,
    fontSize: responsiveFontSize(2), // Adjust as needed
    fontWeight: '800',
    marginTop: 5,
  },
  improvingText: {
    color: Colors.RedColorDark,
    fontWeight: '800',
    fontSize: responsiveFontSize(2), // 2% of total screen width
    textAlign: 'center',
    margin: 5,
  },
  improvementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(2), // 2% of total screen height
  },
  VerticalLine: {
    width: 1,
    height: '100%', // Adjust the height of the line
    backgroundColor: Colors.blackF,
    marginHorizontal: responsiveWidth(0.8), // 1% of total screen width
    color: Colors.RedDarkF,
  },
  horizontalLine: {
    width: '100%',
    height: 1, // Adjust the height of the line
    color: Colors.RedDarkF,
    borderColor: Colors.borderF,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 5,
  },
  //
  subjectCode: {
    fontSize: responsiveFontSize(1.8), // 1.8% of total screen width
    fontWeight: '600',
    fontStyle: 'italic',
    color: Colors.Grey4F,
  },
  subjectName: {
    marginVertical: responsiveHeight(0.3), // 0.5% of total screen height
    marginHorizontal: responsiveWidth(0), // 1% of total screen width
    color: Colors.blackF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2), // 1.8% of total screen width
  },
  subjectTotalClass: {
    fontSize: responsiveFontSize(1.8),
    marginVertical: responsiveHeight(0.5),
    color: 'black',
  },
  subjectAttendClass: {
    fontSize: responsiveFontSize(1.8),
    marginVertical: responsiveHeight(0.5),
    color: Colors.LighBlueColor,
    fontWeight: '800',
  },
  subjectAttendancePercentage: {
    color: Colors.LighBlueColor,
    fontWeight: '800',
  },
  profName: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(1.8), // 1.7% of total screen width
    fontWeight: '800',
  },
  profLabel: {
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(1.8), // 1.7% of total screen width
    fontWeight: '800',
    marginTop: 5,
  },
  profValue: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(1.7), // 1.7% of total screen width
    fontWeight: '800',
  },
});

export default Attendance;
