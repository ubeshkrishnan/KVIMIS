import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import {Calendar as RNCalendar} from 'react-native-calendars';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../../Color';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import {DataContext} from '../../context/DataContext';
import {globalStyles} from '../../GlobalStyles';
import Octicons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';

const Calendar = () => {
  const today = new Date();
  const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const {userLoginData} = useContext(DataContext);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [calendarData, setCalendarData] = useState(null);
  const navigation = useNavigation();

  // console.log(selectedDate)
  const handleDayPress = date => {
    setSelectedDate(date.dateString);
  };

  useEffect(() => {
    fetchCalendarData(selectedDate); // Initial fetch with selected date
  }, [selectedDate]); // Fetch data when selected date changes

  const fetchCalendarData = selectedDate => {
    const apiUrl = `${Url}/calendar?user_id=${userLoginData.user_id}&date=${selectedDate}`;
    authenticatedFetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const uniqueData = data.filter(
          (item, index, self) =>
            index === self.findIndex(t => t.date === item.date),
        );
        setCalendarData(uniqueData);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  };

  const getMarkedDates = () => {
    if (!calendarData) {
      return {};
    }

    const markedDates = {};
    calendarData.forEach(holiday => {
      markedDates[holiday.date] = {
        marked: true,
        dotColor: holiday.labels === 'HOLIDAY' ? 'green' : 'red',
      };
    });

    // Add styling for the selected date
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: Colors.RedDarkF,
    };

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <RNCalendar
          style={styles.calendar}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
        />
        <TouchableNativeFeedback
          onPress={() => navigation.navigate('TimeTable')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableNativeFeedback>
        {calendarData === null ? (
          <Text style={styles.loadingMessage}>Loading...</Text>
        ) : calendarData.length === 0 ? (
          <View style={globalStyles.noDataContainer}>
            <Octicons name="alert" size={21} color={Colors.sandalF} />
            <Text style={globalStyles.noDataText}>NO DATA AVAILABLE</Text>
          </View>
        ) : (
          <ScrollView>
            {calendarData.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.VerticalLine} />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.CalendarDayReason}>
                    {item.labels.includes('WORKING DAY') ||
                    item.labels === 'HOLIDAY'
                      ? item.labels.split(' ').slice(0, 2).join(' ')
                      : item.labels}
                  </Text>
                  {item.labels.includes('WORKING DAY') &&
                  item.labels === 'HOLIDAY'
                    ? item.labels.split(' ').length > 2 && (
                        <Text style={styles.CalendarDayReasonSecond}>
                          {item.labels.split(' ').slice(2).join(' ')}
                        </Text>
                      )
                    : null}
                  <Text style={styles.CalendarText}>{item.date}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },

  calendarContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.Grey1F,
    padding: 15,
  },
  calendar: {
    borderRadius: 30,
    overflow: 'hidden',
    paddingBottom: 20,
    elevation: 5,
    color: Colors.RedColorDark,
  },
  card: {
    backgroundColor: Colors.WhiteF,
    padding: 20,
    color: Colors.blackF,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
    elevation: 5,
  },
  VerticalLine: {
    width: 4,
    height: '50%',
    backgroundColor: Colors.RedDarkF,
    marginHorizontal: 8,
  },
  cardTextContainer: {
    marginLeft: 10,
  },
  CalendarText: {
    fontSize: responsiveFontSize(2.1),

    color: Colors.RedColorDark,
    fontWeight: '700',
  },
  CalendarDayReason: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(2.6),

    fontWeight: '700',
  },
  CalendarDayReasonSecond: {
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(2.1),
    fontWeight: '700',
  },
  loadingMessage: {
    marginTop: 10,
    color: Colors.Grey3F,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
  },
  noDataMessage: {
    marginTop: 10,
    color: Colors.Grey3F,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: responsiveFontSize(2.1),
  },
  viewAllText: {
    color: Colors.RedDarkF,
    alignSelf: 'flex-end',
    marginRight: responsiveWidth(5),
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    marginTop: 7,
  },
});

export default Calendar;
