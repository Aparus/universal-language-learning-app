import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, ScrollView, View } from 'react-native'
import { Text, Image } from 'react-native-elements'
import { Header } from 'react-native-elements'
import { objectToArray } from '../utils'
import wordImages from '../assets/images/words'

export default function LessonScreen({ navigation, route }) {
	const {
		// name: lessonTitle,
		params: { lessonId, lessonDoc }
	} = route

	const { title = '', words: wordsObject = '', phrases: phrasesObject = '' } =
		lessonDoc || {}
	const words = objectToArray(wordsObject)
	const phrases = objectToArray(phrasesObject)
	return (
		<ScrollView>
			<StatusBar style='auto' />
			<Header
				rightComponent={{
					icon: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				centerComponent={{ text: title, style: { color: '#fff' } }}
			/>

			<View style={{ padding: 5 }}>
				<Text h2>Words</Text>
				{words.map(elem => {
					const image = wordImages[lessonId + '_' + elem.id]
					// console.log('image.getSize()', image.getSize())
					return (
						<View
							key={`word-${elem.id}`}
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: 20
							}}
						>
							{image && (
								<Image
									source={image}
									style={{ width: 100, height: 100, resizeMode: 'contain' }}
								/>
							)}
							<Text style={{ fontSize: 25 }}>{elem.text}</Text>
						</View>
					)
				})}
			</View>
			<View style={{ marginBottom: 20, padding: 5 }}>
				<Text h2>Phrases</Text>
				{phrases.map(elem => (
					<View
						key={`phrase-${elem.id}`}
						// style={{ display: 'flex', alignItems: 'center' }}
					>
						<Text style={{ fontSize: 25, marginTop: 10, marginRight: 20 }}>
							{elem.text}
						</Text>
					</View>
				))}
			</View>
		</ScrollView>
	)
}
