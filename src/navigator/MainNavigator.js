import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
const LazyHome = React.lazy(() => import('../(StudentDashboard)/Home/Home'));
import Login from '../(StudentDashboard)/Login/Login';
const LazyTimeTable = React.lazy(() =>
  import('../(StudentDashboard)/TimeTable/TimeTable'),
);
import Attendance from '../(StudentDashboard)/Attendance/Attendance';
import Calendar from '../(StudentDashboard)/Calendar/Calendar';
import Complete from '../(StudentDashboard)/Course/Complete';
import Current from '../(StudentDashboard)/Course/Current';
import Future from '../(StudentDashboard)/Course/Future';
import Eschedule from '../(StudentDashboard)/ExamSchedule.js/E-schedule';
import FeeDetails from '../(StudentDashboard)/Fees/FeeDetails';
import Library from '../(StudentDashboard)/Library/Library';
import Results from '../(StudentDashboard)/Results/Results';
import Profile from '../(StudentDashboard)/Profile/Profile';
import LessonPlan from '../(StudentDashboard)/TimeTable/LesssonPlan';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Cafeteria from '../(StudentDashboard)/Cafeteria/Cafeteria';
// import CustomDrawerContent from './CustomDrawerContent';
// import Search from '../(StudentDashboard)/Search/Search';
import { Text } from 'react-native-paper';
import Miscellaneous from '../(StudentDashboard)/Miscellaneous/Miscellaneous';
import PersonalInfo from '../(StudentDashboard)/Miscellaneous/PersonalInfo';
import EducationDetail from '../(StudentDashboard)/Miscellaneous/EducationDetail';
import Grevience from '../(StudentDashboard)/Grevience/Grevience';
import Survey from '../(StudentDashboard)/Survey/Survey';
import Dashboard from '../(StudentDashboard)/DashboardMain/Dashboard';
import DashboardHostel from '../(StudentDashboard)/DashboardMain/DashboardHostel';
import HostelCard from '../(StudentDashboard)/Hostel/Hostel';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../Color';
// TICKet TOP
import AllTicket from '../(StudentDashboard)/Tickets/AllTicket';
import WaitingOnMe from '../(StudentDashboard)/Tickets/WaitingOnMe';
import MyOpen from '../(StudentDashboard)/Tickets/MyOpen';
import CustomHeader from './CustomHeader';
import LogoutComponent from './LogoutComponent';

const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const TopBarNavigator = () => {
  // Dummy data for number of cards
  const [completeCount, setCompleteCount] = useState();
  const [currentCount, setCurrentCount] = useState();
  const [futureCount, setFutureCount] = useState();

  useEffect(() => {
    // Fetch the counts of cards for each section
    // Update completeCount, currentCount, and futureCount states accordingly
  }, []);

  // Custom component to render tabBarLabel with card count
  const TabBarLabelWithCount = ({ label, count }) => (
    <View style={styles.tabBarLabelContainer}>
      <Text style={styles.tabBarLabelText}>{label}</Text>
      {/* <View style={styles.countContainer}>
        <Text style={styles.countText}>{count}</Text>
      </View> */}
    </View>
  );

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.RedDarkF,
        tabBarInactiveTintColor: Colors.Grey2F,
        tabBarStyle: { backgroundColor: Colors.WhiteF },
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}>
      <TopTab.Screen
        name="Current"
        component={Current}
        options={{
          tabBarLabel: 'CURRENT',
        }}
      />
      <TopTab.Screen
        name="Complete"
        component={Complete}
        options={{
          tabBarLabel: 'COMPLETED',
        }}
      />
      <TopTab.Screen
        name="Future"
        component={Future}
        options={{
          tabBarLabel: 'FUTURE',
        }}
      />
    </TopTab.Navigator>
  );
};

