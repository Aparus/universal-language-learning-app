import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Button, Text } from 'react-native-elements'
import Slider from '@react-native-community/slider'
import { formatSecondsToTime } from './utils'
import styles from '../../styles'

const {
	layout: { playerControls: layoutStyles }
} = styles || {} // layout styles

export default function PhrasalPlayerControls(props) {
	const { player, isPlaying, currentTime = 0, duration = 100, rate } = props

	const { secondsInterval } = player || {}
	const { start, end } = secondsInterval || {}

	const handlePlay = () => {
		player.play()
	}
	const handlePause = () => {
		player.pause()
	}
	const handlePlayPlus10 = () => {
		player.playPlus10()
	}
	const handlePlayMinus10 = () => {
		player.playMinus10()
	}
	const handleChangeRate = () => {
		player.changeRate()
	}
	const handleSeekStart = () => {
		player.seekStart()
	}
	const handleSeek = time => {
		player.seek(time)
	}

	// useEffect(() => {
	// 	return () => {
	// 		player.unload()
	// 	}
	// }, [])
	const curTime = secondsInterval ? currentTime - start : currentTime
	const durTime = secondsInterval ? end - start : duration

	const currentTimeFormatted = formatSecondsToTime(curTime)
	const durationFormatted = duration ? formatSecondsToTime(durTime) : ''

	const TimeIndicator = (
		<View>
			<Text style={layoutStyles.timingText}>
				{currentTimeFormatted} / {durationFormatted}
			</Text>
		</View>
	)

	const SpeedChangeButton = (
		<TouchableOpacity onPress={handleChangeRate}>
			<Text style={layoutStyles.speedChangeButtonText}>x{rate}</Text>
		</TouchableOpacity>
	)

	const playerButton = (buttonType, onPressHandler) => (
		<Button
			onPress={onPressHandler}
			{...layoutStyles.generalButtonProps}
			{...layoutStyles[`${buttonType}ButtonProps`]}
		/>
	)

	const PlayerButtons = (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-around'
			}}
		>
			{playerButton('playBack', handlePlayMinus10)}

			{isPlaying
				? playerButton('pause', handlePause)
				: playerButton('play', handlePlay)}

			{playerButton('playForward', handlePlayPlus10)}
		</View>
	)

	return (
		<View>
			<Slider
				minimumValue={start || 0}
				value={currentTime ? currentTime : 0}
				maximumValue={end || duration || 100}
				onSlidingStart={() => handleSeekStart()}
				onSlidingComplete={value => handleSeek(value)}
				style={layoutStyles.slider}
				{...layoutStyles.sliderProps}
			/>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingLeft: 10
					// paddingRight: 10
				}}
			>
				<View style={{ flex: 1 }}>{TimeIndicator}</View>
				<View style={{ flex: 2 }}>{PlayerButtons}</View>
				<View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
					{SpeedChangeButton}
				</View>
			</View>
		</View>
	)
}
