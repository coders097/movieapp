import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"avatar.jpg"
    },
    bookmarks:{
        movies:[{
            backdrop_path:String,
            genre_ids:[
                {
                    type:Number
                }
            ],
            id:Number,
            original_title:String,
            overview:String,
            poster_path:String,
            release_date:String,
            vote_average:Number
        }],
        shows:[{
            backdrop_path:String,
            genre_ids:[
                {
                    type:Number
                }
            ],
            id:Number,
            overview:String,
            poster_path:String,
            release_date:String,
            vote_average:Number,
            name:String,
            first_air_date:String
        }],
        actors:[{
            gender:Number,
            id:Number,
            known_for_department:String,
            name:String,
            profile_path:String
        }]
    }
});

const User=mongoose.model("user",UserSchema);
export default User;