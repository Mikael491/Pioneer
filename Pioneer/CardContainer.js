import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  TouchableHighlight,
  Animated,
  PanResponder,
} from 'react-native';

import clamp from 'clamp';
import Card from './Card.js'

var apiKey = 'AIzaSyDO4ikGkFBkBem1VzMZuFYJil43jPcVz_8';

var SWIPE_THRESHOLD = 120;

class CardContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      index: this.props.index,
      collection: this.props.collection
    }
  }

// TO FIX
  _goToNextCard(){
    if(this.state.index < (this.state.collection.length - 1)){
      this.setState({
        index: this.state.index + 1,
      })
    } else {
      this.props.navigator.push({
        title: 'Pioneer'
      });
    }
  }

  componentDidMount() {
    this._animateEntrance();
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        var velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }
            // let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(this._resetState.bind(this))
            if (this.state.pan.x._value < 0){
              console.log('Left-swipe');
              this.handleDislike();
              //this.handleDislike.bind(this)
            }else{
              console.log('right-swipe');
              this.handleLike();
              //this.handleLike.bind(this)
            }
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  }

  _resetState() {
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0);
    // this._goToNextCard();
    this._animateEntrance();
  }

  _animateEntrance() {
    Animated.spring(
      this.state.enter,
      { toValue: 1, friction: 8 }
    ).start();
  }

  handleLike(){
    console.log('like');
    this._goToNextCard();
  }

  handleDislike(){
    console.log('dislike');
    this._goToNextCard();
  }

  render(){

    let { pan, enter, } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})
    let scale = enter;

    let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let yupOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    let yupScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    let animatedYupStyles = {transform: [{scale: yupScale}], opacity: yupOpacity}

    let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    // const { collection, index } = this.props;
    // const currentCard = collection[index];
    //
    // var referenceLink = currentCard.photos ? currentCard.photos[0].photo_reference : null
    // var imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${referenceLink}&key=${apiKey}`

    return(

      <View style={styles.container}>
        <Animated.View style={[styles.card, animatedCardStyles]} {...this._panResponder.panHandlers}>
          <Card cardInfo={this.state.collection[this.state.index]}/>
        </Animated.View>

        <Animated.View style={[styles.nope, animatedNopeStyles]}>
          <Image style={styles.yupText} source={require('./tinder-nope.png')}/>
        </Animated.View>

        <Animated.View style={[styles.yup, animatedYupStyles]}>
          <Image style={styles.yupText} source={require('./tinder-like.png')}/>

        </Animated.View>
        <TouchableHighlight
          style={styles.buttonLike}
          onPress={this.handleLike.bind(this)}
          underlayColor='white'>
              <Image source={require('./tinder-like.png')}/>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.buttonDislike}
          onPress={this.handleDislike.bind(this)}
          underlayColor='white'>
          <Image source={require('./tinder-nope.png')}/>
        </TouchableHighlight>
      </View>

    )
  }
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'white',
   },
   buttonLike: {
     position: 'absolute',
     top: 564,
     left: 230,
   },
   buttonDislike: {
    position: 'absolute',
    top: 540,
    left: 75,
   },
});

export default CardContainer;
