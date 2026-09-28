import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Colors from '../../Color';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TimeTableCardData from './TimeTableCardData';

const TimeTable = () => {
  const getMonthName = monthIndex => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[monthIndex];
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [onDatePressState, setOnDatePressState] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(currentDate.getDate());
    setSelectedMonth(currentDate.getMonth() + 1);
    setSelectedYear(currentDate.getFullYear());
    setSelectedCard(currentDate.getDate());

    setTimeout(() => {
      if (scrollViewRef.current) {
        const cardWidth = responsiveWidth(15) + responsiveWidth(2.4);
        const scrollX = (currentDate.getDate() - 1) * cardWidth - Dimensions.get('window').width / 2 + cardWidth / 2;
        scrollViewRef.current.scrollTo({ x: scrollX > 0 ? scrollX : 0, animated: true });
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (onDatePressState) {
      const { day, month, year } = onDatePressState;
      setSelectedDate(day);
      setSelectedMonth(month);
      setSelectedYear(year);
    }
  }, [onDatePressState]);

  const onDatePress = (day, month, year) => {
    const formattedDay = day.toString().padStart(2, '0');
    setOnDatePressState({ day: formattedDay, month, year });
  };

  const currentDate = new Date();
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthName = getMonthName(currentMonthIndex);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.container}>
        <View style={styles.headerBanner} />
        {/* ------------------------------ Date Card Top Section ------------------------------ */}
        <View style={[styles.card, styles.shadowProp]}>
          <View style={styles.dateContainer}>
            <MaterialCommunityIcons
              name="calendar-today"
              size={responsiveFontSize(3.8)}
              color={Colors.RedDarkF}
              style={{ marginRight: responsiveWidth(2) }}
            />
            <Text style={styles.timetableDate}>
              {onDatePressState ? onDatePressState.day : currentDay}
            </Text>
            {onDatePressState ? (
              <View style={styles.dayInfo}>
                <Text style={styles.currentYear}>
                  {
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                    new Date(
                      onDatePressState.year,
                      onDatePressState.month - 1,
                      onDatePressState.day,
                    ).getDay()
                    ]
                  }
                </Text>
                <Text style={styles.currentYear}>
                  {getMonthName(onDatePressState.month - 1)}{' '}
                  {onDatePressState.year}
                </Text>
              </View>
            ) : (
              <View style={styles.dayInfo}>
                <Text style={styles.currentYear}>
                  {
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                    currentDate.getDay()
                    ]
                  }
                </Text>
                <Text style={styles.currentYear}>
                  {currentMonthName} {currentYear}
                </Text>
              </View>
            )}
            {!onDatePressState && (
              <View style={styles.dayOrderTopBadge}>
                <Text style={styles.dayOrderTopText}>Today</Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          ref={scrollViewRef}>
          {(() => {
            const activeMonthIndex = selectedMonth ? selectedMonth - 1 : currentMonthIndex;
            const activeYear = selectedYear || currentYear;
            const daysInMonth = new Date(activeYear, activeMonthIndex + 1, 0).getDate();

            return [...Array(daysInMonth).keys()].map(day => {
              const date = new Date(activeYear, activeMonthIndex, day + 1);
              const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                date.getDay()
              ];
              const isCurrentDate =
                day + 1 === currentDate.getDate() &&
                activeMonthIndex === currentDate.getMonth() &&
                activeYear === currentDate.getFullYear();
              const isSelected = Number(selectedDate) === day + 1;

              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => {
                    onDatePress(day + 1, activeMonthIndex + 1, activeYear);
                    setSelectedCard(day + 1);
                  }}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.dayCard,
                      isCurrentDate && styles.currentDate,
                      isSelected && styles.selectedCard,
                    ]}>
                    <Text
                      style={[styles.dayText, isSelected && styles.selectedText]}>
                      {day + 1}
                    </Text>
                    <Text
                      style={[
                        styles.dayOrder,
                        isSelected && styles.selectedText,
                      ]}>
                      {dayOfWeek}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            });
          })()}
        </ScrollView>
      </View>

      <TimeTableCardData
        date={`${selectedYear || currentYear}-${String(selectedMonth || (currentMonthIndex + 1)).padStart(2, '0')}-${String(selectedDate || currentDate.getDate()).padStart(2, '0')}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: Colors.GreyBg || '#F5F5F5',
  },
  container: {
    backgroundColor: Colors.GreyBg || '#F5F5F5',
    alignItems: 'center',
    width: '100%',
  },
  headerBanner: {
    backgroundColor: Colors.RedColorDark,
    height: responsiveHeight(7),
    width: '100%',
  },
  card: {
    backgroundColor: Colors.WhiteF,
    width: responsiveWidth(92),
    marginTop: -responsiveHeight(4.5),
    borderRadius: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.8),
    justifyContent: 'center',
  },
  shadowProp: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timetableDate: {
    fontSize: responsiveFontSize(3.5),
    color: Colors.blackF || '#212121',
    fontWeight: '700',
  },
  dayInfo: {
    marginLeft: responsiveWidth(3),
    justifyContent: 'center',
  },
  currentYear: {
    color: Colors.Grey3F || '#757575',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.7),
    lineHeight: responsiveFontSize(2.2),
  },
  dayOrderTopBadge: {
    marginLeft: 'auto',
    backgroundColor: Colors.RedVLightF || '#FDE8EB',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: responsiveWidth(5),
  },
  dayOrderTopText: {
    color: Colors.RedColorDark,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.6),
  },
  scrollContainer: {
    marginTop: responsiveHeight(1.5),
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(3),
    paddingBottom: responsiveHeight(1),
  },
  dayCard: {
    backgroundColor: Colors.WhiteF,
    width: responsiveWidth(15),
    height: responsiveHeight(7.5),
    marginHorizontal: responsiveWidth(1.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(3),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  dayText: {
    color: Colors.blackF || '#212121',
    fontWeight: '700',
    fontSize: responsiveFontSize(2.2),
  },
  dayOrder: {
    color: Colors.RedColorDark,
    fontWeight: '600',
    fontSize: responsiveFontSize(1.5),
    marginTop: 2,
  },
  currentDate: {
    borderColor: Colors.RedColorDark,
    borderWidth: 1.5,
  },
  selectedCard: {
    backgroundColor: Colors.RedColorDark,
  },
  selectedText: {
    color: Colors.WhiteF,
  },
});

export default TimeTable;
