import Furnishing from '../furnishings/furnishing';
import Table from '../furnishings/table';
import LongTable from '../furnishings/longtable';
import Stool from '../furnishings/stool';
import Chair from '../furnishings/chair';
import Bed from '../furnishings/bed';
import Dresser from '../furnishings/dresser';
import Desk from '../furnishings/desk';
import NightStand from '../furnishings/nightstand';
import Sofa from '../furnishings/sofa';
import BookCase from '../furnishings/bookcase';
import uuid from 'uuid/v4';


export default function roomReducer(state = [], action) {
  switch(action.type) {
    case 'ADD_FURNISHING':
      switch(action.name) {
        case 'bed':
          let bed = new Bed({id:uuid(),type:"bed",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:bed.objVal()});
          }
          return [...state,bed];
        case 'chair':
          let chair = new Chair({id:uuid(),type:"chair",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:chair.objVal()});
          }
          return [...state,chair];
        case 'desk':
          let desk = new Desk({id:uuid(),type:"desk",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors)
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:desk.objVal()});
          }
          return [...state,desk];
        case 'table':
          let table = new Table({id:uuid(),type:"table",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:table.objVal()});
          }
          return [...state,table];
        case 'bookcase':
          let bookcase = new BookCase({id:uuid(),type:"bookcase",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:bookcase.objVal()});
          }
          return [...state,bookcase];
        case 'dresser':
          let dresser = new Dresser({id:uuid(),type:"dresser",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:dresser.objVal()});
          }
          return [...state,dresser];
        case 'longtable':
          let longtable = new LongTable({id:uuid(),type:"longtable",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:longtable.objVal()});
          } 
          return [...state,longtable];
        case 'nightstand':
          let nightstand = new NightStand({id:uuid(),type:"nightstand",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:nightstand.objVal()});
          } 
          return [...state,nightstand];
        case 'sofa':
          let sofa = new Sofa({id:uuid(),type:"sofa",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:sofa.objVal()});
          }
          return [...state,sofa];
        case 'stool':
          let stool = new Stool({id:uuid(),type:"stool",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:stool.objVal()});
          }
          return [...state,stool];
        default:
          break;
      }
      break;
    case 'ADD_FURNISHING_FROM_OBJECT':
      var furnishingToDelete = state.find( furnishing => furnishing.id === action.obj.id );
      if(furnishingToDelete) {
        furnishingToDelete.dispose();
      }
      switch(action.obj.type) {
        case 'bed':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new Bed(action.obj,action.colors)]
        case 'chair':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new Chair(action.obj,action.colors)]
        case 'desk':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new Desk(action.obj,action.colors)]
        case 'table':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new Table(action.obj,action.colors)]
        case 'bookcase':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new BookCase(action.obj,action.colors)]
        case 'dresser':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new Dresser(action.obj,action.colors)]
        case 'longtable':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new LongTable(action.obj,action.colors)]
        case 'nightstand':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new NightStand(action.obj,action.colors)]
        case 'sofa':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new Sofa(action.obj,action.colors)]
        case 'stool':
          return [...state.filter( furnishing => furnishing.id !== action.obj.id ), new Stool(action.obj,action.colors)]
        default:
          break;
      }
      break;
    case 'DELETE_FURNISHING':
      var furnishingToDelete = state.find( furnishing => furnishing.id === action.furnishingId );
      if(furnishingToDelete) {
        furnishingToDelete.dispose();
      }
      return state.filter( furnishing => furnishing.id !== action.furnishingId );
    case 'ROOM_LOGOUT':
      for(var i = 0; i < state.length; i++) {
        state[i].dispose();
      }
      return [];
    case 'UPDATE_COLOR':
      let furnishingCol = state.find( furnishing => furnishing.id === action.furnishingId );
      if(furnishingCol) {
        furnishingCol.colorName = action.colorName;
        furnishingCol.dispose();
        return [...state.filter(furnishing => furnishing.id !== action.furnishingId),
          furnishingCol.clone(action.colors)];
      } else {
        return state;
      }
    case 'REMOVE_ALL_FURNISHINGS':
      for(var i = 0; i < state.length; i++) {
        state[i].dispose();
      }
      return []
    case 'MOVE_X':
      let newStateX = state.map(
        furnishing => {
          furnishing.dispose();
          return furnishing.clone(action.colors, furnishing.id === action.furnishingId);
        }
      );
      let furnishingX = newStateX.find( furnishing => furnishing.id === action.furnishingId );
      furnishingX.posx += action.dx;
      return newStateX;
    case 'MOVE_Z':
      let newStateZ = state.map(
        furnishing => {
          furnishing.dispose();
          return furnishing.clone(action.colors, furnishing.id === action.furnishingId);
        }
      );
      let furnishingZ = newStateZ.find( furnishing => furnishing.id === action.furnishingId );
      furnishingZ.posz += action.dz;
      return newStateZ;
    case 'MOVE_THETA':
      let newStateTheta = state.map(
        furnishing => {
          furnishing.dispose();
          return furnishing.clone(action.colors, furnishing.id === action.furnishingId);
        }
      );
      let furnishingTheta = newStateTheta.find( furnishing => furnishing.id === action.furnishingId );
      furnishingTheta.theta += action.dtheta;
      return newStateTheta;
    case 'BRIGHTEN':
      return state.map(
        furnishing => {
          furnishing.dispose();
          return furnishing.clone(action.colors, furnishing.id === action.furnishingId);
        }
      );
    case 'DIM':
      return state.map(
        furnishing => {
          furnishing.dispose();
          return furnishing.clone(action.colors);
        }
      );
    default:
      return state;
  }
}
