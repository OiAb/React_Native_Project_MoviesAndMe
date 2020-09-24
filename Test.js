import { ..., PanResponder, Dimensions } from 'react-native'

class Test extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      topPosition: 0,
      leftPosition: 0,
    }

    var {height, width} = Dimensions.get('window');
    this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
            let touches = evt.nativeEvent.touches;
            if (touches.length == 1) {
                this.setState({
                  topPosition: touches[0].pageY - height/2,
                  leftPosition: touches[0].pageX - width/2
                })
            }
        }
    })
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View
          {...this.panResponder.panHandlers}
          style={[styles.animation_view, { top: this.state.topPosition, left: this.state.leftPosition }]}>
        </View>
      </View>
    )
  }
}
/*
class Test extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      topPosition: new Animated.Value(0),
      leftPosition: new Animated.Value(0),
    }
  }

  componentDidMount() {
    Animated.parallel([
      Animated.spring(
        this.state.topPosition,
        {
          toValue: 100,
          tension: 8,
          friction: 3
        }
      ),
      Animated.timing(
        this.state.leftPosition,
        {
          toValue: 100,
          duration: 1000,
          easing: Easing.elastic(2)
        }
      )
    ]).start()
  }

  render() {
    return (
      <View style={styles.main_container}>
        <Animated.View style={[styles.animation_view, { top: this.state.topPosition, left: this.state.leftPosition }]}></Animated.View>
      </View>
    )
  }
}
*/
