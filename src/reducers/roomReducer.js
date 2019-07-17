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
    case 'ADD_FURNISHING': {
      switch(action.name) {
        case 'bed': {
          let bed = new Bed({id:uuid(),type:"bed",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          bed.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:bed.objVal()});
          }
          return [...state,bed];
        }
        case 'chair': {
          let chair = new Chair({id:uuid(),type:"chair",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          chair.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:chair.objVal()});
          }
          return [...state,chair];
        }
        case 'desk': {
          let desk = new Desk({id:uuid(),type:"desk",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          desk.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:desk.objVal()});
          }
          return [...state,desk];
        }
        case 'table': {
          let table = new Table({id:uuid(),type:"table",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          table.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:table.objVal()});
          }
          return [...state,table];
        }
        case 'bookcase': {
          let bookcase = new BookCase({id:uuid(),type:"bookcase",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          bookcase.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:bookcase.objVal()});
          }
          return [...state,bookcase];
        }
        case 'dresser': {
          let dresser = new Dresser({id:uuid(),type:"dresser",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          dresser.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:dresser.objVal()});
          }
          return [...state,dresser];
        }
        case 'longtable': {
          let longtable = new LongTable({id:uuid(),type:"longtable",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          longtable.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:longtable.objVal()});
          } 
          return [...state,longtable];
        }
        case 'nightstand': {
          let nightstand = new NightStand({id:uuid(),type:"nightstand",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          nightstand.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:nightstand.objVal()});
          } 
          return [...state,nightstand];
        }
        case 'sofa': {
          let sofa = new Sofa({id:uuid(),type:"sofa",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          sofa.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:sofa.objVal()});
          }
          return [...state,sofa];
        }
        case 'stool': {
          let stool = new Stool({id:uuid(),type:"stool",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:action.colorName},action.colors);
          stool.renderFurnishing(action.renderer,action.camera,action.scene);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:stool.objVal()});
          }
          return [...state,stool];
        }
        default:
          break;
      }
      return state;
    }
    case 'ADD_FURNISHING_FROM_OBJECT': {
      switch(action.obj.type) {
        case 'bed': {
          let bed = new Bed(action.obj,action.colors);
          bed.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, bed];
        }
        case 'chair': {
          let chair = new Chair(action.obj,action.colors);
          chair.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, chair]
        }
        case 'desk': {
          let desk = new Desk(action.obj,action.colors);
          desk.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, desk]
        }
        case 'table': {
          let table = new Table(action.obj,action.colors);
          table.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, table]
        }
        case 'bookcase': {
          let bookcase = new BookCase(action.obj,action.colors);
          bookcase.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, bookcase]
        }
        case 'dresser': {
          let dresser = new Dresser(action.obj,action.colors);
          dresser.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, dresser]
        }
        case 'longtable': {
          let longtable =  new LongTable(action.obj,action.colors);
          longtable.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, longtable]
        }
        case 'nightstand': {
          let nightstand = new NightStand(action.obj,action.colors);
          nightstand.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, nightstand]
        }
        case 'sofa': {
          let sofa = new Sofa(action.obj,action.colors);
          sofa.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, sofa]
        }
        case 'stool': {
          let stool = new Stool(action.obj,action.colors);
          stool.renderFurnishing(action.renderer,action.camera,action.scene);
          return [...state, stool]
        }
        default:
          break;
      }
      return state;
    }
    case 'DELETE_FURNISHING': {
      var anotherFurnishingToDelete = state.find( furnishing => furnishing.id === action.furnishingId );
      if(anotherFurnishingToDelete) {
        anotherFurnishingToDelete.dispose();
      }
      return state.filter( furnishing => furnishing.id !== action.furnishingId );
    }
    case 'ROOM_LOGOUT': {
      for(var i = 0; i < state.length; i++) {
        state[i].dispose();
      }
      return [];
    }
    case 'REMOVE_ALL_FURNISHINGS': {
      for(var j = 0; j < state.length; j++) {
        state[j].dispose();
      }
      return []
    }
    default:
      return state;
  }
}
