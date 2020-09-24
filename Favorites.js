import React, { Component }  from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FilmItem from './FilmItem'
import FilmList from './FilmList'
import { connect } from 'react-redux'


class Favorites extends Component {
  constructor(props){
    super(props)
    this.state={isLoading: false}
    this.page=1
    this.totalPages=0
  }
  _displayLoading() {
      if (this.state.isLoading) {
        return (
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
        )
      }
    }
    _loadFilms(){}
  render() {
    return (
      <View style={styles.main_container}>
        <FilmList
          films={this.props.favoritesFilm} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
          navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
          loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
          page={this.page}
          totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
        />
        {this._displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
   flex: 1
 },
 loading_container: {
   position: 'absolute',
   left: 0,
   right: 0,
   top: 100,
   bottom: 0,
   alignItems: 'center',
   justifyContent: 'center'
 }
})
const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}
export default connect(mapStateToProps)(Favorites)
