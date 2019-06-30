export default function fileReducer(state = {amOwner:false,roomProperties:null,availableRooms:null}, action) {
  switch(action.type) {
    case 'SET_IS_OWNER':
      return {...state, amOwner: action.val};
    case 'SET_ROOM_PROPERTIES':
      return {...state, roomProperties: {...action.roomProperties}}
    case 'SET_AVAILABLE_ROOMS':
      return {...state, availableRooms: {...action.rooms}}
    case 'RESET_FILE':
      return {...state,amOwner:false,roomProperties:null};
    case 'FILE_LOGOUT':
      return {amOwner:false,roomProperties:null,availableRooms:null};
    default:
      return state
  }
}
