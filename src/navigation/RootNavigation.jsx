import React, { useEffect } from 'react'
import HomeScreen from '../components/screens/HomeScreen'
import AboutScreen from '../components/screens/AboutScreen'
import TypographyScreen from '../components/screens/TypographyScreen'
import ChapterScreen from '../components/screens/ChapterScreen'
import DrawerContent from '../components/Drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import content from '../utils/content'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { setTranslation } from '../store/translationActions'
import globalStyles from '../config/globalStyles'

const Drawer = createDrawerNavigator()

const info = content.getInfo()
const translations = content.getTranslations() // list of available langs
const chapters = content.getChapterTitles()

const { language = '' } = info
const gStyles = globalStyles(language.toLocaleLowerCase())

export default function RootNavigation() {
	const dispatch = useDispatch()
	const { trLang } = useSelector(state => state.translation)

	const trChapters = content.getChapterTitlesTr(trLang)

	useEffect(() => {
		const getTranslationAsync = async () => {
			const trLang = await AsyncStorage.getItem('trLang')
			let showTranslation = await AsyncStorage.getItem('showTranslation')
			showTranslation =
				showTranslation === 'true' || showTranslation === null ? true : false
			dispatch(setTranslation({ trLang, showTranslation }))
		}
		getTranslationAsync()
		return () => {}
	}, [])

	return (
		<NavigationContainer>
			<Drawer.Navigator
				initialRouteName='Typography'
				drawerContent={props => (
					<DrawerContent
						{...props}
						chapters={chapters}
						trChapters={trChapters}
						info={info}
						globalStyles={gStyles}
					/>
				)}
			>
				<Drawer.Screen
					name='Home'
					component={HomeScreen}
					initialParams={{
						info: info,
						translations: translations,
						globalStyles: gStyles
					}}
				/>
				<Drawer.Screen
					name='About'
					component={AboutScreen}
					initialParams={{
						globalStyles: gStyles
					}}
				/>
				<Drawer.Screen name='Typography' component={TypographyScreen} />
				{chapters.map(elem => (
					<Drawer.Screen
						key={`lesson-${elem.id}`}
						name={elem.title}
						component={ChapterScreen}
						initialParams={{
							chapterId: elem.id,
							globalStyles: gStyles
						}}
					/>
				))}
			</Drawer.Navigator>
		</NavigationContainer>
	)
}
