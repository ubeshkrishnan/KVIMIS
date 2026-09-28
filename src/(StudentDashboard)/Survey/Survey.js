import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Color';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import Octicons from 'react-native-vector-icons/Octicons';
import {globalStyles} from '../../GlobalStyles';

const Survey = () => {
  const {userLoginData} = useContext(DataContext);
  const [surveyData, setSurveyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = () => {
    authenticatedFetch(Url + `/get_survey?user_id=${userLoginData.user_id}`)
      .then(response => response.json())
      .then(data => {
        setSurveyData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="medium" color={Colors.RedColorDark} />
              <Text style={{color: Colors.Grey4F}}>Loading</Text>
            </View>
          ) : surveyData.length === 0 ? (
            <View style={globalStyles.noDataContainer}>
              <Octicons name="alert" size={21} color={Colors.sandalF} />
              <Text style={globalStyles.noDataText}>NO DATA AVAILABLE</Text>
            </View>
          ) : (
            surveyData.map((survey, index) => (
              <View key={index} style={styles.dynamicCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.semBadge}>
                    <Text style={styles.semText}>Sem {survey.sem_no}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: survey.status === 'Completed' ? '#E8F5E9' : '#FFF3E0' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: survey.status === 'Completed' ? '#2E7D32' : '#EF6C00' }
                    ]}>
                      {survey.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.dynamicCardTitle}>
                  {survey.survey_name}
                </Text>

                <View style={styles.branchContainer}>
                  <Octicons name="mortar-board" size={14} color={Colors.Grey3F} />
                  <Text style={styles.valueBranchLable}>
                    {survey.degree_name}
                  </Text>
                </View>

                <View style={styles.rowCardCreatedt}>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Start Date</Text>
                    <Text style={styles.dateValue}>{survey.start_date}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>End Date</Text>
                    <Text style={styles.dateValue}>{survey.due_date}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Completed</Text>
                    <Text style={[styles.dateValue, { color: survey.completed_date ? Colors.GreenColorF : Colors.Grey3F }]}>
                      {survey.completed_date || '-'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {/*
      <TouchableOpacity style={styles.addButton}>
        <MaterialCommunityIcons name="plus" color={Colors.WhiteF} size={30} />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  dynamicCard: {
    backgroundColor: Colors.WhiteF,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  semBadge: {
    backgroundColor: '#F9F2F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  semText: {
    color: Colors.RedColorDark,
    fontWeight: '800',
    fontSize: responsiveFontSize(1.6),
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '800',
  },
  dynamicCardTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '800',
    color: Colors.blackF,
    marginBottom: 8,
  },
  branchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  valueBranchLable: {
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(1.6),
    fontStyle: 'italic',
    marginLeft: 6,
    flex: 1,
  },
  rowCardCreatedt: {
    flexDirection: 'row',
    backgroundColor: Colors.GreyBg,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    color: Colors.Grey4F,
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
    marginBottom: 4,
  },
  dateValue: {
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '800',
  },
  divider: {
    height: '60%',
    width: 1,
    backgroundColor: '#DDD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
});

export default Survey;
