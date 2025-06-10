import { Text, View } from 'react-native'
import { registerRootComponent } from 'expo'

function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hello Mobile</Text>
    </View>
  )
}

registerRootComponent(App)
