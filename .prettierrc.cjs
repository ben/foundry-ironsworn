const prettier = require('prettier-config-standard')

/** @type {import('prettier').Config} */
module.exports = {
	...prettier,
	// spaces are crappy for accessibility: https://adamtuttle.codes/blog/2021/tabs-vs-spaces-its-an-accessibility-issue/
	useTabs: true
}
