import mongoose from "mongoose";

const userCollection = 'users' //Asi es como se llamará mi colección de usuarios en mi BD

const docs = new mongoose.Schema({
    title: { 
        type: String,
        enum: ['profile', 'product', 'document'],
    },
    name: { type: String },
    reference: { type: String }
}, { timestamps: true })
  

const userSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un usuario en mi BD
    name: String,
    email: { type: String, unique: true, validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/  },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive'
    },
    uploadStatus: {
      type: Boolean,
      default: false
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "carts",
        require: true
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tickets"
    }, 
    documents: [docs],
    last_connection: {
      type: Date,
      default: new Date(),
    },
}, { timestamps: true })

userSchema.pre('find', function(){
  this.populate('cart');
  //this.populate('documents');
})

userSchema.pre('findById', function(){
  this.populate('documents');
})
export const UsersModel = mongoose.model(userCollection, userSchema);