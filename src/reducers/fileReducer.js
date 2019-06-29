export default function fileReducer(state = {amOwner:false,roomProperties:null,availableRooms:null}, action) {
  switch(action.type) {
    case 'setIsOwner':
      return {...state, amOwner: action.val};
    case 'setRoomProperties':
      return {...state, roomProperties: {...action.roomProperties}}
    case 'setAvailableRooms':
      return {...state, availableRooms: {...action.rooms}}
    default:
      return state
  }
}
