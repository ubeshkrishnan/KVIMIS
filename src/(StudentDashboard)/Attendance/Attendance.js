import React, { useState, useEffect, useContext } from 'react';
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
import { ProgressBar } from 'react-native-paper';
import Colors from '../../Color';
import { Url } from '../../../Global_Variable/api_link';
import { authenticatedFetch, logError } from '../../../Global_Variable/api_helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { DataContext } from '../../context/DataContext';
import { globalStyles } from '../../GlobalStyles';

const SubjectCard = ({
  subjectCode,
  subjectName,
  profName,
  totalClasses,
  attendancePercentage,
  presentPercentage,
  showAttendance,
}) => {
  const isAttendanceMode = showAttendance === 1;

  return (
    <View style={[styles.card, !isAttendanceMode && styles.cardWithoutAttendance]}>
      {isAttendanceMode ? (
        // Mode 1: With circular percentage and stats (Photo 2)
        <View style={styles.details}>
          <View style={styles.circleContainer}>
            <View
              style={[styles.circle, { borderColor: Colors.RedColorDark }]}
            >
              <Text style={styles.circleText}>{(presentPercentage ?? 0) + '%'}</Text>
            </View>
            <View>
              <Text style={styles.totalClasses}>
                Total Classes :{' '}
                <Text style={{ color: Colors.RedColorDark }}>
                  {totalClasses ?? 0}
                </Text>
              </Text>
              <Text style={styles.totalClasses}>
                Attended :{' '}
                <Text style={{ color: Colors.RedColorDark }}>
                  {attendancePercentage ?? 0}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.VerticalLine} />
          <View style={styles.detailsLeft}>
            <Text style={styles.subjectCode}>Course Code: {subjectCode}</Text>
            <Text style={styles.subjectName}>{subjectName}</Text>
            <View style={styles.horizontalLine} />
            <Text style={styles.profLabel}>Professor:</Text>
            <Text style={styles.profName}>{profName}</Text>
          </View>
        </View>
      ) : (
        // Mode 2: Clean, full-width card when attendance statistics are hidden (Photo 1)
        <View style={styles.fullCardContent}>
          <Text style={styles.subjectCodeFull}>Course Code: {subjectCode}</Text>
          <Text style={styles.subjectNameFull}>{subjectName}</Text>
          <View style={styles.horizontalLineFull} />
          <View style={styles.profRowFull}>
            <Text style={styles.profLabelFull}>Professor:</Text>
            <Text style={styles.profNameFull}>{profName}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const Attendance = () => {
  const { userLoginData } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [averagePercentage, setAveragePercentage] = useState(0);
  const [showAttendance, setShowAttendance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      // Guard against null/undefined userLoginData to avoid crashes
      if (!userLoginData || !userLoginData.student_id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        const response = await authenticatedFetch(
          `${Url}/attendance?user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&semester=${userLoginData.current_semester}&degree_branch_id=${userLoginData.degree_branch_id}&date=${currentDate}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Safely set subject list and average percentage
        setSubjects(Array.isArray(data?.final) ? data.final : []);
        const avg = Number(data?.result?.present_percentage);
        setAveragePercentage(!isNaN(avg) ? avg : 0);

        // Web portal condition:
        // 1 = Show attendance statistics (percentages, classes attended/total, progress bar)
        // 2 = Hide attendance statistics (display only course & professor info)
        const showSetting =
          data?.show_attendance ??
          data?.show_attendance_setting ??
          data?.result?.show_attendance ??
          data?.result?.show_attendance_setting ??
          data?.session_setting;

        const shouldHide =
          showSetting !== undefined &&
          showSetting !== null &&
          (showSetting === 2 ||
            showSetting === '2' ||
            String(showSetting).trim() === '2');

        setShowAttendance(shouldHide ? 2 : 1);
      } catch (err) {
        logError('Attendance', err);
        setError(err.message || 'Failed to fetch attendance data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [userLoginData]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        showAttendance !== 1 && styles.scrollContentNoShift,
      ]}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="medium" color={Colors.RedColorDark} />
          <Text style={styles.loadingText}>Loading</Text>
        </View>
      ) : error ? (
        <View style={globalStyles.noDataContainer}>
          <Octicons name="alert" size={21} color={Colors.sandalF} />
          <Text style={globalStyles.noDataText}>FAILED TO LOAD ATTENDANCE</Text>
        </View>
      ) : subjects.length === 0 ? (
        <View style={globalStyles.noDataContainer}>
          <Octicons name="alert" size={21} color={Colors.sandalF} />
          <Text style={globalStyles.noDataText}>NO ATTENDANCE DATA</Text>
        </View>
      ) : (
        <>
          {showAttendance === 1 && (
            <View style={styles.shiftCard}>
              <Text style={styles.averageText}>Average Attendance</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressScaleRow}>
                  <Text style={styles.scaleText}>0</Text>
                  <Text style={styles.scaleText}>100</Text>
                </View>
                <View style={styles.PresentageProgressBar}>
                  <ProgressBar
                    progress={averagePercentage / 100}
                    color={Colors.RedColorDark}
                    style={styles.progressBar}
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
          )}

          <View style={styles.subjectListContainer}>
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject.code ? `${subject.code}_${index}` : index}
                subjectCode={subject.code}
                subjectName={subject.course_name}
                profName={subject.prof_name}
                totalClasses={subject.tot_hour}
                attendancePercentage={subject.attend_hours}
                presentPercentage={subject.present_percentage || 0}
                showAttendance={showAttendance}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: responsiveHeight(4),
  },
  scrollContentNoShift: {
    paddingTop: responsiveHeight(2),
  },
  subjectListContainer: {
    paddingBottom: responsiveHeight(2),
  },
  card: {
    backgroundColor: Colors.WhiteF,
    padding: responsiveWidth(2),
    borderRadius: responsiveWidth(3.5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
  },
  // Proper padding and spacing when attendance circle is hidden (Mode 2)
  cardWithoutAttendance: {
    paddingHorizontal: responsiveWidth(4.5),
    paddingVertical: responsiveHeight(1.8),
    marginHorizontal: responsiveWidth(3.5),
    marginBottom: responsiveHeight(1.5),
    borderRadius: responsiveWidth(4),
    elevation: 3,
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
    height: responsiveWidth(20),
    width: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    borderWidth: responsiveWidth(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: Colors.RedColorDark,
  },
  totalClasses: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    marginTop: responsiveHeight(0.5),
  },
  shiftCard: {
    backgroundColor: Colors.WhiteF,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3.5),
    marginHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(4),
    marginTop: responsiveHeight(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: responsiveHeight(2),
  },
  averageText: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: responsiveHeight(1.5),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(15),
  },
  loadingText: {
    color: Colors.Grey4F,
    marginTop: 8,
  },
  progressScaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    color: Colors.blackF || 'black',
  },
  progressBar: {
    height: responsiveHeight(4.5),
    backgroundColor: Colors.Grey2F,
    borderRadius: responsiveWidth(1.5),
  },
  progressBarInner: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
  },
  percentageText: {
    color: Colors.WhiteF,
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
  },
  improvingText: {
    color: Colors.RedColorDark,
    fontWeight: '800',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    margin: 5,
  },
  improvementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(1.5),
  },
  VerticalLine: {
    width: 1,
    height: '90%',
    backgroundColor: Colors.borderF || '#E0E0E0',
    marginHorizontal: responsiveWidth(2),
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    borderTopColor: Colors.borderF || '#E0E0E0',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    marginTop: 6,
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    fontStyle: 'italic',
    color: Colors.Grey4F,
  },
  subjectName: {
    marginVertical: responsiveHeight(0.3),
    color: Colors.blackF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  profName: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '800',
  },
  profLabel: {
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '800',
    marginTop: 4,
  },

  // Full-width card styles when showAttendance == 2
  fullCardContent: {
    width: '100%',
  },
  subjectCodeFull: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    color: Colors.Grey4F,
    marginBottom: responsiveHeight(0.4),
  },
  subjectNameFull: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: 'bold',
    color: Colors.blackF,
    marginBottom: responsiveHeight(0.8),
  },
  horizontalLineFull: {
    width: '100%',
    height: 1,
    borderTopColor: Colors.borderF || '#E0E0E0',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    marginVertical: responsiveHeight(1),
  },
  profRowFull: {
    marginTop: 2,
  },
  profLabelFull: {
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
    marginBottom: 2,
  },
  profNameFull: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
  },
});

export default Attendance;
