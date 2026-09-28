import React, {useState, useEffect, useContext} from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../Color';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import {globalStyles} from '../../GlobalStyles';
import Octicons from 'react-native-vector-icons/Octicons';

const DashboardTicket = () => {
  const {userLoginData} = useContext(DataContext);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch(
          Url + `/get_tickets?user_id=${userLoginData.user_id}`,
        );
        if (!response.ok) {
          throw new Error('Network response for total paid fee was not ok');
        }
        const data = await response.json();
        // console.log('Ticket Data:', data);
        setTickets(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userLoginData.user_id]);

  return (
    <>
      <Text
        style={{
          color: Colors.Grey4F,
          fontSize: 20,
          paddingRight: 50,
          fontWeight: '800',
        }}>
        Ticket Waiting for my response
      </Text>
      <View style={styles.container}>
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
              <View style={{maxWidth: '100%'}}>
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
                <Text style={styles.StatusLabel}>Status : </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: ticket.status === 'Closed' ? '#E0E0E0' : '#E8F5E9' }
                ]}>
                  <Text style={[
                    styles.statusValue,
                    { color: ticket.status === 'Closed' ? '#616161' : '#2E7D32' }
                  ]}>
                    {ticket.status}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </>
  );
};

export default DashboardTicket;

const styles = StyleSheet.create({
  container: {
    borderRadius: responsiveWidth(5),
    margin: responsiveWidth(2),
    marginRight: responsiveWidth(5),
    padding: responsiveWidth(2),
    marginBottom: 1,
    color: Colors.blackF,
    height: 'auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
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
    fontSize: responsiveFontSize(2.2),
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 24,
  },
  label: {
    color: Colors.Grey3F,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.6),
  },
  CreatedDate: {
    color: 'black',
    marginRight: responsiveWidth(2),
    fontWeight: '800',
    textAlign: 'center',
  },
  UpdatedDate: {
    color: 'black',
    fontWeight: '800',
    paddingLeft: responsiveWidth(5),
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
    fontSize: responsiveFontSize(1.5),
    padding: 5,
    width: '100%',
    textAlign: 'center',
  },
  statusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusValue: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '800',
  },
  StatusLabel: {
    color: Colors.blackF,
    fontWeight: '700',
  },
  divider: {
    height: '100%',
    width: responsiveWidth(0.3),
    backgroundColor: Colors.Grey3F,
  },
  ticketContainer: {
    marginBottom: responsiveHeight(2),
  },
});
