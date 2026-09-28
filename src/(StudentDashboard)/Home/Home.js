import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { image_Url } from '../../../Global_Variable/api_link';
import { getSecurityHeaders } from '../../../Global_Variable/api_helper';
import Colors from '../../Color';
import { DataContext } from '../../context/DataContext';

const MenuCard = ({ name, icon, backgroundColor, iconColor }) => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(name)}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: Colors.RedColorDark }, // Set the background color here
        ]}>
        <Icon name={icon} size={responsiveFontSize(3)} color={iconColor} />
      </View>
      <Text style={styles.cardText}>{name}</Text>
    </TouchableOpacity>
  );
};

const Home = () => {
  const { userLoginData } = useContext(DataContext);
  // useEffect(() => {
  //   const backAction = () => {
  //     // Handle the back button press here
  //     // Returning true will prevent default back button behavior
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove(); // Remove the event listener on component unmount
  // }, []);
  // console.log(userLoginData)
  const menuItems = [
    {
      id: 1,
      name: 'Dashboard',
      icon: 'stats-chart',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 2,
      name: 'TimeTable',
      icon: 'clipboard',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 3,
      name: 'Attendance',
      icon: 'hand-left',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 4,
      name: 'Calendar',
      icon: 'calendar',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 5,
      name: 'Courses',
      icon: 'layers',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 6,
      name: 'Fee Details',
      icon: 'wallet',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 7,
      name: 'Library',
      icon: 'library-outline',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 8,
      name: 'Survey',
      icon: 'trophy',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 9,
      name: 'Ticket',
      icon: 'file-tray',
      backgroundColor: 'white',
      iconColor: 'white',
    },
    {
      id: 10,
      name: 'Other Details',
      icon: 'newspaper-outline',
      backgroundColor: 'white',
      iconColor: 'white',
    },
  ]
  //   {
  //     id: 11,
  //     name: 'Attendo',
  //     icon: 'scan-sharp',
  //     backgroundColor: 'white',
  //     iconColor: 'white',
  //   },
  // ];


  // let filteredMenu = [];
  // if (userLoginData.users_role_id === '15') {
  //   filteredMenu = menuItems;
  // } else {
  //   filteredMenu = menuItems.filter(item => item.id === 11);
  // }

  const filteredMenu = menuItems;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.RedColorDark} barStyle="light-content" />
      <View style={styles.backgroundContainer}>
        <View style={styles.profileCard}>
          <View style={styles.circularProfile}>
            <Image
              source={{
                uri: `${image_Url}${userLoginData.image}`,
                headers: getSecurityHeaders(),
              }}
              style={styles.profilePicture}
            />
          </View>
          <Text style={styles.profileText}>
            {userLoginData.first_name} {userLoginData.last_name}
          </Text>
          <Text style={styles.studentId}>{userLoginData.register_number}</Text>
        </View>
        <View style={styles.cardContainer}>
          {filteredMenu.map(item => (
            <MenuCard
              key={item.name}
              name={item.name}
              icon={item.icon}
              backgroundColor={item.backgroundColor}
              iconColor={item.iconColor}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: responsiveHeight(20),
    backgroundColor: Colors.RedColorDark,
    borderBottomLeftRadius: responsiveWidth(10),
    borderBottomRightRadius: responsiveWidth(10),
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    marginTop: responsiveHeight(-4),
    paddingBottom: responsiveHeight(2),
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: responsiveWidth(2),
    margin: 1,
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    marginVertical: responsiveHeight(0.6),
    width: responsiveWidth(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    marginRight: responsiveWidth(4.7),
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  iconContainer: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  cardText: {
    fontSize: responsiveFontSize(1.7),
    textAlign: 'center',
    color: '#111',
    fontWeight: '700',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
    backgroundColor: '#f7f8f9',
    borderRadius: responsiveWidth(2),
    marginBottom: responsiveHeight(4),
    marginTop: responsiveHeight(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  circularProfile: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  profileText: {
    fontSize: responsiveFontSize(2),
    color: '#111',
    marginTop: responsiveHeight(2),
    fontWeight: '900',
  },
  studentId: {
    fontSize: responsiveFontSize(1.5),
    color: 'grey',
    marginTop: responsiveHeight(1),
    fontWeight: '700',
  },
  profilePicture: {
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    borderRadius: responsiveWidth(12),
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(3),
  },
});

export default Home;
