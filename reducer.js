const initialState={ favoritesFilm: []}
export default function toggleFavorite(state= initialState, action){
  let nextState
  switch(action.type){
    case 'TOGGLE_FAVORITE':
      const favoriteFilmIndex=state.favoritesFilm.findIndex(item=> item.id === action.value.id)
      if(favoriteFilmIndex!==-1){
        nextState = {
          ...state,
          favoritesFilm: state.favoritesFilm.filter( (item, index) => index !== favoriteFilmIndex)
        }
      }
      else {
        nextState = {
          ...state,
          favoritesFilm: [...state.favoritesFilm, action.value]
        }
      }
      return nextState || state
  default:
    return state
  }
}
