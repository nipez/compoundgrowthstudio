import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '4rag8303',
    dataset: 'production',
  },
  studioHost: 'cgs-marketing',
  deployment: {
    appId: 'n1tf1r5hv2433tmixhtbsiqw',
    autoUpdates: true,
  },
})
