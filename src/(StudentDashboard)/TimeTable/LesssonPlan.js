import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../Color';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const LessonPlan = ({route}) => {
  // const { event } = route.params;
  const data = [
    {
      sub: 'Bussiness Economics',
      SubCode: '23UAF1A1',
      semester: 'I',
      staff: 'SWATHII K M',
    },
  ];

  return (
    <View style={styles.container}>
      {data.map((event, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>Course : {event.sub}</Text>
          <Text style={styles.sem}>SEM: {event.semester}</Text>
          <Text style={styles.subCode}>Code: {event.SubCode}</Text>
          <Text style={styles.staff}>Staff: {event.staff}</Text>
          <TouchableOpacity style={styles.button}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                fontSize: 16,
              }}>
              <Text style={styles.buttonText}>Download Lesson Plan</Text>
              <Icon
                name="download"
                color="white"
                style={{marginLeft: 10, fontSize: 18}}
              />
              {/* Adjust the value of marginLeft based on the desired space */}
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
  },
  Course: {
    color: 'black',
  },
  sem: {
    color: 'black',
  },
  staff: {
    color: 'black',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.RedPure,
    // textDecorationLine: "underline",
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: Colors.RedPure,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.WhiteColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  subCode: {
    color: 'black',
  },
});

export default LessonPlan;
