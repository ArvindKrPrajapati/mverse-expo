import React from 'react'
import { Text, View } from '../components/Themed'
import { useRoute } from '@react-navigation/native';

const ErrorPage = () => {
    const route=useRoute()

    
  return (
    <View style={{flex:1,justifyContent:"center",alignSelf:"center"}}>
        {/* @ts-ignore */}
      <Text style={{fontSize:20,fontWeight:'bold'}}>{route?.params?.message || "something went wrong"}</Text>
    </View>
  )
}

export default ErrorPage