import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    dob: '',
    address1: '',
    state: '',
    blood_group: '',
    image: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Define an array of keys you want to retrieve from AsyncStorage
        const AsyncStorageKeys = [
          'first_name',
          'last_name',
          'email',
          'mobile',
          'dob',
          'address1',
          'state',
          'blood_group',
          'image',
        ];

        // Use Promise.all to retrieve multiple values from AsyncStorage
        const retrievedData = await Promise.all(
          AsyncStorageKeys.map(async key => {
            const value = await AsyncStorage.getItem(key);
            return [key, value];
          }),
        );

        // Construct the user data object from retrieved values
        const userDataObject = {};
        retrievedData.forEach(([key, value]) => {
          if (value !== null) {
            userDataObject[key] = value;
          }
        });

        setUserData(userDataObject);
        // console.log('Retrieved user data:', userDataObject);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/profile.png')}
          style={styles.profilePicture}
        />
        <Text style={styles.name}>
          {userData.first_name} {userData.last_name}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Mobile:</Text>
          <Text style={styles.value}>{userData.mobile}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{userData.dob}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{userData.address1}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>State:</Text>
          <Text style={styles.value}>{userData.state}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Blood Group:</Text>
          <Text style={styles.value}>{userData.blood_group}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#888',
  },
  value: {
    color: '#555',
  },
});
