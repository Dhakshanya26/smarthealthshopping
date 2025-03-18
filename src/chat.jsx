import { useState } from 'react'
import { View, Text } from '@aws-amplify/ui-react';

export default function chat() {
    const [count, setCount] = useState(0)

    return (
        <View>
            <Text>
                Hello World!
            </Text>
        </View>
    )
}