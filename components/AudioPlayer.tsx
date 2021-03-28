import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import {Ionicons,MaterialCommunityIcons} from "@expo/vector-icons"
import { Audio } from "expo-av"
import Slider from '@react-native-community/slider';
import * as Font from "expo-font"

let customFonts = {
    "RobotoMono-Medium":require("../assets/RobotoMono-Medium.ttf")
}

export default class AudioPlayer extends Component {
    constructor(props:any){
        super(props);
        this.state={
            sound:"",
            iconName:"play-outline",
            value:"",
            ms:"",
            total:0,
            rms:0,
            loadedFont:false
        }
    }
    async _loadFont(){
        await Font.loadAsync(customFonts)
        this.setState({
            loadedFont:true
        })
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
              const sound = new Audio.Sound()
              sound.loadAsync({uri:"https://arnavg123456789.blob.core.windows.net/audiostorage/Bouncy.wav"})
            sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
            this.setState({
                sound:sound
            })
        }
        this._loadFont()
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
    msToTime(duration) {
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
            if(this.state.loadedFont){
                return(
                    <View style={styles.container}>
                        <View style={styles.controlls}>
                                <TouchableOpacity onPress={()=>this.handleFast(false)}>
                                    <MaterialCommunityIcons name="rewind-5" size={35}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.handleTouch()}>
                                    <Ionicons name={this.state.iconName} size={40}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.handleFast(true)}>
                                    <MaterialCommunityIcons name="fast-forward-5" size={35}/>
                                </TouchableOpacity>
                                <View>
                                    <Text style={{marginLeft:20, fontSize:30, fontFamily:"RobotoMono-Medium"}}>{this.props.name}</Text>
                                    <Text style={{marginLeft:20, fontFamily:"RobotoMono-Medium"}}>{this.props.source}</Text>
                                </View>
                                
                        </View>
                        <View style={styles.slideCont}>
                            <View style={{width:50}}> 
                                <Text style={{fontFamily:"RobotoMono-Medium"}}>{this.state.ms}</Text>
                            </View>
                            <Slider style={styles.slider} minimumValue={0} maximumValue={1} value={this.state.value} onValueChange={(value)=>this.setHere(value)} minimumTrackTintColor="#FF7C7C" maximumTrackTintColor="#ffd5c1" thumbTintColor="#FF7C7C"/>
                            <View style={{width:50}}>
                                <Text style={{textAlign:"right",fontFamily:"RobotoMono-Medium"}}>{this.msToTime(this.state.total)}</Text>
                            </View>
                        </View>
                    </View>
                )
            }
            else{
                return(
                    <View>
                        <Text>Loading</Text>
                    </View>
                )
            }
    }
}

const styles = StyleSheet.create({
    controlls:{
        flexDirection:"row"
    },
    slideCont:{
        flexDirection:"row"
    },
    slider:{
        width:200
    }
    
});
