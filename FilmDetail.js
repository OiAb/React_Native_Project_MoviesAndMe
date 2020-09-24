import React, { Component } from 'react'
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, Button, TouchableOpacity, Share, Platform} from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from './TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import EnlargeShrink from './EnlargeShrink'

class FilmDetail extends Component{
  static navigationOptions = ({ navigation }) => {
      const { params } = navigation.state
      // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
      if (params.film != undefined && Platform.OS === 'ios') {
        return {
            // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
            headerRight: <TouchableOpacity
                            style={styles.share_touchable_headerrightbutton}
                            onPress={() => params.shareFilm()}>
                            <Image
                              style={styles.share_image}
                              source={require('./ic_share.png')} />
                          </TouchableOpacity>
        }
      }
  }
  constructor(props){
    super(props)
    this.state={film: undefined, isLoading: false}
    this._toggleFavorite = this._toggleFavorite.bind(this)
    this._shareFilm = this._shareFilm.bind(this)
  }
  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareFilm: this._shareFilm,
      film: this.state.film
    })
  }
  componentDidMount() {
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
    if (favoriteFilmIndex !== -1) {
      this.setState({
        film: this.props.favoritesFilm[favoriteFilmIndex]
      }, () => { this._updateNavigationParams() })
      return
    }
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      }, () => { this._updateNavigationParams() })
    })
  }
  /*componentDidUpdate() {
    console.log("componentDidUpdate : ")
    console.log(this.props.favoritesFilm)
  }*/
  _displayLoading() {
      if (this.state.isLoading) {
        return (
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
        )
      }
  }
  _toggleFavorite(){
    const action= {type: 'TOGGLE_FAVORITE', value: this.state.film}
    this.props.dispatch(action)
  }
  _displayFavoriteImage(){
    var sourceImage = require('./ic_favorite_border.png')
    var shouldEnlarge = false
    if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
      shouldEnlarge = true
      sourceImage = require('./ic_favorite.png')
    }
    return (
      <EnlargeShrink
        shouldEnlarge={shouldEnlarge}>
        <Image
          style={styles.favorite_image}
          source={sourceImage}
        />
      </EnlargeShrink>
    )
  }
  _displayFilm() {
    if (this.state.film != undefined) {
      return (
        <ScrollView style={styles.scrollview_container}>
          <Image
            style={styles.image}
            source={{uri: getImageFromApi(this.state.film.backdrop_path)}}
          />
          <Text style={styles.title_text}>{this.state.film.title}</Text>
          <TouchableOpacity style={styles.favorite_container}onPress={() => this._toggleFavorite()}>
            {this._displayFavoriteImage()}
          </TouchableOpacity>
          <Text style={styles.description_text}>{this.state.film.overview}</Text>
          <Text style={styles.default_text}>Sorti le {moment(new Date(this.state.film.release_date)).format('DD/MM/YYYY')}</Text>
          <Text style={styles.default_text}>Note : {this.state.film.vote_average} / 10</Text>
          <Text style={styles.default_text}>Nombre de votes : {this.state.film.vote_count}</Text>
          <Text style={styles.default_text}>Budget : {numeral(this.state.film.budget).format('0,0[.]00 $')}</Text>
          <Text style={styles.default_text}>Genre(s) : {this.state.film.genres.map(function(genre){
              return genre.name;
            }).join(" / ")}
          </Text>
          <Text style={styles.default_text}>Companie(s) : {this.state.film.production_companies.map(function(company){
              return company.name;
            }).join(" / ")}
          </Text>
        </ScrollView>
      )
    }
  }
  _shareFilm() {
    const { film } = this.state
    Share.share({ title: film.title, message: film.overview })
  }
  _displayFloatingActionButton() {
    const { film } = this.state
    if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this._shareFilm()}>
          <Image
            style={styles.share_image}
            source={require('./ic_share.png')} />
        </TouchableOpacity>
      )
    }
}
  render(){
    return(
      <View style={styles.main_container}>
      {this._displayLoading()}
      {this._displayFilm()}
      {this._displayFloatingActionButton()}
      </View>
    )
  }
}
const styles=StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1
  },
  image: {
    height: 169,
    margin: 5
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 35,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
    textAlign: 'center'
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
    margin: 5,
    marginBottom: 15
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  favorite_container: {
    alignItems: 'center'
  },
  favorite_image:{
    flex: 1,
    width: null,
    height: null
  },
  share_touchable_floatingactionbutton: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center'
  },
  share_image: {
    width: 30,
    height: 30
  },
  share_touchable_headerrightbutton: {
    marginRight: 8
  }
})
const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}
export default connect(mapStateToProps)(FilmDetail)
