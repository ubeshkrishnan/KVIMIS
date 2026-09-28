import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
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
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown';

const AllTicket = () => {
  const { userLoginData } = useContext(DataContext);

  const [tickets, setTickets] = useState([]);
  const [topCardsData, setTopCardsData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [roomNoData, setRoomNoData] = useState([]);
  const [ticketTypes, setSelectedTicketType] = useState('');
  const [severity, setSeverity] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomNo, setSelectedRoomNo] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Static Dropdowns
  const ticketTypesValue = [
    { id: 2, name: 'Adhoc' },
    { id: 3, name: 'Routine' },
    { id: 1, name: 'Strategic' },
  ];

  const severityTypesValue = [
    { id: 1, value: 'Critical' },
    { id: 2, value: 'High' },
    { id: 3, value: 'Medium' },
    { id: 4, value: 'To Be Done In Future' },
    { id: 5, value: 'Done' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch(
          Url + `/my_all_ticket?user_id=${userLoginData.user_id}`,
        );
        if (!response.ok) {
          throw new Error('Network response for total paid fee was not ok');
        }
        const data = await response.json();
        if (data && data.data) {
          setTickets(data.data);
        } else {
          setTickets([]);
        }

        if (data && data.final) {
          const finalDataArray = Object.entries(data.final).map(
            ([title, count]) => ({
              title,
              count,
            }),
          );
          setTopCardsData(finalDataArray);
        } else {
          setTopCardsData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };



    fetchData();
  }, [userLoginData]);

  const fetchRoomNoData = () => {
    if (!selectedBlockId) {
      return;
    }

    authenticatedFetch(Url + `/get_room_no?block_id=${selectedBlockId}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRoomNoData(data);
        } else {
          console.error('Room data is not an array:', data);
          setRoomNoData([]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching room data:', error);
        setRoomNoData([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // fetchRoomNoData(); // Blocked until block selection logic is clarified or removed
  }, []);

  // Validation functions
  const isTitleValid = () => title.trim() !== '';
  const isDescriptionValid = () => description.trim() !== '';
  const isTagSelected = () => selectedTag !== null;
  const isTicketTypeSelected = () => !!ticketTypes;
  const isRoomSelected = () => selectedRoomNo !== '';
  const isSeveritySelected = () => severity !== '';

  // Function to check overall form validity
  const validateForm = () => {
    return (
      isTitleValid() &&
      isDescriptionValid() &&
      isTagSelected() &&
      isTicketTypeSelected() &&
      isRoomSelected() &&
      isSeveritySelected()
    );
  };
  // useEffect to update form validity whenever any relevant state changes
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [
    title,
    description,
    selectedTag,
    ticketTypes,
    selectedRoomNo,
    severity,
  ]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      return; // Don't submit if the form is invalid
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('tags[]', selectedTag);
      formData.append('ticket_title', title);
      formData.append('ticket_type_id', ticketTypes.id);
      formData.append('rooms', selectedRoomNo); // Use selectedRoomNo here
      formData.append('severity', severity);
      formData.append('status', '1');
      formData.append('userrole', userLoginData.users_role_id);
      formData.append('users', '2252');
      formData.append('description', description);
      formData.append('created_date', new Date().toISOString());
      formData.append('created_by', userLoginData.user_id);
      formData.append('is_logged_in', '1');

      const response = await authenticatedFetch(
        `${Url}/save_ticket?user_id=${userLoginData.user_id}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      // console.log('FORM', formData);
      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      setIsLoading(false); // Hide loader
      setIsModalVisible(false); // Close modal
      // Reset form fields
      setTitle('');
      setDescription('');
      setSelectedTag('');
      setSelectedTicketType('');
      setSelectedRoomNo('');
    } catch (error) {
      console.error('Error creating ticket:', error);
      setIsLoading(false); // Hide loader in case of error
    }
  };

  const handleCancel = () => {
    // Reset all state variables to their initial values
    setTitle('');
    setDescription('');
    setSelectedTag(''),
      setSelectedTicketType(''),
      setSelectedRoomNo(''),
      setIsModalVisible(false);
  };

  const ModalPopup = () => {
    setIsModalVisible(true);
  };

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
                    {ticket.status || 'New'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* <TouchableOpacity onPress={ModalPopup} style={styles.addButton}>
        <MaterialCommunityIcons name="plus" color={Colors.WhiteF} size={30} />
      </TouchableOpacity> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View onPress={() => setIsModalVisible(false)}>
              <Text style={styles.ModalLabel}>Tags :</Text>
              <SelectDropdown
                data={Array.isArray(tags) ? tags.map(tag => tag.tag_name) : []}
                onSelect={(selectedItem, index) =>
                  setSelectedTag(tags[index] ? tags[index].tag_id : null)
                }
                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                rowTextForSelection={(item, index) => item}
                buttonStyle={styles.dropdownButton}
              />

              <Text style={styles.ModalLabel}>Title:</Text>
              <TextInput
                style={styles.textInputAssign}
                onChangeText={text => setTitle(text)}
                value={title}
              />

              <View>
                <Text style={styles.ModalLabel}>Ticket types:</Text>
                <SelectDropdown
                  data={ticketTypesValue}
                  defaultButtonText="Select Ticket Type"
                  onSelect={(selectedItem, index) =>
                    setSelectedTicketType(selectedItem)
                  }
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem.name
                  }
                  buttonStyle={styles.dropdownButton}
                  rowTextForSelection={(item, index) => item.name}
                />
              </View>


              <Text style={styles.ModalLabel}>Room No:</Text>
              <SelectDropdown
                data={Array.isArray(roomNoData) ? roomNoData.map(roomData => roomData.room_no) : []}
                onSelect={
                  (selectedItem, index) =>
                    setSelectedRoomNo(roomNoData[index] ? roomNoData[index].id_room : null) // Use id_room here
                }
                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                rowTextForSelection={(item, index) => item}
                buttonStyle={styles.dropdownButton}
              />

              <Text style={styles.ModalLabel}>Status:</Text>
              <TextInput
                style={[styles.textInputAssign, styles.hiddenInput]}
                value="NEW"
                editable={false}
              />

              <Text style={styles.ModalLabel}>Severity:</Text>
              <SelectDropdown
                data={severityTypesValue}
                defaultButtonText="Select Severity"
                onSelect={(selectedItem, index) => setSeverity(selectedItem.id)}
                buttonTextAfterSelection={(selectedItem, index) =>
                  selectedItem.value
                }
                buttonStyle={styles.dropdownButton}
                rowTextForSelection={(item, index) => item.value}
              />

              <Text style={styles.ModalLabel}>User Role:</Text>
              <TextInput
                style={[styles.textInputAssign, styles.hiddenInput]}
                value="Principal"
                editable={false}
              />
              <Text style={styles.ModalLabel}>Assign To:</Text>
              <TextInput
                style={[styles.textInputAssign, styles.hiddenInput]}
                value="Vidhya M"
                editable={false}
              />
              <Text style={styles.ModalLabel}>Description:</Text>
              <TextInput
                style={[styles.textInputAssign, styles.textarea]}
                // label="Description"
                multiline={true}
                numberOfLines={4}
                onChangeText={text => setDescription(text)}
                value={description}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[
                    styles.buttonSubmit,
                    isFormValid ? {} : styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={!isFormValid}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                <Text style={styles.buttonClose} onPress={handleCancel}>
                  Cancel
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
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
    fontSize: responsiveFontSize(2),
    color: Colors.WhiteF,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.3),
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
    fontWeight: '900',
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
    fontSize: responsiveFontSize(2),
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
  statusValue: {
    color: 'green',
    fontWeight: 'bold',
  },
  StatusLabel: {
    color: Colors.blackF,
    fontWeight: 'bold',
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
    marginTop: 30,
    width: 50,
    height: 50,
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
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
  },
  statusLastUpdatedValue: {
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(1.4),
    fontWeight: '700',
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
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%', // Adjust width as needed
    alignSelf: 'center',
    marginTop: '20%',
    marginBottom: '20%',
  },
  disabledButton: {
    opacity: 0.8,
  },
  textInputAssign: {
    backgroundColor: Colors.WhiteF,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.Grey2F,
    marginBottom: 20, // Adjust spacing
    paddingVertical: 10, // Adjust padding
    paddingHorizontal: 15, // Adjust padding
    fontWeight: 'bold',
  },
  textarea: {
    height: 100, // Set a fixed height for the textarea
    textAlignVertical: 'top', // Align text to the top
    paddingTop: 10, // Add some padding at the top for better appearance
  },
  buttonSubmit: {
    backgroundColor: Colors.RedColorDark,
    color: Colors.WhiteF,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10, // Reduce this value to decrease the space between buttons
    marginRight: 10, // Reduce this value to decrease the space between buttons
  },
  buttonClose: {
    backgroundColor: Colors.Grey3F,
    color: Colors.WhiteF,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonText: {
    color: Colors.WhiteF,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
  },
  radioButton: {
    marginBottom: 10, // Adjust spacing between radio buttons
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: 'black',
    width: '100%', // Adjust width
    marginBottom: 20, // Adjust spacing
  },
  dropdownButtonText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownIcon: {
    fontSize: 16,
    color: 'black',
  },
  dropdownContainer: {
    width: '40%',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: '#fff',
    color: 'black',
  },
  dropdownRow: {
    padding: 10,
    backgroundColor: '#fff',
    color: 'black',
  },
  ModalLabel: {
    color: Colors.blackF,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  successMessage: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AllTicket;
