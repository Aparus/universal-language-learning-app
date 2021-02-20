import React, { useRef, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import PhraseWrapper from './PhraseWrapper'

export default function PhrasesBlock(props) {
	const {
		phrasesArray,
		phrasesTrArray,
		playerRef: { current: phrasalPlayer },
		currentPhraseNum,
		showTranslation,
		trLang
	} = props

	const scrollViewRef = useRef() // we will scroll it scrollTo({y})
	const phrasesPositionYRef = useRef([]) // array of  Y coordinates for scroll to them

	useEffect(() => {
		const y = phrasesPositionYRef.current[currentPhraseNum]
		scrollViewRef.current.scrollTo({
			y,
			animated: true
		})
		return () => {}
	}, [currentPhraseNum])

	const handlePlayPhrase = phraseNum => () => {
		phrasalPlayer.playPhrase(phraseNum)
	}
	const onPhraseLayout = index => ({
		nativeEvent: {
			layout: { /* x, */ y /* width, height */ }
		}
	}) => {
		phrasesPositionYRef.current[index] = y
	}

	return (
		<ScrollView ref={scrollViewRef} nestedScrollEnabled>
			<View style={{ marginBottom: 5 }}>
				{phrasesArray.map((elem, index) => {
					const { text, voiceName } = elem
					const { text: trText, voiceName: voiceNameTr } =
						phrasesTrArray[index] || {}
					const phraseNum = index

					return (
						index > 0 && (
							<PhraseWrapper
								key={`phrase-${phraseNum}`}
								{...{
									/* voice:  */
									voiceName,
									voiceNameTr,
									/* phrase: */
									text,
									currentPhraseNum,
									phraseNum,
									trLang,
									trText,
									showTranslation,
									/* event handlers */
									onPhraseLayout,
									handlePlayPhrase
								}}
							/>
						)
					)
				})}
			</View>
		</ScrollView>
	)
}