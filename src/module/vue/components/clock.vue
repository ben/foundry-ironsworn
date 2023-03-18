<template>
	<svg
		class="clock"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		:height="size ?? '100px'"
		:width="size ?? '100px'"
		viewBox="-55 -55 110 110"
		:aria-readonly="props.readonly"
		:aria-valuenow="ticked"
		:aria-valuetext="`${ticked}⁄${wedges}`">
		<path
			v-for="(wedge, i) in segmentPaths"
			:key="wedge"
			:d="wedge"
			class="clock-segment svg"
			:aria-selected="props.ticked === i + 1"
			:data-tooltip="`${i + 1}⁄${wedges}`"
			:data-tooltip-direction="tooltipDirection(i + 1, wedges)"
			@click="click(i)"></path>
	</svg>
</template>

<script setup lang="ts">
import { inRange, mean } from 'lodash-es'
import { computed } from 'vue'
const R = 50

function pathString(wedgeIdx: number, numWedges: number) {
	const wedgeAngle = (2 * Math.PI) / numWedges
	const startAngle = wedgeIdx * wedgeAngle - Math.PI / 2
	const x1 = R * Math.cos(startAngle)
	const y1 = R * Math.sin(startAngle)
	const x2 = R * Math.cos(startAngle + wedgeAngle)
	const y2 = R * Math.sin(startAngle + wedgeAngle)

	return `M0,0 L${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} z`
}

// TODO: make this handle a bit more sensibly
/**
 * Picks a sensible tooltip position for a given wedge in a clock.
 */
function tooltipDirection(currentWedge: number, maxWedge: number) {
	let increment = 1 / maxWedge
	let start = currentWedge / maxWedge
	let end = start + increment
	let mid = mean([start, end])
	let breakPoints = [0.125, 0.375, 0.625, 0.875]
	switch (true) {
		case inRange(mid, 0, breakPoints[0]): {
			return 'UP'
		}
		case inRange(mid, breakPoints[0], breakPoints[1]): {
			return 'RIGHT'
		}
		case inRange(mid, breakPoints[1], breakPoints[2]): {
			return 'DOWN'
		}
		case inRange(mid, breakPoints[2], breakPoints[3]): {
			return 'LEFT'
		}
		case inRange(mid, breakPoints[3], 1): {
			return 'UP'
		}
		default:
			return 'UP'
	}
}

const props = withDefaults(
	defineProps<{
		/**
		 * The total number of segments
		 */
		wedges: number
		/**
		 * The number of filled clock segments.
		 */
		ticked: number
		/**
		 * The size of the clock to be used as the widget's `height` and `width` attributes.
		 */
		size?: string
		readonly?: boolean
	}>(),
	{ readonly: false }
)

const segmentPaths = computed(() => {
	const ret: string[] = []
	for (let i = 0; i < props.wedges; i++) {
		ret.push(pathString(i, props.wedges))
	}
	return ret
})

const $emit = defineEmits(['click'])

function click(i: number) {
	if (props.readonly === true) return
	// If 1 is marked and the click is on the first wedge, clear the clock
	if (i === 0 && props.ticked === 1) {
		i = -1
	}
	$emit('click', i + 1)
}
</script>

<style lang="scss" scoped>
.clock-segment {
	vector-effect: non-scaling-stroke;
}
svg.clock {
	// so that only *segment* hovers appear
	pointer-events: none;
	fill: var(--ironsworn-color-thematic, var(--ironsworn-color-widget-fill));
	fill-opacity: 1;
	stroke: var(--ironsworn-color-fg);
	stroke-width: var(--ironsworn-widget-stroke-width);
	aspect-ratio: 1;

	&:hover {
		fill-opacity: var(--ironsworn-clock-fill-opacity-hover);

		.clock-segment {
			&:hover {
				~ .clock-segment {
					fill-opacity: 0;
				}
			}
		}
	}

	&:not(:hover) {
		.clock-segment {
			fill-opacity: 1;

			&[aria-selected='true'] {
				~ .clock-segment {
					fill-opacity: 0;
				}
			}
		}
	}

	&[aria-valuenow='0']:not(:hover) {
		.clock-segment {
			fill-opacity: 0;
		}
	}

	&:not([aria-readonly='true']) .clock-segment {
		transition: var(--ironsworn-transition);
		cursor: pointer;
		pointer-events: visible;

		&:active {
			fill-opacity: 1;
		}
	}
	&[aria-readonly='true'] .clock-segment {
		pointer-events: none;
	}
}
</style>
