import os from 'os'
import {playwrightLauncher} from '@web/test-runner-playwright'
import {esbuildPlugin} from '@web/dev-server-esbuild'

export default {
	browsers: [
		playwrightLauncher({product: 'chromium'}),
		playwrightLauncher({product: 'firefox'}),

		// Edge is not yet working, even in windows-latest. (https://github.com/microsoft/playwright/issues/23783)
		// playwrightLauncher({product: 'msedge'}),

		// Skip webkit in Windows, it doesn't have WebAssembly (https://github.com/microsoft/playwright/issues/2876)
		...(os.platform().startsWith('win') ? [] : [playwrightLauncher({product: 'webkit'})]),
	],
	plugins: [esbuildPlugin({ts: true})],
}
