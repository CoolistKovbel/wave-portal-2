import { WagmiConfig, createClient } from 'wagmi'

import Profile from './components/Profile'

const client = createClient()

function App() {
  return (
    <WagmiConfig client={client}>
      <Profile />
    </WagmiConfig>
  )
}