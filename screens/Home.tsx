import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AudioPlayer from '../components/AudioPlayer'


export default function Home() {
    return (
        <View style={styles.container}>
            <Text>Hello</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})
