import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import Colors from '../../Color';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import {DataContext} from '../../context/DataContext';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FeeDetails = () => {
  const {userLoginData} = useContext(DataContext);
  // console.log(userLoginData)
  const [feeData, setFeeData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFeeData, setFilteredFeeData] = useState([]);

  useEffect(() => {
    fetchFeeData(userLoginData.student_id);
  }, []);

  const fetchFeeData = async () => {
    try {
      const response = await authenticatedFetch(
        `${Url}/fee_details?student_id=${userLoginData.student_id}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setFeeData(data);
      setFilteredFeeData(data.data); // Set filteredFeeData with fetched data
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching fee data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (feeData && feeData.data && feeData.data.length > 0) {
      setFilteredFeeData(
        feeData.data.filter(fee =>
          fee.fee_name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [feeData, searchQuery]);
  // Calculate due amount

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header} />
        {/* -------------------------- Donut Chart section Starts-------------------------- */}
        <View style={styles.contentContainer}>
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{feeData.percentage_paid} %</Text>
              <ProgressBar
                styleAttr="Horizontal"
                indeterminate={false}
                color={Colors.RedColorDark}
                style={styles.progressBar}
              />
            </View>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.textColumn}>
              <Text style={styles.textLabel}>Total fee</Text>
              <Text style={styles.textValue}>₹ {feeData.allocated}</Text>
            </View>
            <View style={styles.HorizontalLine} />
            <View style={styles.textColumn}>
              <Text style={styles.textLabel}>Fee paid</Text>
              <Text style={{color: 'green', fontSize: 18, fontWeight: 'bold'}}>
                ₹ {feeData.paid}
              </Text>
            </View>
            <View style={styles.HorizontalLine} />
            <View style={styles.textColumn}>
              <Text style={styles.textLabel}>Fee Due</Text>
              <Text
                style={{
                  color: Colors.sandalF,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                ₹ {feeData.due}
              </Text>
            </View>
          </View>
        </View>
        {/* -------------------------- Donut Chart section Ends-------------------------- */}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="medium" color={Colors.RedColorDark} />
            <Text style={{color: Colors.Grey4F}}>Loading</Text>
          </View>
        ) : (
          filteredFeeData.map((fee, index) => {
            return (
              <View key={index} style={styles.feeItem}>
                {/* -------------------------- Term Title section -------------------------- */}
                <View style={styles.termContainer}>
                  <Text style={styles.termText}>Term {fee.term_number}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                      name="calendar-text"
                      size={responsiveFontSize(3)}
                      color={Colors.RedColorDark}
                      style={{
                        marginRight: responsiveWidth(1),
                        paddingLeft: responsiveHeight(7),
                      }}
                    />
                    <Text style={styles.termTextMonthYear}>
                      {fee.trans_date || '-'}
                    </Text>
                  </View>
                </View>

                {/* -------------------------- Term Card section -------------------------- */}
                <View style={styles.termFeeCard}>
                  <Text style={styles.termFeeTitle}>{fee.fee_name}</Text>
                  <View style={styles.termFeeRow}>
                    <View style={styles.termFeeColumn}>
                      <Text style={styles.termFeeLabel}>Allocated</Text>
                      <Text
                        style={[styles.termFeeValue, {color: Colors.Grey3F}]}>
                        ₹{fee.amt_to_be_paid}
                      </Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.termFeeColumn}>
                      <Text style={styles.termFeeLabel}>Concession</Text>
                      <Text style={[styles.termFeeValue, {color: 'blue'}]}>
                        ₹{fee.concession}
                      </Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.termFeeColumn}>
                      <Text style={styles.termFeeLabel}>Paid</Text>
                      <Text style={[styles.termFeeValue, {color: 'green'}]}>
                        ₹{fee.paid || '0.00'}
                      </Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.termFeeColumn}>
                      <Text style={styles.termFeeLabel}>Due</Text>
                      <Text
                        style={[
                          styles.termFeeValue,
                          {color: Colors.RedColorDark},
                        ]}>
                        ₹{fee.due_amt || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Grey1F,
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  // header: {
  //   backgroundColor: Colors.RedDarkF,
  //   height: responsiveHeight(8),
  //   width: '100%',
  // },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(5),
    width: '94%',
    height: responsiveHeight(30),
    borderRadius: responsiveWidth(2),
    backgroundColor: Colors.WhiteF,
    marginBottom: 'auto',
    elevation: 5,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    height: responsiveWidth(50),
    width: responsiveWidth(50),
    borderRadius: responsiveWidth(25),
    borderWidth: responsiveWidth(12),
    borderColor: Colors.RedColorDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termFeeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
  },
  circleText: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginLeft: responsiveWidth(5),
    justifyContent: 'space-around',
  },
  textColumn: {
    alignItems: 'flex-start',
  },
  textLabel: {
    color: 'black',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '800',
  },
  textValue: {
    color: Colors.RedDarkF,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  feeItem: {
    marginBottom: responsiveHeight(1.2),
  },
  termContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
    marginBootm: responsiveHeight(1),
    justifyContent: 'space-between',
    width: responsiveWidth(94),
    alignItems: 'center',
  },
  FeeDetailCard: {
    marginTop: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(8),
    width: '100%',
    height: responsiveHeight(17),
    borderRadius: responsiveWidth(7),
    backgroundColor: Colors.WhiteF,
    elevation: 5,
    padding: 7,
    margin: 10,
  },
  termFeeTitle: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(2.2),
    marginBottom: responsiveHeight(2),
    fontWeight: 'bold',
  },
  termFeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  termFeeColumn: {
    alignItems: 'center',
    margin: 0,
  },
  termFeeLabel: {
    color: Colors.Grey3F,
    fontWeight: '800',
    fontSize: responsiveFontSize(1.7),
    marginBottom: responsiveHeight(1),
  },
  termFeeValue: {
    color: 'black',
    fontWeight: '800',
    fontSize: responsiveFontSize(2),
    letterSpacing: -0.5,
  },
  verticalLine: {
    height: '100%',
    borderStyle: 'dotted',
    borderColor: Colors.Grey3F,
    borderWidth: 1,
  },
  termText: {
    color: Colors.Grey4F,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    marginVertical: 10,
  },
  termTextMonthYear: {
    color: Colors.RedDarkF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  HorizontalLine: {
    borderStyle: 'dotted',
    borderColor: Colors.Grey3F,
    borderWidth: 1,
    width: '95%',
  },
  loader: {
    color: Colors.RedDarkF,
    marginTop: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeeDetails;
