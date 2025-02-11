
import mongoose from "mongoose";
mongoose.connect('mongodb+srv://DulceBal:DB040412UT@dulcebal.6ak5g.mongodb.net/Tienda?retryWrites=true&w=majority&appName=DulceBal')
.then((db)=> console.log("MongoDB Atlas connected"))
.catch((error)=> console.error(error));
export default mongoose;