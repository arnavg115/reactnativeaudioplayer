import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import {Ionicons} from "@expo/vector-icons"
import { Audio } from "expo-av"
import Slider from '@react-native-community/slider';

export default class AudioPlayer extends Component {
    constructor(props:any){
        super(props);
        this.state={
            sound:"",
            iconName:"play-outline",
            value:"",
            ms:"",
            total:0,
            rms:0
        }
    }
    setHere = async (value:any) => {
        const {total,rms}=this.state
        var h = value*total;
        var cor = this.msToTime(h);
        this.setState({
            ms:cor
        })
        if(Math.abs(h-rms)>10){
            await this.state.sound.setPositionAsync(h)
        }
    }
    _onPlaybackStatusUpdate = (playbackStatus:any) => {
        if (!playbackStatus.isLoaded) {
          // Update your UI for the unloaded state
          if (playbackStatus.error) {
            alert(`Encountered a fatal error during playback: ${playbackStatus.error}`);
          }
        } else {
          // Update your UI for the loaded state
      
          if (playbackStatus.isPlaying) {
            this.setState({
                iconName:"pause-outline"
            })
            var i = playbackStatus.durationMillis
            var t = playbackStatus.positionMillis
            var cor = this.msToTime(t)
            this.setState({
                value:(t/i),
                ms:cor,
                total:i,
                rms:t
            })
          } else {
            this.setState({
                iconName:"play-outline"

            })
          }
      
      
          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            this.setState({
                iconName:"play-outline"
            })
          }
      
        }
      };
    componentDidMount(){
        
        

        const load = async () =>{
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
                playThroughEarpieceAndroid: true,
              })
            const { sound } = await Audio.Sound.createAsync(
                require("../assets/Bouncy.mp3")
            )
            sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
            this.setState({
                sound:sound
            })
        }
        load()
    }
    async handleFast(forward:boolean){
        const {rms} = this.state;
        if(forward){
            this.setState({
                ms:this.msToTime(rms+5000)

            })
            await this.state.sound.setPositionAsync(rms+5000)
        }
        else if(!forward && rms>5000){
            this.setState({
                ms:this.msToTime(rms-5000)
            })
            await this.state.sound.setPositionAsync(rms-5000)
        }
    }
    msToTime(duration:any) {
        var milliseconds = parseInt((duration%1000))
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);
        
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        
        return minutes + ":" + seconds ;
     }
   async handleTouch (){
       if(this.state.iconName === "play-outline"){
            await this.state.sound.playAsync()
            
       }
       else{
           await this.state.sound.pauseAsync()
       }
   } 
    render() {
        return (
            <View>
                <View style={styles.controls}>
                    
                    <TouchableOpacity onPress={()=>this.handleFast(false)}>
                        <Ionicons name="play-back-outline" size={40}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleTouch()}>
                        <Ionicons name={this.state.iconName} size={40}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleFast(true)}>
                        <Ionicons name="play-forward-outline" size={40}/>
                    </TouchableOpacity>
                </View>
                <Slider style={{width:200,height:40}} minimumValue={0} maximumValue={1} value={this.state.value} onValueChange={(value)=>this.setHere(value)}/>
                <View style={{flex:1,flexDirection:"row"}}>
                <Text>{this.state.ms}</Text>
                <Text style={{textAlign:"right",flex:1}}>{this.msToTime(this.state.total)}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    controls:{
        flexDirection:"row",
        flex:1,
        alignContent:"center",
        justifyContent:"center"
    },
    botttom:{
        flex:1,
        alignContent:"flex-end"
    }
})