function MiscellaneousTopBarNavigator() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.RedDarkF,
        tabBarInactiveTintColor: Colors.Grey2F,
        tabBarStyle: { backgroundColor: Colors.WhiteF },
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}>
      <TopTab.Screen
        name="MiscellaneousMain"
        component={Miscellaneous}
        options={{
          tabBarLabel: 'Miscellaneous',
        }}
      />
      <TopTab.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{
          tabBarLabel: 'Personal Info',
        }}
      />
      <TopTab.Screen
        name="EducationDetails"
        component={EducationDetail}
        options={{
          tabBarLabel: 'Education Details',
        }}
      />
    </TopTab.Navigator>
  );
}
function TicketTopBarNavigator() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.RedColorDark,
        tabBarInactiveTintColor: Colors.Grey2F,
        tabBarStyle: { backgroundColor: Colors.WhiteF },
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}>
      <TopTab.Screen
        name="WaitingOnMe"
        component={WaitingOnMe}
        options={{
          tabBarLabel: 'Waiting On Me',
        }}
      />
      <TopTab.Screen
        name="MyOpen"
        component={MyOpen}
        options={{
          tabBarLabel: 'My Open',
        }}
      />

      <TopTab.Screen
        name="Ticketss"
        component={AllTicket}
        options={{
          tabBarLabel: 'All Tickets',
        }}
      />
    </TopTab.Navigator>
  );
}

const BottomTabNavigator = ({ navigation }) => {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: true,
        tabBarStyle: {
          display: 'none', // This hides the tab bar
          backgroundColor: Colors.WhiteColor,
          height: 60,
        },
        tabBarLabelStyle: {
          color: Colors.RedColorDark,
          fontSize: 13,
          fontWeight: '700',
          elevation: 0,
        },
        headerStyle: {
          // KVIM header color
          backgroundColor: Colors.WhiteF,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: 'white',
        headerBackTitleVisible: false,
        headerRight: () => <LogoutComponent navigation={navigation} />,
      })}>
      <BottomTab.Screen
        name="KVIM"
        component={LazyHome}
        options={{
          header: ({ navigation }) => (
            <View style={{ backgroundColor: Colors.RedColorDark }}>
              <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.RedColorDark }} />
              <View style={{ backgroundColor: Colors.WhiteF, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 }}>
                <View style={{ flex: 1 }}>
                  <CustomHeader />
                </View>
                <LogoutComponent navigation={navigation} />
              </View>
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

// Define your MainContainer using Stack Navigator
function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login" // Set the initial route to BottomTabNavigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor:
              route.name === 'DashboardStack'
                ? Colors.RedColorDark
                : Colors.RedColorDark,
            // height: 100,
            borderBottomWidth: 0,
          },
          headerTintColor: 'white',
          headerBackTitleVisible: false,
        })}
        tabBarOptions={{
          activeTintColor: Colors.RedColor,
          inactiveTintColor: 'grey',
          showLabel: false,
        }}>
        <Stack.Screen
          name="DashboardStack"
          component={BottomTabNavigator}
          options={{
            headerRight: ({ navigation }) => (
              <LogoutComponent navigation={navigation} />
            ),
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HostelCard"
          component={HostelCard}
          options={{
            title: 'Outing Request',
          }}
        />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen
          name="Attendance"
          component={Attendance}
          options={{ title: 'Attendance', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calendar"
          component={Calendar}
          options={{
            title: 'Calendar',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="BottomHome"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LessonPlan"
          component={LessonPlan}
          options={{ title: 'Lesson-P' }}
        />
        <Stack.Screen
          name="Courses"
          component={TopBarNavigator}
          options={{ title: 'Courses', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Other Details"
          component={MiscellaneousTopBarNavigator}
          options={{
            title: 'Other Details',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Ticket"
          component={TicketTopBarNavigator}
          options={{
            title: 'Tickets',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="DashboardHostel" component={DashboardHostel} />
        <Stack.Screen
          name="Eschedule"
          component={Eschedule}
          options={{ title: 'Exam Schedule', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Fee Details"
          component={FeeDetails}
          options={{ title: 'Fee Details', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Library"
          component={Library}
          options={{ headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Results"
          component={Results}
          options={{ headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="TimeTable"
          component={LazyTimeTable}
          options={{ title: 'Time Table', headerTitleAlign: 'center' }}
        />
        <Stack.Screen name="Cafeteria" component={Cafeteria} />
        <Stack.Screen name="Grevience" component={Grevience} />
        <Stack.Screen name="Survey" component={Survey} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
const styles = StyleSheet.create({
  tabBarLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBarLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    color: Colors.RedColorDark,
  },
  countContainer: {
    backgroundColor: Colors.RedColorDark,
    borderRadius: 5, // Set border-radius for curved corners
    width: 22, // Set width
    height: 22, // Set height
    alignItems: 'center', // Center the count text horizontally
    justifyContent: 'center', // Center the count text vertically
  },
  countText: {
    color: Colors.WhiteF,
    fontWeight: 'bold',
    fontSize: 13,
    backgroundColor: Colors.RedColorDark,
  },
});
