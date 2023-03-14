<template>
	<svg
		class="svg-hex"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		:viewBox="viewBox">
		<polygon
			vector-effect="non-scaling-stroke"
			:points="pointyHexPolygon(center, hexHeight)" />
	</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { times } from 'lodash-es'

const sides = 6
const hexHeight = 10

const hexWidth = computed(() => hexHeight * (Math.sqrt(3) / 2))

const center = { x: -hexWidth.value / 2, y: -hexHeight / 2 }

const viewBox = computed(
	() =>
		`-${toSigDigits(hexHeight)} -${toSigDigits(hexWidth.value)} ${toSigDigits(
			hexHeight
		)} ${toSigDigits(hexWidth.value)}`
)

function toSigDigits(value: number) {
	return Number(value.toFixed(2))
}

// cribbed from https://www.redblobgames.com/grids/hexagons/
function pointyHexCorner(center: Point, radius: number, index: number): Point {
	const angleDegrees = 60 * index - 30
	const angleRadius = (Math.PI / 180) * angleDegrees
	return {
		x: toSigDigits(center.x + radius * Math.cos(angleRadius)),
		y: toSigDigits(center.y + radius * Math.sin(angleRadius))
	}
}

function pointyHexPolygon(center: Point, height: number) {
	const radius = height / 2
	const points = times(sides, (i) => pointyHexCorner(center, radius, i))
	const pointsString = points.map((point) => `${point.x},${point.y}`).join(' ')
	return pointsString
