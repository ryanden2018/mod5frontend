
// fileReducer
//   Handles global properties related to the currently open room.
// 
// state keys: amOwner, roomProperties, availableRooms
//         amOwner: boolean indicates whether the current user
//                  owns the room which is currently open
//         roomProperties: an object containing the dimensions and name of the
//                  room which is currently open
//         availableRooms: an object containing the information for all rooms
//                   available for the current user to open
//
// action.type must be one of 'SET_IS_OWNER', 'SET_ROOM_PROPERTIES',
//              'SET_AVAILABLE_ROOMS', 'RESET_FILE, or 'FILE_LOGOUT'
//
// 'SET_IS_OWNER' sets the amOwner key of state to action.val
// 'SET_ROOM_PROPERTIES' sets the roomPropreties key of state to action.roomProperties
// 'SET_AVAILABLE_ROOMS' sets the availableRooms key of state to action.rooms
// 'RESET_FILE' resets the amOwner and roomProperties keys; call which closing a room
// 'FILE_LOGOUT' resets all the keys; call when logging out

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
