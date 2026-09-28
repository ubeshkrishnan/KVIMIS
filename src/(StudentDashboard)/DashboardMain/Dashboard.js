import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  Modal,
  Button,
  Dimensions,
} from 'react-native';
import Colors from '../../Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch, getSecurityHeaders } from '../../../Global_Variable/api_helper';
import {image_Url} from '../../../Global_Variable/api_link';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import DashboardFee from './DashboardFee';
import AverageAttendance from './AverageAttendance';
import DashboardHostel from './DashboardHostel';
import DashboardTicket from './DashboardTicket';

const Dashboard = () => {
  const {userLoginData} = useContext(DataContext);
  const [data, setData] = useState();
  const [staffDetailData, setStaffDetailData] = useState(null);
  const [feeData, setFeeData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentNameResponse = await authenticatedFetch(
          Url + `/department_name?student_id=${userLoginData.student_id}`,
        );

        const libraryResponse = await authenticatedFetch(
          Url + `/library?user_id=${userLoginData.user_id}`,
        );

        const getstaffDetailsResponse = await authenticatedFetch(
          Url +
            `/getHourDetails?batch_id=${userLoginData.batch_id}&degree_branch_id=${userLoginData.degree_branch_id}&user_id=${userLoginData.user_id}&student_id=${userLoginData.student_id}&current_semester=${userLoginData.current_semester}`,
        );
        // console.log(getstaffDetailsResponse)
        if (
          !departmentNameResponse.ok ||
          !libraryResponse.ok ||
          !getstaffDetailsResponse.ok
        ) {
          throw new Error('One or more network responses were not ok');
        }

        const departmentNameData = await departmentNameResponse.json();
        const libraryData = await libraryResponse.json();
        const getstaffDetailsData = await getstaffDetailsResponse.json();

        setData(departmentNameData);
        setStaffDetailData(getstaffDetailsData);
        setFeeData(libraryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userLoginData]);

  const handleCardPress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header} />
      <TouchableNativeFeedback onPress={handleCardPress}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerHello}>Hello,</Text>
              <Text style={styles.headerName}>{userLoginData.first_name}</Text>
              <Text style={styles.headerCourse}>{data?.degree_name}</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: `${image_Url}${userLoginData.image}`,
                  headers: getSecurityHeaders(),
                }}
                style={styles.profilePicture}
              />
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>

      <DashboardFee />
      <AverageAttendance />

      <View>
        <View style={styles.sectionContainer}>
          <View style={styles.scheduleDetails}>
            <Text style={styles.sectionHeader}>Today's Schedule</Text>
            <TouchableNativeFeedback
              onPress={() => navigation.navigate('TimeTable')}>
              <Text style={styles.viewAllTextSub}>View All</Text>
            </TouchableNativeFeedback>
          </View>
        </View>

        <View style={styles.containerStaff}>
          {staffDetailData &&
          typeof staffDetailData === 'object' &&
          (staffDetailData.start_time ||
            staffDetailData.professor_name ||
            staffDetailData.course_name ||
            staffDetailData.labels ||
            staffDetailData.date) ? (
            <View style={styles.staffDetails}>
              <Image
                style={styles.profilePictureStaff}
                source={
                  staffDetailData.start_time
                    ? require('../../../assets/graduate.png')
                    : require('../../../assets/holiday.png')
                }
              />
              <View style={styles.teacherDetails}>
                <Text style={styles.teacherName}>
                  {staffDetailData?.professor_name || staffDetailData?.date}
                </Text>
                <Text style={styles.courseName}>
                  {staffDetailData?.start_time && staffDetailData?.end_time
                    ? staffDetailData?.course_name || ''
                    : staffDetailData?.labels || ''}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  {staffDetailData &&
                    staffDetailData.start_time &&
                    staffDetailData.end_time && (
                      <>
                        <MaterialCommunityIcons
                          name="clock-time-four-outline"
                          size={responsiveFontSize(2.3)}
                          color={Colors.RedColorDark}
                        />
                        <Text style={styles.scheduleText}>
                          {`${staffDetailData.start_time} - ${staffDetailData.end_time}`}
                        </Text>
                      </>
                    )}
                </View>
                {staffDetailData?.start_time && staffDetailData?.end_time && (
                  <Text style={styles.courseCode}>
                    Course Code {staffDetailData?.code || ''}
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.noScheduleContainer}>
              <Octicons name="alert" size={20} color={Colors.sandalF} />
              <Text style={styles.noScheduleText}>NO SCHEDULE AVAILABLE TODAY</Text>
            </View>
          )}
        </View>

        <>
          <View style={styles.lineStyle} />
          <View style={styles.scheduleDetails}>
            <Text style={styles.sectionHeader}>Library</Text>
            <TouchableNativeFeedback
              onPress={() => navigation.navigate('Library')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.cardContainerLibrary}>
            {feeData && (
              <>
                <View style={styles.Actionablecard}>
                  <FontAwesome5
                    name="book"
                    size={responsiveFontSize(3)}
                    color={Colors.RedColorDark}
                  />
                  <Text style={styles.ActionablecardText}>Books Issued</Text>
                  <Text style={styles.ActionablecardData}>
                    {feeData.total_book_count}
                  </Text>
                </View>
                <View style={styles.Actionablecard}>
                  <FontAwesome5
                    name="book"
                    size={responsiveFontSize(3)}
                    color={Colors.RedColorDark}
                  />
                  <Text style={styles.ActionablecardText}>Books Returned</Text>
                  <Text style={styles.ActionablecardData}>
                    {feeData.book_returned}
                  </Text>
                </View>
                <View style={styles.Actionablecard}>
                  <FontAwesome6
                    name="sack-dollar"
                    size={responsiveFontSize(3)}
                    color={Colors.RedColorDark}
                  />
                  <Text style={styles.ActionablecardText}>Books Due </Text>
                  <Text style={styles.ActionablecardData}>
                    {feeData.total_book_fee_due}
                  </Text>
                </View>
              </>
            )}
          </View>
        </>
      </View>
      {userLoginData.is_hosteller === '1' && <DashboardHostel />}

      
      {/* <DashboardHostel /> */}
      {/* <DashboardTicket /> */}

      {/* <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <ScrollView>
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: `${image_Url}${userLoginData.image}`}}
                  style={styles.profilePictureModal}
                />
              </View>
              <View style={styles.profileData}>
                <View style={styles.dataRow}>
                  <Text style={styles.label}>First Name:</Text>
                  <Text style={styles.value}>{userLoginData.first_name}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Last Name:</Text>
                  <Text style={styles.value}>{userLoginData.last_name}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{userLoginData.email}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Mobile:</Text>
                  <Text style={styles.value}>{userLoginData.mobile}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Date of Birth:</Text>
                  <Text style={styles.value}>{userLoginData.dob}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.label}>Register Number:</Text>
                  <Text style={styles.value}>
                    {userLoginData.register_number}
                  </Text>
                </View>
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  );
};

export default Dashboard;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Grey1F,
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.RedColorDark,
    height: 0.1 * screenHeight,
    width: '100%',
  },
  card: {
    position: 'absolute',
    backgroundColor: Colors.WhiteF,
    elevation: 5,
    padding: responsiveWidth(5),
    width: responsiveWidth(93),
    height: 0.15 * screenHeight, // Adjusted height to 20% of screen height
    borderRadius: responsiveWidth(5),
    top: '0.7%', // Adjusted for centering the card vertically
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    padding: responsiveWidth(2),
  },
  imageContainer: {
    alignItems: 'flex-end',
  },
  profilePicture: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
  },
  profilePictureModal: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(15),
  },
  headerHello: {
    color: Colors.RedDarkF,
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
  },
  headerName: {
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '800',
  },
  headerCourse: {
    color: Colors.Grey4F,
    fontSize: responsiveFontSize(1.5),
    fontStyle: 'italic',
    fontWeight: '400',
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(0),
    marginBottom: responsiveHeight(1),
  },
  sectionHeader: {
    marginBottom: responsiveHeight(0),
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginVertical: 6,
    color: Colors.blackF,
    paddingHorizontal: responsiveWidth(5),
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: responsiveWidth(100),
  },
  scheduleText: {
    color: Colors.RedColorDark,
    fontWeight: '800',
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(0.8),
  },
  containerStaff: {
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: 'white',
    elevation: 5,
    marginBottom: responsiveHeight(2),
    width: responsiveWidth(90),
    alignSelf: 'center', // Align the container horizontally to the center
    justifyContent: 'center', // Align the content vertically to the center
  },

  staffDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePictureStaff: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    borderRadius: responsiveWidth(9),
  },
  teacherDetails: {
    marginLeft: responsiveWidth(5),
  },
  teacherName: {
    color: Colors.RedDarkF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.9),
  },
  courseName: {
    color: 'black',
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
    width: responsiveWidth(57),
  },
  courseCode: {
    color: Colors.Grey3F,
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: responsiveFontSize(1.7),
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  cardContainerLibrary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    width: responsiveWidth(100),
  },
  Actionablecard: {
    backgroundColor: 'white',
    borderRadius: responsiveWidth(6),
    paddingVertical: responsiveHeight(2),
    width: responsiveWidth(29),
    margin: responsiveWidth(1.5),
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ActionablecardText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: Colors.Grey4F,
    marginTop: 6,
  },
  ActionablecardData: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: 'bold',
    color: Colors.Grey4F,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(5),
    alignItems: 'center',
    width: responsiveWidth(80),
    maxWidth: 400,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
    width: '100%',
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
  },
  value: {
    fontSize: responsiveFontSize(1.8),
    color: 'black',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: responsiveHeight(2),
    width: '100%',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    marginVertical: responsiveHeight(2),
    borderStyle: 'dotted',
    margin: 15,
  },
  viewAllText: {
    color: Colors.RedDarkF,
    alignSelf: 'flex-end',
    marginRight: responsiveWidth(5),
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
  },
  viewAllTextSub: {
    color: Colors.RedDarkF,
    alignSelf: 'flex-end',
    marginRight: responsiveWidth(5),
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
  },
  noScheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(1),
  },
  noScheduleText: {
    color: Colors.Grey4F,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.7),
    marginLeft: responsiveWidth(2),
  },
});
