import {Schema,model} from "mongoose";

const BusinessSchema = Schema({
    name:{
        type:String,
        required:[true,'El nombre es requerido.']
    },
    description:{
        type: String,
        required:[true,'La Descripción es requerida.']
    },
    impact:{
        type:String,
        enum: ["bajo", "medio", "alto"], 
        required:[true,'El impacto es requerido.']
    },
    years:{
        type: Number,
        required:[true,'Los años de experiancia son requeridos.'],
        min: [0, "No puede ser un numero negativo."]
    },
    category:{
        type:String,
        required:[true,'La categoría es requerida.']
    },
    estado:{
        type:Boolean,
        default: true
    }
})

BusinessSchema.methods.toJSON = function () {
    const { __v, _id, ...business } = this.toObject();
    return { uid: _id, ...business };
  };

export default model('Business', BusinessSchema)