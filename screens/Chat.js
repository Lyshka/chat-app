import {
	useState,
	useEffect,
	useLayoutEffect,
	useCallback
} from "react"
import {TouchableOpacity, Text} from "react-native";
import {GiftedChat} from "react-native-gifted-chat";
import {
	collection,
	addDoc,
	orderBy,
	query,
	onSnapshot
} from "firebase/firestore"
import {signOut} from "firebase/auth"
import {auth, database} from "../config/firebase"
import {useNavigation} from "@react-navigation/native"
import {AntDesign} from "@expo/vector-icons"
import colors from "../colors"

const Chat = () => {
	const [messages, setMessages] = useState([])
	const navigation = useNavigation()

	const onSignOut = () => {
		signOut(auth).catch(error => console.log(error))
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity style={{
					marginRight: 10
				}}
					onPress={onSignOut}
				>
					<AntDesign
						name="logout"
						size={24}
						color={colors.gray}
						style={{
							marginRight: 10
						}}
					/>
				</TouchableOpacity>
			)
		})
	}, [navigation])

	useLayoutEffect(() => {
		const collectionRef = collection(database, "chats")
		const q = query(collectionRef, orderBy("createdAt", "desc"))

		const unsubscribe = onSnapshot(q, snapshot => {
			console.log("snap")

			setMessages(snapshot.docs.map(doc => ({
				_id: doc.id,
				createdAt: doc.data().createdAt.toDate(),
				text: doc.data().text,
				user: doc.data().user
			})))
		})

		return unsubscribe
	}, [])

	const onSend = useCallback((messages = []) => {
		setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

		const {_id, createdAt, text, user} = messages[0]

		addDoc(collection(database, "chats"), {
			_id,
			createdAt,
			text,
			user
		})
	}, [])

	return (
		<GiftedChat
			messages={messages}
			onSend={messages => onSend(messages)}
			user={{
				_id: auth?.currentUser?.email,
				avatar: 'https://i.pravatar.cc/300'
			}}
		/>
	)
}

export default Chat