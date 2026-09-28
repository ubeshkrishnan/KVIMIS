import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Color';
import {SearchBar} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {DataContext} from '../../context/DataContext';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';
import {globalStyles} from '../../GlobalStyles';
import Octicons from 'react-native-vector-icons/Octicons';

const Library = () => {
  const {userLoginData} = useContext(DataContext);
  const [bookData, setBookData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLibraryData(userLoginData.user_id);
  }, []);

  const fetchLibraryData = () => {
    authenticatedFetch(Url + `/library?user_id=${userLoginData.user_id}`)
      .then(response => response.json())
      .then(data => {
        // console.log('LIBss', data);
        setBookData(data.book_transactions || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  };

  const handleSearch = text => {
    setSearchQuery(text);
  };

  // Safely filter bookData if it's not undefined or null
  const filteredBookData = Array.isArray(bookData)
    ? bookData.filter(book => {
        const title = book.title || ''; // Fallback to empty string if title is undefined
        const authorName = book.author_name || ''; // Fallback to empty string if author_name is undefined
        const accessionNo = book.accession_no || ''; // Fallback to empty string if accession_no is undefined

        return (
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          accessionNo.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : [];
//  console.log('bookData: ', bookData)
  return (
    <>
      <View style={styles.container}>
        <SearchBar
          placeholder="Search Books..."
          placeholderTextColor="#999"
          inputContainerStyle={styles.searchBarInputContainer}
          containerStyle={styles.searchBarContainer}
          searchIcon={{ name: 'search', color: Colors.RedColorDark }}
          clearIcon={{ name: 'close', color: Colors.Grey3F }}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {isLoading ? ( // Render loader if isLoading is true
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={Colors.RedColorDark}
        />
      ) : filteredBookData.length === 0 ? ( // Check if filteredBookData is empty
        <View style={globalStyles.noDataContainer}>
          <Octicons name="alert" size={21} color={Colors.sandalF} />
          <Text style={globalStyles.noDataText}>NO DATA AVAILABLE</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {filteredBookData.map((book, index) => (
            <View key={index} style={styles.whiteCard}>
              <View style={styles.contentRow}>
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    name="book-open-page-variant"
                    size={responsiveFontSize(5)}
                    color={Colors.WhiteF}
                  />
                </View>
                <View style={styles.headerInfo}>
                  <View style={styles.topRow}>
                    <Text style={styles.DateOrder}>
                      Acc No: {book.accession_no}
                    </Text>
                    <View style={styles.fineBadge}>
                      <Text style={styles.fineText}>
                        Fine: ₹{book.fine || '0.00'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.BookSub} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <Text style={styles.Author} numberOfLines={1}>
                    Author : {book.author_name}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.DateSingle}>
                  <Text style={styles.infoTextHeader}>ISSUE DATE</Text>
                  <Text style={styles.infoText}>{book.date_issued}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.DateSingle}>
                  <Text style={styles.infoTextHeader}>DUE DATE</Text>
                  <Text style={styles.infoText}>{book.due_date}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.DateSingle}>
                  <Text style={styles.infoTextHeader}>RETURNED</Text>
                  <Text style={[styles.infoText, { color: book.date_returned ? Colors.GreenColorF : Colors.Grey3F }]}>
                    {book.date_returned || '-'}
                  </Text>
                </View>
              </View>

              <View style={styles.statusFooter}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: book.status === 'Returned' ? '#E8F5E9' : '#FFF3E0' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: book.status === 'Returned' ? '#2E7D32' : '#EF6C00' }
                  ]}>
                    {book.status || 'Active'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(1),
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: responsiveWidth(4),
  },
  searchBarInputContainer: {
    backgroundColor: Colors.WhiteF,
    borderRadius: 10,
    height: 45,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  whiteCard: {
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(2),
    padding: 15,
    backgroundColor: Colors.WhiteColor,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  iconWrapper: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: 12,
    backgroundColor: Colors.RedColorDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  DateOrder: {
    color: Colors.RedColorDark,
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
  },
  fineBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fineText: {
    color: Colors.RedDarkF,
    fontWeight: '800',
    fontSize: responsiveFontSize(1.9),
  },
  BookSub: {
    fontSize: responsiveFontSize(2),
    color: Colors.blackF,
    fontWeight: '800',
    lineHeight: 24,
  },
  Author: {
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(1.6),
    fontStyle: 'italic',
    marginTop: 2,
  },
  infoRow: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  DateSingle: {
    flex: 1,
    alignItems: 'center',
  },
  infoTextHeader: {
    color: Colors.Grey3F,
    fontSize: responsiveFontSize(1.3),
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    color: Colors.blackF,
    fontWeight: '800',
    fontSize: responsiveFontSize(1.6),
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#DDD',
  },
  statusFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '800',
  },
  loader: {
    marginTop: 50,
  },
});

export default Library;
