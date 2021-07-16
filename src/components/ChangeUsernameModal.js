import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { closeUsernameChangeModal } from "../redux/actions/Modals";

const ChangeUsernameModal = () => {
	const modalVisible = useSelector((state) => state.usernameChangeModalReducer);
	const dispatch = useDispatch();

	return (
		<View style={styles.centeredView}>
			<Modal
				animationType="slide"
				transparent={false}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.");
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Edit Username</Text>
						<Pressable
							style={[styles.button, styles.buttonClose]}
							onPress={() => dispatch(closeUsernameChangeModal())}
						>
							<Text style={styles.textStyle}>Hide Modal</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});

export default ChangeUsernameModal;
