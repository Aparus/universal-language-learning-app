import React from 'react'
import {
	ScrollView,
	View,
	TouchableOpacity,
	Alert,
	useWindowDimensions
} from 'react-native'
import { Image, Header, colors, Text } from 'react-native-elements'
import marked from 'marked'
import HTML from 'react-native-render-html'
import audios from '../../../assets/audios'
import { playAudio } from '../../utils/media'
import { convertInTextShortcutIntoTags } from '../../utils/manageTextContent'

function InText(props) {
	const {
		subchapterDoc,
		subchapterTrDoc = {},
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const { content } = subchapterDoc

	let html = marked(content)
	const contentWidth = useWindowDimensions().width

	const handlePress = (text, path) => () => {
		const fileName = path || text
		playAudio(fileName, audios['intext'])
	}

	html = convertInTextShortcutIntoTags(html)

	const inTextRenderer = htmlAttribs => {
		const { text, path } = htmlAttribs
		return (
			<Text
				onPress={handlePress(text, path)}
				style={[globalStyles.body2, { color: 'darkblue' }]}
				key={`intext-${text}`}
			>
				{text}
			</Text>
		)
	}

	return (
		<View>
			<HTML
				renderers={{ intext: { renderer: inTextRenderer, wrapper: 'Text' } }}
				html={html}
				contentWidth={contentWidth}
			/>
		</View>
	)
}

export default InText
