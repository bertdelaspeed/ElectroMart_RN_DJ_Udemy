import { Text, View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/screens/HomeScreen";
import FavoriteItemsScreen from "./src/screens/FavoriteItemsScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import CartScreen from "./src/screens/CartScreen";
import { Ionicons } from "@expo/vector-icons";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "./store";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeStack" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              backgroundColor: "#4B5563",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Favorite") {
                iconName = focused ? "heart" : "heart-outline";
              } else if (route.name === "Cart") {
                iconName = focused ? "cart" : "cart-outline";
              } else if (route.name === "Orders") {
                iconName = focused ? "list" : "list-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "black",
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ tarBarLabel: "Home" }}
          />
          <Tab.Screen
            name="Favorite"
            component={FavoriteItemsScreen}
            options={{ tarBarLabel: "Favorite" }}
          />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{ tarBarLabel: "Cart" }}
          />
          <Tab.Screen
            name="Orders"
            component={OrdersScreen}
            options={{ tarBarLabel: "Orders" }}
          />
        </Tab.Navigator>
        <Toast />
      </Provider>
      <StatusBar barStyle={"dark-content"} />
    </NavigationContainer>
  );
}
