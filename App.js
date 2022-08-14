import react, {useState, createContext, useContext, useEffect} from "react";
import { View, ActivityIndicator } from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";

import Chat from "./screens/Chat";
import Login from "./screens/Login";
import Signup from "./screens/Signup"
import Home from "./screens/Home"
import {auth} from "./config/firebase";
import {async} from "@firebase/util";

const Stack = createStackNavigator()
const AuthenticatedUserContext = createContext({})

const AuthenticatedUserProvider = ({children}) => {
	const [user, setUser] = useState(null)

	return (
		<AuthenticatedUserContext.Provider value={{user, setUser}}>
			{children}
		</AuthenticatedUserContext.Provider>
	)
}

const ChatStack = () => {
	return (
		<Stack.Navigator defaultScreenOptions={Home}>
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="Chat" component={Chat} />
		</Stack.Navigator>
	)
}

const AuthStack = () => {
	return (
		<Stack.Navigator defaultScreenOptions={Login} screenOptions={{headerShown: false}}>
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Signup" component={Signup} />
		</Stack.Navigator>
	)
}

const RootNavigator = () => {
	const {user, setUser} = useContext(AuthenticatedUserContext)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth,
			async authenticatedUser => {
				authenticatedUser ? setUser(authenticatedUser) : setUser(false)
				setLoading(false)
			})
		
		return () => unsubscribe()
	}, [user])

	if (loading) {
		return (
			<View style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center"
			}}>
				<ActivityIndicator size={"large"}/>
			</View>
		)
	}

	return (
		<NavigationContainer>
			{user ? <ChatStack /> : <AuthStack />}
		</NavigationContainer>
	)
}

const App = () => {
	return (
		<AuthenticatedUserProvider>
			<RootNavigator />
		</AuthenticatedUserProvider>
	)
}

export default App