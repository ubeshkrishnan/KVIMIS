import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DataContext } from '../../context/DataContext';
import { Url } from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import Colors from '../../Color';
import { globalStyles } from '../../GlobalStyles';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const WaitingOnMe = () => {
  const { userLoginData } = useContext(DataContext);
  const [tickets, setTickets] = useState([]);
  const [topCardsData, setTopCardsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch(
          Url + `/waiting_on_me?user_id=${userLoginData.user_id}`,
        );
        if (!response.ok) {
          throw new Error('Network response for total paid fee was not ok');
        }
        const data = await response.json();
        setTickets(data.data); // Assuming the ticket data is stored in 'data' field
        // console.log(data.data)
        // Convert the 'final' object into an array of objects
          const finalDataArray = Object.entries(data.final).map(
            ([title, count]) => ({
              title,
              count,
            }),
          );

          setTopCardsData(finalDataArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userLoginData.user_id]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.CardContainer}>
          {topCardsData.map((card, index) => (
            <View key={index} style={styles.StatusCard}>
              <Text style={styles.cardCount}>{card.count}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>
          ))}
        </View>
        {tickets.length === 0 ? (
          <View style={globalStyles.noDataContainer}>
            <Octicons name="alert" size={21} color={Colors.sandalF} />
            <Text style={globalStyles.noDataText}>NO TICKETS AVAILABLE</Text>
          </View>
        ) : (
          tickets.map((ticket, indexTicket) => (
            <View key={indexTicket} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.ticketNo}>Ticket No:</Text>
                <Text style={styles.ticketNo}>{ticket.ticket_id}</Text>
              </View>
              <View style={{ maxWidth: '100%' }}>
                <Text style={styles.description}>{ticket.title}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Assigned To : </Text>
                <Text style={styles.assignValue}>{ticket.assigned_to}</Text>
              </View>
              <View style={styles.rowCardCreatedt}>
                <View style={styles.dateInfo}>
                  <Text style={styles.CreatedDate}>Created Date</Text>
                  <Text style={styles.createDtText}>{ticket.created_at}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.dateInfo}>
                  <Text style={styles.UpdatedDate}>Updated Date</Text>
                  <Text style={styles.createDtText}>{ticket.updated_date}</Text>
                </View>
              </View>
              <View style={styles.statusFooter}>
                <View style={styles.lastUpdatedRow}>
                  <Text style={styles.Status_LastUpdated}>Last updated:</Text>
                  <Text style={styles.statusLastUpdatedValue}>
                    {' '}{ticket.updated_date}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: ticket.status === 'Closed' ? '#E0E0E0' : '#E8F5E9' }
                ]}>
                  <Text style={[
                    styles.statusValue,
                    { color: ticket.status === 'Closed' ? '#616161' : '#2E7D32' }
                  ]}>
                    {ticket.status || 'Pending'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Grey1F,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  CardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  StatusCard: {
    width: '18%',
    height: responsiveHeight(7),
    backgroundColor: Colors.RedColorDark,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  cardCount: {
    fontSize: responsiveFontSize(2.3),
    color: Colors.WhiteF,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.4),
    color: Colors.WhiteF,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    elevation: 3,
    width: '100%', // Set width to 100%
    alignSelf: 'center', // Center horizontally
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  ticketNo: {
    color: Colors.RedDarkF,
    fontWeight: 'bold',
    marginRight: responsiveWidth(2),
    fontSize: responsiveFontSize(1.8),
  },
  assignValue: {
    color: Colors.Grey2F,
    fontWeight: 'bold',
    marginRight: responsiveWidth(2),
    fontSize: responsiveFontSize(1.8),
  },
  description: {
    color: Colors.blackF,
    fontSize: responsiveFontSize(2.0),
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 24,
  },
  label: {
    color: Colors.Grey3F,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.8),
  },
  CreatedDate: {
    color: 'black',
    marginRight: responsiveWidth(2),
    fontWeight: '800',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
  },
  UpdatedDate: {
    color: 'black',
    fontWeight: '800',
    paddingLeft: responsiveWidth(5),
    fontSize: responsiveFontSize(1.8),
  },
  rowCardCreatedt: {
    flexDirection: 'row',
    backgroundColor: Colors.LitPinkF,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
  },
  createDtText: {
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(1.7),
    padding: 5,
    width: '100%',
    textAlign: 'center',
  },
  statusValue: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '800',
  },
  StatusLabel: {
    color: Colors.blackF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  divider: {
    height: '100%',
    width: responsiveWidth(0.3),
    backgroundColor: Colors.Grey3F,
  },
  ticketContainer: {
    marginBottom: responsiveHeight(2),
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.RedDarkF,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  statusFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  lastUpdatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Status_LastUpdated: {
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
  },
  statusLastUpdatedValue: {
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
});

export default WaitingOnMe;
