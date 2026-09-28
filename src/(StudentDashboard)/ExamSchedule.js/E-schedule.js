import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../Color';
import {SearchBar} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const customIconSize = responsiveFontSize(2.3);

const Eschedule = () => {
  return (
    <>
      <View style={styles.container}>
        <SearchBar
          placeholder="Search...."
          placeholderTextColor="gray"
          lightTheme
          inputContainerStyle={{backgroundColor: 'transparent'}}
          containerStyle={styles.searchBarContainer}
          searchIcon={{name: 'search'}}
        />
      </View>
      <View style={styles.whiteCard}>
        <View style={styles.redCardBackground}>
          <Text style={styles.DateOrder}>14 </Text>
          <Text style={styles.DayOrder}>Wed </Text>
          <View style={styles.verticalLine} />
          <Text style={styles.MonthOrder}>MAR </Text>
          <Text style={styles.MonthOrder}>2024 </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="clock-time-four-outline"
              size={customIconSize}
              color={Colors.RedColorDark}
            />
            <Text style={styles.ExamTime}>11:00 AM - 12:00 PM </Text>
            <Text style={styles.SEM}>SEM : 3</Text>
          </View>
          <Text style={styles.SubCode}>BSCE3L - Operating System </Text>
          <View style={[styles.row, styles.bottomMargin]}>
            <MaterialIcons
              name="location-on"
              size={customIconSize}
              color={Colors.sandalF}
            />
            <Text style={styles.Block_Hall}>B-Block </Text>
            <View style={styles.row}>
              <Entypo
                name="direction"
                size={customIconSize}
                color={Colors.sandalF}
              />
              <Text style={styles.Block_Hall}>Hall:21 |Seat :18 </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.RedColorDark,
  },
  whiteCard: {
    margin: responsiveWidth(2),
    height: responsiveHeight(15),
    marginTop: '13%',
    backgroundColor: Colors.WhiteColor,
    borderRadius: responsiveWidth(2),
    elevation: 2,
    flexDirection: 'row',
  },
  SEM: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: Colors.RedColorDark,
    marginLeft: responsiveWidth(4),
  },
  redCardBackground: {
    backgroundColor: Colors.RedColorDark,
    width: '20%',
    borderTopLeftRadius: responsiveWidth(2),
    borderBottomLeftRadius: responsiveWidth(2),
  },
  DateOrder: {
    color: 'white',
    fontSize: responsiveFontSize(4),
    marginLeft: responsiveWidth(4),
  },
  DayOrder: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    marginLeft: responsiveWidth(4),
  },
  MonthOrder: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(4),
  },
  verticalLine: {
    margin: responsiveWidth(1),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.WhiteF,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    padding: responsiveWidth(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomMargin: {
    marginBottom: responsiveHeight(1.6),
    marginTop: responsiveHeight(1.6),
  },
  SubCode: {
    fontSize: responsiveFontSize(2.3),
    marginTop: responsiveHeight(1.5),
    fontWeight: 'bold',
    color: Colors.BlackColor,
  },
  ExamTime: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    color: Colors.RedColorDark,
    justifyContent: 'space-between',
  },
  Block_Hall: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: Colors.Grey3F,
  },
  searchBarContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: 'white',
    width: '90%',
    marginTop: 60,
    height: 'auto',
    justifyContent: 'center',
  },
});

export default Eschedule;
