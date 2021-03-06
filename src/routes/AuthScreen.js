import React, { useState } from "react";
import {
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
	ToastAndroid,
	Platform,
	ActivityIndicator,
} from "react-native";
import * as Google from "expo-google-app-auth";
import AppLoading from "expo-app-loading";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { useDispatch } from "react-redux";

import LogoComponent from "../components/LogoComponent";
import { onboardingGoogleInfo } from "../redux/actions/UserInfo";
import { routeToOnboarding, routeToMain } from "../redux/actions/Routing";
import { login } from "../redux/actions/Auth";
import { googleAuthConfig } from "../config/Config";
import { serverUrl } from "../config/Config";
import { setToken } from "../utils/AsyncStorage";
import handleTokenName from "../utils/TokenNameHandler";

const AuthScreen = () => {
	const [isLoading, setLoading] = useState(false);

	let dispatch = useDispatch();

	const handleLogin = async () => {
		setLoading(() => true);
		try {
			let message = await Google.logInAsync(googleAuthConfig);

			if (message.type === "success") {
				let { name, email, id, photoUrl } = message.user;
				fetch(serverUrl + "/api/v1/user/exists", {
					method: "post",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify({
						email,
						googleUid: id,
					}),
				})
					.then((res) => res.json())
					.then(async (data) => {
						if (data.type === "error") {
							if (data.status === 404) {
								dispatch(
									onboardingGoogleInfo({
										fullName: name,
										email: email,
										googleUid: id,
										profileImage: photoUrl,
									})
								);
								dispatch(routeToOnboarding());
								return;
							} else return ToastAndroid.show("Error!", ToastAndroid.SHORT);
						} else {
							let tokenSet = await setToken(
								handleTokenName("AUTH"),
								data.payload.jwtToken
							);
							if (tokenSet.error)
								return ToastAndroid.show("Error!", ToastAndroid.SHORT);

							dispatch(routeToMain());
							return dispatch(login());
						}
					})
					.catch((err) => ToastAndroid.show("Error!", ToastAndroid.SHORT));
			} else {
				return ToastAndroid.show("Popup Closed!", ToastAndroid.SHORT);
			}
		} catch (err) {
			return ToastAndroid.show("Error!", ToastAndroid.SHORT);
		} finally {
			setLoading(() => false);
		}
	};

	let [fontsLoaded] = useFonts({
		Poppins_400Regular,
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					{Platform.OS === "web" ? null : <LogoComponent size={50} />}
					<View style={styles.textContainer}>
						<Text style={styles.headingText}>polyevents</Text>
						<Text style={styles.subHeadingText}>Marketplace of events!</Text>
					</View>
				</View>
				<View style={styles.loginContainer}>
					<TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
						{/* TODO: Remove TouchableOpacity and add Pressable API */}
						{/* TODO: ADD LOADING SPINNER ON BUTTON AFTER CLICKING */}
						<Text style={styles.buttonText}>
							<Text>Continue with Google </Text>
						</Text>
					</TouchableOpacity>
					<Text style={styles.remarkText}>
						<Text>By registering, I agree to Polyevent's </Text>
						{/* TODO: Add a webview for T&C */}
						<Text style={styles.remarkTextUnderline}>T&C</Text>
					</Text>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		marginTop: 30,
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center",
		alignContent: "space-between",
	},
	headerContainer: {
		marginTop: 40,
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 30,
	},
	textContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	headingText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 42,
		marginTop: 20,
		color: "#1a1a1a",
	},
	subHeadingText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 16,
		color: "#1a1a1a",
	},
	loginContainer: {
		marginTop: 80,
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	loginButton: {
		backgroundColor: "#066786",
		width: 260,
		paddingTop: 14,
		paddingBottom: 14,
		paddingLeft: 6,
		paddingRight: 6,
		borderRadius: 10,
		marginBottom: 14,
		elevation: 4,
	},
	buttonText: {
		textAlign: "center",
		color: "white",
		fontFamily: "Poppins_400Regular",
		fontSize: 18,
	},
	buttonTextBold: {
		fontWeight: "bold",
		fontSize: 24,
	},
	remarkText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 14,
		color: "#1a1a1a",
	},
	remarkTextUnderline: {
		textDecorationLine: "underline",
		fontSize: 14,
		color: "#1a1a1a",
	},
});

export default AuthScreen;
