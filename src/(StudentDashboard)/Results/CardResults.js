import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import Colors from '../../Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Url} from '../../../Global_Variable/api_link';
import { authenticatedFetch } from '../../../Global_Variable/api_helper';

const CardResult = ({title, description, register_number}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState(null);
  const [registerNo, setRegisterNo] = useState(null);

  useEffect(() => {
    // Fetch the stored values from AsyncStorage
    const fetchDataFromStorage = async () => {
      try {
        const storedRegisterNo = await AsyncStorage.getItem('register_number');

        if (storedRegisterNo) {
          setRegisterNo(storedRegisterNo);
          // Now you can fetch the data from the API using the retrieved values
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchDataFromStorage();
  }, []);

  useEffect(() => {
    if (registerNo) {
      fetchResultData(registerNo);
    }
  }, [registerNo]);

  const fetchResultData = registerNo => {
    // Fetch data from your API using the provided register_number
    authenticatedFetch(Url + `/e_result?&register_number=${registerNo}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if description is defined and split it
  const descriptionLines = description ? description.split('\n') : [];

  // Extracting Mark Status if it's available
  const markStatusMatch =
    descriptionLines.length > 1
      ? descriptionLines[1].match(/Mark Status: ([^\n]+)/)
      : null;
  const markStatus = markStatusMatch ? markStatusMatch[1] : '';

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={toggleExpansion}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={{color: 'black', fontWeight: '600'}}>{title}</Title>
          </Card.Content>
        </Card>
      </TouchableOpacity>
      {isExpanded && (
        <Card style={[styles.card, styles.expandedCard]}>
          <Card.Content style={styles.descriptionContainer}>
            {descriptionLines.map((line, index) => (
              <Paragraph
                style={[
                  styles.description,
                  {color: 'black', backgroundColor: 'white'},
                  markStatus === 'Present'
                    ? styles.greenText
                    : markStatus === 'Absent'
                    ? styles.redText
                    : null,
                ]}
                key={`${index}-${register_number}`} // Combine index with another identifier for uniqueness
              >
                {line}
              </Paragraph>
            ))}

            {/* {data && (
                // Render additional data here
              )} */}
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
    color: 'black',
    // backgroundColor: '#E3E3E3',
  },
  card: {
    margin: 10,
    color: 'black',
    backgroundColor: 'white',
  },
  expandedCard: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  descriptionContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    fontSize: 17,
  },
  description: {
    marginBottom: 5,
    color: 'gray',
    fontWeight: '400',
    fontSize: 17,
  },
  redText: {
    color: 'red', // Change the color to red for absent mark status
  },
  greenText: {
    color: 'green', // Change the color to green for present mark status
  },
});

export default CardResult;
