import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../../Color';

const ExamInfo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.examText}>Exam Info</Text>
        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>5</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Exam taken So Far</Text>
            </View>
          </View>
          <View style={styles.dottedLine} />
          <View style={styles.rowContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>65</Text>
            </View>

            <Text style={styles.additionalText}>Arrear Count</Text>
          </View>
        </View>
      </View>
      <View style={styles.column}>
        <Text style={styles.examText}>CGPA</Text>
        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>65</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Rank</Text>
            </View>
          </View>
          <View style={styles.dottedLine} />
          <View style={styles.rowContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>65</Text>
            </View>
            <Text style={styles.additionalText}>Total Students</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: responsiveWidth(1), // Adjust padding
  },
  column: {
    flex: 1,
    alignItems: 'center',
    margin: responsiveWidth(1), // Adjust margin
  },
  examText: {
    color: 'black',
    fontSize: responsiveFontSize(2.3), // Adjust font size
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    height: responsiveHeight(20), // Adjust height
    borderRadius: responsiveWidth(5),
    marginTop: responsiveHeight(1), // Adjust marginTop
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    flexDirection: 'column',
    paddingHorizontal: responsiveWidth(5), // Adjust padding
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.RedColorDark,
    marginRight: responsiveWidth(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white',
    fontSize: responsiveFontSize(2), // Adjust font size
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.8), // Adjust font size
    fontWeight: 'bold',
    color: 'black',
    marginBottom: responsiveWidth(1), // Adjust marginBottom
  },
  dottedLine: {
    width: '80%',
    height: responsiveHeight(0.2), // Adjust height
    borderStyle: 'dotted',
    borderColor: Colors.Grey2F,
    borderWidth: 1,
    alignSelf: 'center', // Center the dotted line horizontally
    marginBottom: responsiveWidth(2), // Adjust marginBottom
    marginTop: responsiveWidth(2), // Adjust marginTop
  },

  additionalText: {
    color: 'black',
    fontSize: responsiveFontSize(1.8), // Adjust font size
    fontWeight: 'bold',
  },
});

export default ExamInfo;
