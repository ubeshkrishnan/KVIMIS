import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Color';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';

const EducationDetail = () => {
  const userLoginData = useContext(DataContext);
  const [educationData, setEducationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEducationDetails = async () => {
      try {
        const apiUrl = `${Url}/education_details?user_id=${userLoginData.userLoginData.user_id}`;
        const response = await authenticatedFetch(apiUrl);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setEducationData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchEducationDetails();
  }, [userLoginData]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.cardContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="medium" color={Colors.RedColorDark} />
            <Text style={{color: Colors.Grey4F}}>Loading</Text>
          </View>
        ) : (
          educationData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Row
                label="Converted Christian or Adi Dravidar"
                value={item.is_adi_chist || '-'}
              />

              <Row label="UG Branch" value={item.ug_branch || '-'} />
              <Row label="UG Degree" value={item.ug_degree || '-'} />
              <Row label="UG Reg.no" value={item.ugregno || '-'} />
              <Row label="UG Institution Name" value={item.college || '-'} />
              <Row label="University" value={item.instituteuniversity || '-'} />
              <Row
                label="Month & Year of Completion"
                value={item.month_year_of_completion || '-'}
              />
              <Row
                label="Overall % until semester"
                value={item.untill_semester || '-'}
              />
              <Row
                label="Overall % percentage"
                value={item.untill_semester_percentage || '-'}
              />
              <Row
                label="10th Medium of instruction studied"
                value={item.medium_of_instruction || '-'}
              />
              <Row label="10th Mark Scored " value={item.scored_10th_mark} />
              <Row
                label="Maximum 10th Mark Possible"
                value={item.total_10th_mark || '-'}
              />
              <Row
                label="10th % of Marks"
                value={item.scored_10th_per || '-'}
              />
              <Row
                label="12th Medium of Instruction"
                value={item.medium_12th_of_instruction || '-'}
              />
              <Row label="12th Group" value={item.group_12th || '-'} />
              <Row
                label="12th Mark Scored"
                value={item.scored_12th_mark || '-'}
              />
              <Row
                label="Maximum 12th Mark Possible"
                value={item.total_12th_mark || '-'}
              />
              <Row
                label="12th % of Marks"
                value={item.scored_12th_per || '-'}
              />
              <Row
                label="Do You Need Transport Facility"
                value={item.transport || '-'}
              />
              <Row
                label="Do You Opt For A Laptop From The Institution"
                value={item.laptop_from_ins || '-'}
              />
              <Row
                label="Introduced By/How did you know about KV"
                value={item.introduced_know_kv || '-'}
              />
              <Row
                label="Field of Interest(for Information only)"
                value={item.field_of_ins || '-'}
              />
              <Row
                label="Do You Opt For A Industrial Visit From The Institution"
                value={item.insdutrial_visit || '-'}
              />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const Row = ({label, value}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: Colors.Grey1F,
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.WhiteF,
  },
  colon: {
    color: 'black',
    marginRight: 5,
    fontSize: 17,
    marginRight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    marginRight: 50,
    fontSize: 17,
  },
  value: {
    flex: 1,
    color: 'black',
    fontSize: Colors.Data_FontSize,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EducationDetail;
