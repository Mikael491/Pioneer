import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  TouchableHighlight,
} from 'react-native';

class Card extends Component {

  clickOnImage(){
    console.log("clicked")
  }

  render(){
    var imageLink = this.props.cardInfo.photos[0]


    return(

      <View style={styles.container}>
      <TouchableHighlight
          onPress={this.clickOnImage}
          underlayColor='white'
        >
        <Image style={styles.image} source={{uri: imageLink}}/>
      </TouchableHighlight>
        <Text style={styles.welcome}>
          {this.props.cardInfo.name}
        </Text>
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
   welcome: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   image:{
     height:380,
     width:360,
     borderRadius:50,
   },
});

export default Card;
